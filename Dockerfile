# Multi-stage Dockerfile for Laboratorium (Next.js standalone + Payload CMS)
# Requires `output: 'standalone'` in next.config.ts

FROM node:24-alpine AS base
RUN apk add --no-cache libc6-compat

# ── Dependencies ──────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# ── Builder ───────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--no-deprecation"

# Build requires DB to be reachable for payload generate:types
# Pass DATABASE_URI as a build arg or skip type generation in CI
ARG DATABASE_URI
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000

ENV DATABASE_URI=$DATABASE_URI
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

RUN corepack enable pnpm && pnpm run build

# ── Runner ────────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# Run migrations then start the app
CMD sh -c "node -e \"require('./server.js')\" & sleep 5 && node_modules/.bin/payload migrate --cwd . 2>&1; wait"
# Simpler alternative (run migrations at build time via railway/coolify deploy hooks):
# CMD HOSTNAME="0.0.0.0" node server.js
