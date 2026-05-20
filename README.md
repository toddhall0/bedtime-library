# Bedtime Library

A cross-generational bedtime storytelling web app. Parents subscribe; the app generates personalized AI bedtime stories starring the family's kid by name, with their friends and pets, in worlds they love. Grandparents and other family members are invited as narrators — they record audio narrations asynchronously, or join live video calls to read stories aloud. Stories build into a personalized family library that parents can optionally print as hardcover books.

**Status:** Phase 0 — Foundation complete. No product features yet; this is just the scaffold (Next.js + Tailwind + shadcn/ui + Supabase + Prisma + brand design system + holding page).

## Tech stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui (new-york style)
- **Database:** Supabase Postgres via Prisma 6
- **Auth & Storage:** Supabase Auth + Supabase Storage
- **Email:** Resend
- **AI:** Anthropic Claude (stories), fal.ai (illustrations), ElevenLabs (TTS)
- **Hosting:** Vercel
- **Monitoring:** Sentry + PostHog (wired up in Phase 9)

## Local development

### Prerequisites

- Node.js 20+
- A Supabase project (for Postgres, Auth, Storage)
- A Resend account (for email — keys can be left blank until you need to send mail)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env
# Then open .env and fill in real values. The minimum to get
# `npm run dev` working is:
#   DATABASE_URL, DIRECT_URL,
#   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#   SUPABASE_SERVICE_ROLE_KEY
#
# Note: use `.env` (not `.env.local`) — the Prisma CLI only auto-loads
# `.env`, while Next.js reads both. A single `.env` keeps Prisma and
# Next.js in sync. `.env` is gitignored.

# 3. Apply database migrations against your Supabase project
npx prisma migrate deploy
npx prisma generate

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the holding page.

### Useful scripts

| Script              | What it does                                    |
| ------------------- | ----------------------------------------------- |
| `npm run dev`       | Start the Next.js dev server                    |
| `npm run build`     | Production build                                |
| `npm run start`     | Serve the production build                     |
| `npm run lint`      | ESLint                                          |
| `npm run typecheck` | `tsc --noEmit`                                  |

### Database changes

```bash
# After editing prisma/schema.prisma:
npx prisma migrate dev --name <short_description>
```

This creates a new migration file under `prisma/migrations/` and applies it to your local/dev database.

## Project structure

See [`CLAUDE.md`](./CLAUDE.md) for the full convention guide. Quick map:

```
src/
  app/                  Next.js App Router pages and route handlers
  components/
    brand/              Brand-specific components (Logo, etc.)
    ui/                 shadcn/ui components
  lib/
    db.ts               Prisma client singleton
    email.ts            Resend wrapper
    supabase/           Supabase server + browser clients
    utils.ts            cn() and other helpers
  middleware.ts         Refreshes the Supabase session on every request
prisma/
  schema.prisma         Database schema
  migrations/           Generated migration SQL
  seed.ts               Seed script (empty in Phase 0)
```

## Deployment

This project deploys to Vercel. Push to `main` triggers a production deploy; PRs get preview deploys. Set all environment variables from `.env.example` in the Vercel project settings before the first deploy.

## Brand & conventions

For colors, typography, code conventions, and the things future contributors (human or AI) should know about, read [`CLAUDE.md`](./CLAUDE.md).
