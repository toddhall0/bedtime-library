@AGENTS.md

# Bedtime Library — Claude Code Project Notes

## What this project is

Bedtime Library is a cross-generational bedtime storytelling web app. Parents subscribe; the app generates personalized AI bedtime stories starring the family's kid by name, with their friends and pets, in worlds they love. Grandparents and other family members can be invited as narrators — they record audio narrations asynchronously, or join live video calls to read stories aloud. Stories build into a personalized family library. Parents can optionally order printed hardcover books of favorites (à la carte, $24 each).

Two story modes per kid:

- **Little Listeners (3–6):** Standalone stories
- **Chapter Club (7+):** Serialized 5-chapter weekly arcs

Three pacing options: 1, 3, or 5 stories per week.

Pricing: Free / Family $7.99/mo / Family Plus $14.99/mo, 14-day trial on paid tiers.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 + shadcn/ui (new-york style, neutral base, brand-overridden tokens)
- Supabase (Postgres + Auth + Storage)
- Prisma 6
- Stripe (test mode in dev, live for launch)
- Resend (transactional email)
- Anthropic Claude API (story generation)
- fal.ai (illustration generation)
- ElevenLabs (text-to-speech narration)
- Daily.co (video calls, later phases)
- Inngest (background jobs, later phases)
- Vercel (hosting)
- Sentry + PostHog (monitoring)

Note: the original brief targeted Next.js 15 + Tailwind 3 + Prisma 7. We landed on Next 16 + Tailwind 4 (the create-next-app defaults — kept since they're forward-compatible) and Prisma 6 (downgraded — Prisma 7 moved URLs out of schema.prisma and breaks the standard singleton pattern).

## Project conventions

### Code organization

- `src/app/` — Next.js App Router pages and route handlers
- `src/app/(marketing)/` — Public marketing pages (route group)
- `src/app/(app)/` — Authenticated parent app (route group, prefix `/app/*`)
- `src/app/(narrator)/` — Narrator app (route group, prefix `/narrator/*`)
- `src/app/(admin)/` — Admin pages (route group, prefix `/admin/*`)
- `src/app/api/` — API route handlers
- `src/components/` — Shared React components
- `src/components/ui/` — shadcn/ui components (don't edit manually; re-add via `npx shadcn add`)
- `src/components/brand/` — Brand-specific components (Logo, etc.)
- `src/lib/` — Service wrappers, utilities, shared logic
  - `src/lib/db.ts` — Prisma client singleton
  - `src/lib/supabase/{server,browser}.ts` — Supabase clients
  - `src/lib/email.ts` — Resend wrapper
  - `src/lib/stripe.ts` — Stripe wrapper (added in Phase 4)
- Server actions colocated with pages as `actions.ts`

### Patterns

- All env vars accessed via `process.env.*` only in server code; never expose secrets to client
- Use Zod for all input validation (server actions, API routes, form schemas via `@hookform/resolvers`)
- All forms use `react-hook-form` + shadcn `Form` components
- Use shadcn/ui components by default; don't reach for other component libraries
- Use `sonner` for toast notifications (shadcn deprecated the standalone `toast` component)
- Mobile-first responsive design — bedtime use is primarily on phones
- Server Components by default; reach for Client Components only when needed (interactivity, hooks, browser APIs)

### Database

- Schema in `prisma/schema.prisma`, migrations via `npx prisma migrate dev --name <description>`
- All entity table names: snake_case via `@@map`
- ID fields: `cuid()` for most entities, `uuid()` for `User` (matches Supabase auth.users.id)
- Use Prisma's `Json` type for flexible nested data (friends, pets, shipping addresses)
- Pooled connection at runtime (`DATABASE_URL`, port 6543, pgbouncer), direct for migrations (`DIRECT_URL`, port 5432)

### Auth

- Supabase Auth is the source of truth for sessions
- The `User` table mirrors `auth.users` via shared UUID
- `src/proxy.ts` refreshes the Supabase session on every request (Next.js 16 renamed the `middleware` convention to `proxy`)
- Server: `createClient()` from `src/lib/supabase/server.ts`
- Client: `createClient()` from `src/lib/supabase/browser.ts`

## Brand

### Visual style

- Warm, cozy, storybook-inspired — modern, not childish-cluttered
- "Premium children's bookshop meets calm wellness app"
- Mobile-first, generous whitespace, calm and quiet
- Smooth transitions, no harsh corners

### Colors (CSS variables — defined in `src/app/globals.css`)

- Midnight Navy `#1a1b3a` (`--brand-midnight`) — primary background
- Warm Cream `#faf6ed` (`--brand-cream`) — text on dark
- Amber Gold `#d4a574` (`--brand-amber`) — accent, CTAs
- Dusty Rose `#c8a4a4` (`--brand-rose`) — secondary accent
- Soft Navy `#252749` (`--brand-soft-navy`) — elevated surfaces
- Muted Cream `#d8d3c4` (`--brand-muted-cream`) — secondary text

These are exposed as Tailwind utilities: `bg-brand-midnight`, `text-brand-cream`, `fill-brand-amber`, etc. The shadcn semantic tokens (`bg-background`, `text-foreground`, `bg-primary`) are wired through to the brand palette.

### Typography

- Headings: Fraunces (serif, `--font-serif`, weights 400/500/600/700)
- UI / body: Inter (sans, `--font-sans`, weights 400/500/600)
- Loaded via `next/font/google` in `src/app/layout.tsx`

### Tone

- Warm, calm, personal — like a friend, not a corporation
- The founder's voice is "Tom from Bedtime Library" — first-person, lowercase comfort

### Avoid

- Bright cartoonish primary colors
- Busy backgrounds or cluttered layouts
- Streaks, badges, XP, gamification
- Anything that feels like a kids' game vs. a family ritual

## Development workflow

- Commit early and often, with conventional commit messages (`feat:`, `fix:`, `chore:`, `refactor:`, `docs:`)
- Run `npm run lint` and `npm run typecheck` (`tsc --noEmit`) before committing
- Test on a real phone for every UI change

## Current phase

**Phase 0 — Foundation** (in progress)

Update this section at the start of each phase. Phases: 0 Foundation / 1 Marketing + Waitlist / 2 Auth + Onboarding / 3 Story Generation / 4 Stripe + Subscriptions / 5 Narrators + Recording / 6 Video Calls / 7 Feedback Loop / 8 Print Store / 9 Launch Prep

## Things future Claude should ask me about

- Before installing new top-level dependencies
- Before changing the tech stack
- Before introducing a new architectural pattern (state management library, new ORM, etc.)
- Before exposing any new public route
- Before modifying the brand colors or fonts

## What's NOT in MVP (do not build these unless I ask)

- Voice cloning of narrators (Phase 9 marks it "Coming soon" only)
- Print-on-demand API integration (manual fulfillment via admin email for MVP)
- Native mobile apps (web only, but mobile-perfect)
- Multi-language support (English only)
- Public sharing or social features
- Alternate AI narration voices
