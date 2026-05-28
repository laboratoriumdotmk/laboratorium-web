# Claude Code Build Prompt — Laboratorium Website (laboratorium.mk)

> Paste this whole document into Claude Code as the initial brief (or keep it as `BRIEF.md` and reference it). It contains all the project context, real seed content, design direction, the CMS architecture, page specs, and build steps needed to produce the site from scratch.
>
> **All facts about Laboratorium in §1–§2 are real and verified — use them as the seed content. Do not invent fake people, testimonials, or awards beyond what is listed.**
>
> Content will be maintained by a **non-technical person**, so the Payload admin experience and field clarity matter as much as the public site. Work incrementally, commit after each milestone, run build/lint after major steps, and consult the latest Payload docs (https://payloadcms.com/docs) since the API evolves — do not rely on memory for exact APIs.

---

## 0. Your task

Build a new, production-ready, **bilingual (Macedonian + English)** marketing/community website for **Laboratorium**, a free cultural-educational center in Skopje, North Macedonia. Start from the Payload `website` template and extend it.

Deliver a fully working, responsive, accessible site with all the pages and content defined below, an **editorial design inspired by luakabop.com**, and a **Payload CMS** content model that lets the team add events, spaces, projects, makers, and journal posts — and edit info pages — **without touching code**.

The site is dynamic (admin-managed content + a contact form) but most public pages change rarely, so it must be fast and cheap to run via **static generation + on-demand revalidation**; the admin panel stays dynamic.

Work autonomously through the build steps in §13. Run the dev server, screenshot key pages, and self-review against the design principles in §4 before declaring done.

---

## 1. About Laboratorium (source of truth for copy)

**One-liner:** Laboratorium is a free cultural-educational center in Skopje — *"a laboratory of beautiful things"* — where artists, designers, makers, and young creatives meet, learn, experiment, and build community.

**Origin & setting:** Founded **December 2024**. Housed in the cavernous former print house (hall) of *Nova Makedonija*, the country's former national daily newspaper — a raw industrial space repurposed by young artists from many disciplines into a single creative ecosystem. Lean into this print-house heritage in the design (ink, paper, typography, newspaper grids).

**Traction & recognition:**
- 180+ events, workshops, exhibitions, concerts, and educational seminars since opening.
- Built with the support of 80+ partner organizations across culture and civil society.
- **Finalist for the New European Bauhaus Award 2024**, selected out of 600+ European projects.
- Member of European creative-sector networks: **Trans Europe Halles (TEH)**, **European Network of Cultural Centres (ENCC)**, and the **European Creative Hubs Network (ECHN)**.

**Three-pillar mission (use as the "What we do" structure):**
1. **Community & creative space** — a free, welcoming, multi-use space where future artists and creators meet, exchange ideas, and create together. Workshops, craft classes, seminars, concerts, exhibitions, screenings.
2. **Incubator for social & community-driven projects** — events and initiatives, run directly or with partners and across all generations, aimed at improving the cultural and social environment, especially engaging young people toward a better future. The space stays accessible to those working for positive change.
3. **Craft & design revival (Lab Design Market)** — reviving fading Macedonian crafts and artisanal work, making these professions attractive to young people, and offering makers a direct sales channel.

**Positioning line to feature:** *"Laboratorium represents what Skopje has the potential to be."*

**Voice:** warm, optimistic, community-first, a little playful and experimental; bilingual MK/EN. Avoid corporate stiffness.

### Spaces (seed the `spaces` collection)
- **Lab-Factory** — main stage / main hall, ~750 m²
- **Lab-Bar & Terrace** — small stage + bar/café, ~150 m²
- **Edu-Lab** — classroom / workshop room, ~100 m²
- **Lab-Living Room** — exhibition space, ~25 m²
- **Lab Design Market** — exhibition hall + community of Macedonian designers & craftspeople (15+ local brands)
- **Lab Re:store** — small market for repurposing/upcycling older fashion articles and accessories

### Facilities (icon list / amenities)
Bar & Café · Cinema · Event Space · Exhibition Space · Indoor & Outdoor Communal Spaces · Library · Meeting / Workshop Room · Shop · Stage / Rehearsal Room

### Services
Co-working space · Community engagement · Design services · Educational programs · Networking & events · Project execution · Artist residencies · Commercial space rental

### Sectors served
Music · Performing Arts · Festivals · Visual Arts · Audiovisual (Film, TV & Radio) · Design & Fashion · Artistic Crafts

### Example projects/programs (seed the `projects` collection; team will add more)
- **Music ensemble** — helps young musicians leave the garage and find band-mates, countering the city's isolated "micro-cosmos" friend-group culture.
- **"Unnamed" creative-writing workshop** — hosted with *Duma in Summa*; instructors Marija Boškovska, Ivana Smilevska, and Darko Aleksovski.
- **Summer multi-events** — exhibitions, documentaries, dance parties, and book readings for people spending summer in Skopje; something for all generations.
- **Craft & artisan programs** — via Lab Design Market & Lab Re:store.
- Initiatives like Earth Hour participation (with partners such as ZIPP Club).

> Treat events / projects / makers as CMS-driven. Seed the real entries above, then make it easy to add more.

---

## 2. Contact & identity facts (footer, contact page, schema.org, `site-settings` global)

- **Name:** Laboratorium (Cyrillic: Лабораториум) — sometimes styled "ЕДУКАТИВЕН КУЛТУРЕН ЦЕНТАР" (Educational Cultural Center)
- **Address:** Blvd. Kliment Ohridski 68, 1000 Skopje, North Macedonia (entrance also referenced as 12-та Македонска Ударна бригада бр. 2А)
- **Email:** contact@laboratorium.mk
- **Phone:** +389 72 905 555 (alt: +389 2 314 2044)
- **Instagram:** @lab.ratorium (https://instagram.com/lab.ratorium)
- **Facebook:** Laboratorium (https://www.facebook.com/lab.rat.rium/)
- **Linktree:** https://linktr.ee/lab.ratorium
- **Contact person:** Kalina Dukovska
- **Hours:** Mon–Sun (verify exact hours with the team before launch — placeholder: daily, evenings for events)

Embed a Google Map of the Kliment Ohridski 68 location. Add JSON-LD `LocalBusiness`/`PerformingArtsTheater` structured data with the above, plus `Event` structured data for event detail pages.

---

## 3. Design reference analysis — luakabop.com (Alright Studio × CEMENT)

We want Laboratorium's **public site** to feel like a cousin of Luaka Bop's: an independent label site that reads like a well-made editorial object. Distil and adapt these moves — **do not copy assets or fonts 1:1; reinterpret for a Macedonian creative center with print-house DNA.**

> **Important:** The Payload `website` template ships with generic default styling and demo blocks. Keep the template's *infrastructure* (Pages collection, layout blocks, rich text, live preview, on-demand revalidation, SEO plugin) but **replace its visual design entirely** with the editorial system below. Remove demo content/blocks you don't use.

**What to borrow:**
- **Editorial, paper-like canvas.** Warm off-white/cream background, near-black ink text, high contrast. Feels like good print stock, not a SaaS dashboard.
- **A living logo.** Luaka Bop cycles its logo through hand-drawn variants. Build a **Laboratorium wordmark that mutates** — on load/hover it swaps between 3–5 typographic treatments, or letters get "re-set" like movable type. Tie it to the print-house story.
- **A signature motif.** Give Laboratorium one recurring mark — a flask/beaker, an inkblot, an asterisk, or a "✶/⚗" — used as bullet, divider, and favicon.
- **A manifesto tagline.** Lead the hero with a bold manifesto line (e.g. *"A laboratory of beautiful things."* / *"Лабораторија за убави нешта."*).
- **Footnote / annotation device.** Marginal notes / superscripts for asides, translations, and credits.
- **Type pairing.** Big expressive **display** face (a characterful serif or grotesque) for headlines + a **utilitarian sans or mono** for body and UI. A **mono for metadata** (dates, m², credits) reinforces the lab/print feel. Ensure all chosen fonts render Cyrillic correctly.
- **Collage image grids.** Mixed-size, slightly irregular photo grids that feel scrapbook-curated, not uniform cards. Subtle rotation/offset welcome.
- **Confident navigation.** Simple top nav with named sections; a clear, content-rich footer with newsletter signup + socials + credit line.
- **Motion with restraint.** Tasteful entrance reveals, hover states, the mutating logo. Respect `prefers-reduced-motion`. Use **Framer Motion** but keep client JS minimal.

**What to change for Laboratorium:**
- It's a **place and a community**, not a shop-first label — prioritize Spaces, Programs/Events, and Get Involved over commerce (include a simple Market/Makers directory; leave room for a future shop).
- **Bilingual MK/EN** with a language toggle (Cyrillic-first is fine).
- Foreground the **industrial print-house** texture: ledger lines, registration marks, halftone, ink. One restrained accent color on the cream.

**Color direction (adjust to taste):** cream `#F4EFE6` base, ink `#141210` text, one bold accent (risograph red `#E5402A` or electric blue `#1B45D7`), plus a muted secondary. Keep it to ~2–3 colors.

---

## 4. Design principles (self-review checklist before "done")

- [ ] Looks like a crafted editorial object, not a generic CMS template; has clear personality.
- [ ] The mutating wordmark + signature motif are present and feel intentional.
- [ ] Type hierarchy is strong: expressive display headlines, clean readable body, mono metadata.
- [ ] Print-house/industrial DNA visible (texture, grid lines, ink accent) without being heavy.
- [ ] Fully responsive (360px → 1920px); collage grids reflow gracefully.
- [ ] MK/EN toggle works on every page; Cyrillic renders correctly in chosen fonts.
- [ ] Accessible: semantic HTML, AA contrast, keyboard nav, alt text, `prefers-reduced-motion` honored.
- [ ] Fast: optimized images via `next/image` + Payload sizes, lazy loading, good Lighthouse (>90 perf/SEO/a11y).
- [ ] No lorem ipsum — real seed content from §1.

---

## 5. Tech stack & architecture (use current stable versions)

- **Payload CMS 3.x** (Next.js-native, App Router) + **TypeScript** (strict).
- **Scaffold with:** `pnpm create payload-app@latest -t website` — the `website` template already includes a Pages collection, layout blocks, rich text, on-demand revalidation, live preview, and SEO. **Extend it rather than starting blank.**
- **Package manager: pnpm.**
- **Database: PostgreSQL** via `@payloadcms/db-postgres` (Drizzle). Use **migrations** for production (`payload migrate`), not dev push.
- **Rich text: Lexical** (default).
- **Localization: Payload localization enabled from day one** with locales `mk` (default) + `en`. Localize the user-facing text fields in §6. Wire Next.js App Router i18n routing on the frontend so the **MK/EN toggle** switches locale and persists. You may draft EN from the MK source and mark `// TODO: native review`.
- **Media storage: Cloudflare R2** (S3-compatible) via `@payloadcms/storage-s3` with a custom endpoint. Do **not** store uploads on local disk in production — the host's filesystem is ephemeral. **Fall back to local disk only when R2 env vars are absent** (local dev).
- **Email (contact/get-involved notifications): Payload Resend email adapter** (`@payloadcms/email-resend`), or nodemailer SMTP — pick via env.
- **Styling: Tailwind CSS** — clean, responsive, accessible. No heavy UI kit. A small CSS layer for the print textures/registration marks.
- **Motion: Framer Motion** for the restrained animation + the mutating logo.
- **Image optimization:** `next/image` + Payload-generated responsive sizes.
- **Performance:** statically generate public pages with **ISR**; revalidate on publish via Payload `afterChange`/`afterDelete` hooks calling Next.js on-demand revalidation.

---

## 6. Content model — Payload collections & globals

Give every field a clear **label** and **admin description/help text**. Group fields sensibly. Hide technical/internal fields from editors. Add **draft/publish** status (with scheduled publish where noted) to all public content. Localize the user-facing text fields (marked 🌐) into `mk`/`en`.

**Collections**

- **`media`** (upload): images with required `alt` 🌐, auto-generated responsive sizes (thumbnail, card, hero), focal point. Stored on R2. Used everywhere.
- **`events`** (Programs & Events): `title` 🌐, `slug` (auto from title), `type`/`category` (select: workshop, concert, exhibition, screening, seminar), `startDateTime`, `endDateTime` (optional), `space` (relationship → `spaces`), `summary` 🌐 (short, for cards), `body` 🌐 (Lexical), `featuredImage` (media), `partners` (array of text/relationship), `ticketUrl` (optional), `featured` (checkbox), draft/publish with scheduled publish. Add a hook that computes **"upcoming" vs "past"** from the date.
- **`spaces`**: `name` 🌐, `slug`, `sizeSqm` (number), `capacity` (optional), `use` 🌐 (short description), `images` (array → media), `rentable` (checkbox). Seed all spaces from §1.
- **`projects`**: `title` 🌐, `slug`, `summary` 🌐, `body` 🌐 (Lexical), `collaborators` (array), `images` (array → media), `status` (select). Seed from §1.
- **`vendors`** (Lab Design Market makers): `name`, `craft` 🌐, `bio` 🌐, `photo` (media), `socials` (group of URLs), `joinedDate`, draft/publish.
- **`posts`** (News / Journal): `title` 🌐, `slug`, `date`, `excerpt` 🌐, `body` 🌐 (Lexical), `coverImage` (media), `category` (select), draft/publish with live preview.
- **`pages`** (from template): block-based layout builder so editors compose About, Get Involved, and other info pages without code. Keep available blocks simple and well-named: **Hero, Rich Text, Image, Image Gallery / Collage, Call To Action, Contact Info, Pillars, Badges**. Live preview enabled.
- **`contact-submissions`**: `name`, `email`, `subject`/`type` (select: General, Rent a space, Volunteer, Partner, Host an event, Residency, Become a maker, Support), `message`, `createdAt`, `read` (checkbox). Created by the public Contact **and** Get Involved forms (admins read/delete only; not publicly listable). On create, send an email notification to the site contact address.

**Globals**

- **`site-settings`**: site name, logo (media), default SEO/OG image, contact email (notification recipient), phone, address, hours, social links (Instagram, Facebook, Linktree), award/network badges (New European Bauhaus finalist, TEH, ENCC, ECHN), footer text. Single source for footer + contact page + schema.org.
- **`header`** / **`footer`** navigation: editable menus (label 🌐 + link to page/collection item or custom URL).

Seed each collection/global with the real entries from §1–§2 so the site is fully populated on first run.

---

## 7. Public pages (~10) — statically generated with ISR

Global shell on every page: header nav (**Home · About · Spaces · Programs · Market · Projects · Get Involved · News · Contact**), MK/EN toggle, signature-motif favicon, and a rich footer (address, contact, socials, Linktree, newsletter signup, network/award badges, design credit line). Plus a **404** page.

1. **Home `/`** — mutating-logo hero + manifesto tagline; short "what is Laboratorium" intro with the print-house origin; the three pillars; featured/upcoming events strip (from `events`); spaces preview grid; selected projects; Lab Design Market teaser; awards/networks badges; newsletter signup; collage image band.
2. **About `/about`** — rendered from an editable `pages` entry: full story, mission, three pillars expanded, recognition & networks, the team (Kalina Dukovska + roles — placeholders ok), timeline since Dec 2024, partner-organization logos wall.
3. **Spaces `/spaces`** — each space from `spaces` as a section with name, size (m²), use, capacity, photos; a "rent this space / book" CTA → contact form (prefilled `subject = Rent a space`). Facilities/amenities icon list.
4. **Programs & Events `/programs`** (+ **`/programs/[slug]`**) — upcoming + past events; filter by type and by space; each event shows date/time, space, description, partners, image, optional RSVP/ticket link. On the detail page add an **"add to calendar" (.ics)** button, and expose an **iCal feed route** (`/events.ics`) of upcoming events.
5. **Projects `/projects`** (+ **`/projects/[slug]`**) — ongoing initiatives (music ensemble, creative writing, summer multi-events, craft revival, etc.).
6. **Lab Design Market `/market`** — what it is (15+ Macedonian brands, industrial showroom, craft revival); a **maker directory** (`/market/[vendor]` cards with photo, craft, short bio, socials); Lab Re:store section; "apply to sell / join as a maker" CTA. Leave room for a future shop.
7. **Get Involved `/get-involved`** — rendered from a `pages` entry: paths to volunteer, become a partner, host an event, artist residency, join as a maker, donate/support. Each with a short pitch + a form that writes to `contact-submissions` (with the right `subject`).
8. **News / Journal `/news`** (+ **`/news/[slug]`**) — editorial posts/announcements, Luaka-Bop-style article list.
9. **Contact `/contact`** — address, embedded Google Map, phone, email, hours, contact form, socials, language note. The form posts to a server action/route that creates a `contact-submissions` record and triggers the email; show success/error states and basic spam protection (**honeypot + rate limit**). Validate and sanitize server-side.
10. **Optional:** `/gallery` (collage media wall) and/or `/press` (network/award mentions).

---

## 8. Performance & SEO

- Statically generate public pages with **ISR**; revalidate on publish/delete via Payload `afterChange`/`afterDelete` hooks calling Next.js on-demand revalidation. Admin panel stays dynamic.
- Per-page SEO fields (title, description, OG image) via the template's SEO plugin — wire it up for `pages`, `events`, `posts`, and `vendors`/`spaces` too.
- Generate `sitemap.xml` and `robots.txt`. Add Open Graph + Twitter meta and a **branded OG image template**.
- JSON-LD: `LocalBusiness`/`PerformingArtsTheater` from `site-settings`; `Event` on event detail pages.
- Optimize images via `next/image` + Payload sizes; lazy-load; target Lighthouse >90 (perf/SEO/a11y).
- Optional analytics (Plausible/GA) behind an env flag, off by default.

---

## 9. Editor experience (important — non-technical user)

- Logical admin nav grouping: **"Content"** (Events, Spaces, Projects, Makers, News, Pages, Media) and **"Settings"** (site-settings, header, footer).
- Draft → preview → publish with **live preview** enabled for pages, events, and posts.
- Helpful empty states and field descriptions; sensible defaults; required fields only where truly needed.
- A **`pnpm seed`** script that creates: an admin user (from env), `site-settings`, header/footer nav, the About + Get Involved pages, all **spaces** from §1, **3 sample events** (one past, one today, one future), the seed **projects** from §1, a couple of **makers**, one **news** post, and placeholder media — so the structure is visible immediately. Use only the real verified facts; mark placeholder assets clearly.

---

## 10. Deployment (make it work both ways)

Default target: **Railway** (simplest). Also support **Coolify / a Docker VPS** for self-hosting.
- Provide a multi-stage **Dockerfile** (Next.js standalone output) and a **docker-compose.yml** (app + postgres) for the Coolify/VPS path. Run `payload migrate` on container start/deploy.
- Provide **`.env.example`** with: `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL`, R2 vars (`S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `S3_REGION`), email vars (`RESEND_API_KEY` or `SMTP_*`), `CONTACT_EMAIL`, optional analytics flag, and the seed admin creds.
- Document putting **Cloudflare** in front for DNS, TLS, and CDN caching of `laboratorium.mk`.
- A clear **README** covering: local setup, running migrations, seeding, env vars, deploying to Railway, deploying to Coolify/VPS via Docker, swapping email providers, and a short **"How to manage content" section written for the non-technical editor** (how to log in, add an event, upload photos, edit a page, add a maker, publish, and switch language).

---

## 11. Conventions / constraints

- TypeScript strict; generate and **commit `payload-types.ts`**.
- Keep dependencies minimal; **remove unused boilerplate/blocks/demo content** from the template.
- Accessible, mobile-first, fast. No client-side secrets. Validate and sanitize the contact/get-involved forms server-side.
- No invented people, testimonials, or awards beyond §1–§2.
- Commit in logical milestones with clear messages.

---

## 12. Non-functional requirements

- **i18n:** MK (default) + EN via Payload localization; toggle persists; all seed content provided in both (draft EN from MK, mark `// TODO: native review`).
- **SEO:** per-page metadata, branded OG images, sitemap.xml, robots.txt, JSON-LD (`LocalBusiness` + `Event`).
- **Accessibility:** WCAG AA, semantic landmarks, focus styles, reduced-motion.
- **Performance:** Lighthouse >90; responsive images; minimal client JS.
- **Forms:** contact + get-involved → `contact-submissions` + email to `CONTACT_EMAIL`; honeypot + rate limit.

---

## 13. Suggested build order (work through these autonomously)

1. **Scaffold** the `website` template with pnpm + Postgres; get it running locally against a local DB.
2. **Trim & define** collections + globals (§6); enable Payload localization (`mk`/`en`); generate `payload-types.ts`; create the initial migration.
3. **Configure adapters:** R2 storage (with local-disk dev fallback) + email (Resend or SMTP via env).
4. **Design system first:** Tailwind tokens (cream/ink/accent), type scale, print-texture utilities, the signature motif, and the **mutating wordmark** component. Build a `/styleguide` route to verify. Replace the template's default styling.
5. **Shared layout:** header (nav + MK/EN toggle), footer from globals, page shell, Framer Motion primitives.
6. Build pages in order: **Home → Spaces → Programs/Events (+ `[slug]` + `/events.ics`) → About → Market (+ makers) → Projects → Get Involved → News → Contact.**
7. **Wire** the contact/get-involved forms + email, map embed, structured data, sitemap, robots, OG images.
8. **ISR + revalidation hooks**, SEO plugin wiring for all collections.
9. **Seed script** + sample content (§1–§2, §9).
10. **Dockerfile + docker-compose + README + deployment docs.** Run build & lint; fix issues.
11. Run the dev server; screenshot key pages at mobile + desktop; **self-review against §4**; iterate at least once on visual polish.

**Assets:** the team will supply real photography and the official logo later. For now, generate tasteful placeholders (SVG patterns, halftone blocks, registration marks) and clearly mark where real assets go.

---

## 14. Definition of done

A running site (`pnpm dev`) backed by Payload, with all §7 pages, real §1–§2 seed content, a working MK/EN toggle, the editorial Luaka-Bop-inspired design with the mutating wordmark and print-house texture, responsive + accessible + fast, content fully editable by a non-technical user in the Payload admin, plus a Dockerfile/compose, README + content guide, and a list of remaining TODOs (real photos, native EN review, exact hours, ticketing/shop).

**Before finishing, confirm the stack + collection/page list back to me in one short paragraph, then show screenshots of the Home, Spaces, Programs, and Market pages.**
