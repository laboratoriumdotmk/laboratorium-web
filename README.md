# Laboratorium — laboratorium.mk

Билингвален маркетинг/заедница веб-сајт за **Laboratorium**, слободен културно-едукативен центар во Скопје.

Built with **Payload CMS 3.x** + **Next.js 16** (App Router) + **PostgreSQL** + **Tailwind CSS**.

---

## Stack

| Layer | Tech |
|---|---|
| CMS | Payload CMS 3.x (Next.js-native) |
| Frontend | Next.js 16, App Router, TypeScript |
| Database | PostgreSQL (via `@payloadcms/db-postgres`) |
| Storage | Cloudflare R2 (`@payloadcms/storage-s3`) — local disk in dev |
| Email | Resend (`@payloadcms/email-resend`) or SMTP |
| Styling | Tailwind CSS v4, custom design system |
| Fonts | Spectral (display, Cyrillic), Geist Sans + Mono |
| Animation | Framer Motion (`motion`) |
| Deployment | Railway (primary) or Docker/Coolify |

---

## Local Setup

### Prerequisites

- Node.js ≥ 24
- pnpm ≥ 9
- PostgreSQL 15+ (or use Docker)

### 1. Clone & install

```bash
git clone https://github.com/your-org/laboratorium-web.git
cd laboratorium-web
pnpm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
# Edit .env.local — set DATABASE_URI and PAYLOAD_SECRET at minimum
```

### 3. Start a local Postgres (Docker)

```bash
docker run -d \
  --name laboratorium-pg \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=laboratorium \
  -p 5432:5432 \
  postgres:16-alpine
```

### 4. Run migrations

```bash
pnpm payload migrate
```

### 5. Seed real content

```bash
pnpm seed
```

This creates: admin user, site settings, header/footer nav, 6 spaces, 3 sample events, 4 projects, 2 makers, 1 news post.

### 6. Start the dev server

```bash
pnpm dev
# Open http://localhost:3000
# Admin: http://localhost:3000/admin
```

---

## Production migrations

Always use migrations — never `payload migrate:create --fresh` in production.

```bash
# Create a migration after changing collections
pnpm payload migrate:create --name add-events-collection

# Apply pending migrations
pnpm payload migrate
```

---

## Deploying to Railway

1. Create a new Railway project, add a **PostgreSQL** plugin.
2. Add your repo.
3. Set all env vars from `.env.example` in Railway's Variables panel.
4. Railway auto-detects `package.json` and runs `pnpm build && pnpm start`.
5. Add a **deploy hook** or start command: `pnpm payload migrate && pnpm start`.

### Cloudflare in front

1. Point `laboratorium.mk` DNS to Railway via Cloudflare (proxied).
2. Enable **Cache Rules** for static assets (`/_next/static/*`, `/media/*`).
3. Add a **Page Rule** to bypass cache for `/admin/*` and `/api/*`.

---

## Deploying to Coolify / VPS (Docker)

```bash
# Build image
NEXT_OUTPUT=standalone docker build \
  --build-arg DATABASE_URI="$DATABASE_URI" \
  --build-arg PAYLOAD_SECRET="$PAYLOAD_SECRET" \
  --build-arg NEXT_PUBLIC_SERVER_URL="https://laboratorium.mk" \
  -t laboratorium-web .

# Or use docker-compose
docker-compose up -d
```

The compose file starts the app + PostgreSQL. Migrations run on startup.

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URI` | ✅ | PostgreSQL connection string |
| `PAYLOAD_SECRET` | ✅ | Long random secret for JWT encryption |
| `NEXT_PUBLIC_SERVER_URL` | ✅ | Public URL (no trailing slash) |
| `S3_ENDPOINT` | R2 | Cloudflare R2 endpoint URL |
| `S3_BUCKET` | R2 | R2 bucket name |
| `S3_ACCESS_KEY_ID` | R2 | R2 access key |
| `S3_SECRET_ACCESS_KEY` | R2 | R2 secret key |
| `S3_REGION` | R2 | Usually `auto` for R2 |
| `NEXT_PUBLIC_CDN_URL` | R2 | Public CDN URL for media |
| `RESEND_API_KEY` | Email | Resend API key |
| `SMTP_HOST` | Email | SMTP server (fallback if no Resend key) |
| `CONTACT_EMAIL` | ✅ | Where contact form submissions go |
| `SEED_ADMIN_EMAIL` | Seed | Admin email for `pnpm seed` |
| `SEED_ADMIN_PASSWORD` | Seed | Admin password for `pnpm seed` |
| `CRON_SECRET` | Optional | Authenticate scheduled job triggers |
| `NEXT_OUTPUT` | Docker | Set to `standalone` for Docker builds |

---

## How to Manage Content (For Editors)

### Logging in

1. Go to `https://laboratorium.mk/admin`
2. Use the email and password created during setup.
3. **Change your password** after first login via the top-right menu → Account.

### Adding an Event

1. In the sidebar, click **Events**.
2. Click **Create New**.
3. Fill in: **Title** (Macedonian first, then English tab), **Type**, **Start** date/time, **Space**, **Summary**, and optionally **Featured Image** and **Body**.
4. Set status to **Published** (top right).
5. Click **Save**.

The event appears on `/programs` within ~60 seconds (ISR revalidation).

### Uploading Photos

1. Click **Media** in the sidebar.
2. Drag & drop your image or click **Upload**.
3. **Always fill in the Alt Text** — it's required for accessibility and SEO.
4. You can now use this image anywhere via the image picker.

### Editing a Page (About, Get Involved, etc.)

1. Click **Pages** in the sidebar.
2. Find the page (e.g., "About").
3. Edit the blocks — add, remove, or reorder sections using the layout builder.
4. Use **Live Preview** (the eye icon) to see changes before publishing.
5. Click **Save & Publish**.

### Adding a Maker to Lab Design Market

1. Click **Makers / Vendors** in the sidebar.
2. Fill in: Name, Slug (URL-safe, e.g. `ana-design`), Craft, Bio, Photo, and Social links.
3. Set status to **Published**.
4. Save.

### Switching Language (Admin)

The admin panel shows all localized fields with a language selector at the top. Click **МКД / ENG** to switch between Macedonian and English content.

### Publishing Workflow

All content supports **Draft → Publish** workflow:
- Save as **Draft** to preview without going public.
- Set to **Published** to make it live.
- Use **Schedule Publish** to publish at a future date/time.

---

## TODO (before launch)

- [ ] Supply real photography from the team — replace `⚗` placeholders
- [ ] Native English review of all EN translations (marked `// TODO: native review`)
- [ ] Confirm exact opening hours with the team
- [ ] Set up Cloudflare R2 bucket and fill in `S3_*` env vars
- [ ] Set up Resend account and fill in `RESEND_API_KEY`
- [ ] Configure Google Analytics / Plausible via `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`
- [ ] Add real partner logos to the About page
- [ ] Set up ticketing/RSVP integration for events
- [ ] Future: online shop for Lab Design Market
