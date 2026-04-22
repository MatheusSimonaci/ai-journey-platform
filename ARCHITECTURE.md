# Architecture Decision Record — AI Journey Platform

**Date:** 2026-04-22  
**Author:** CTO (Matheus / Paperclip agent)  
**Goal:** Help people navigate their personal AI journey (trilhar a jornada da IA)

---

## Stack Decisions

### Frontend
- **Next.js 14 (App Router)** — React-based, SSR/SSG support, great DX, strong ecosystem
- **TypeScript** — type safety across the stack
- **Tailwind CSS** — utility-first, fast iteration
- **shadcn/ui** — accessible component primitives built on Radix UI

### Backend
- **Next.js API Routes / Route Handlers** — start co-located with frontend (monolith first), easy to extract later
- **PostgreSQL** — relational, battle-tested, good for structured user data & learning paths
- **Prisma ORM** — type-safe DB access, schema-as-code, migrations built-in
- **NextAuth.js (Auth.js v5)** — authentication with Google/email magic link

### AI / LLM Layer
- **Anthropic Claude API (claude-sonnet-4-6)** — personalized path recommendations, onboarding analysis
- **Vercel AI SDK** — streaming, tool-use, type-safe AI integration

### Infrastructure & CI/CD
- **Vercel** — deploy target for Next.js (zero-config, preview deployments, edge functions)
- **GitHub Actions** — CI pipeline (lint, type-check, test, build on every PR)
- **Neon** (or Supabase) — serverless Postgres, branching per PR environment

### Testing
- **Vitest** — unit + integration tests
- **Playwright** — E2E tests for critical user flows

---

## Architecture Overview

```
User Browser
    │
    ▼
Next.js (Vercel Edge / Node)
  ├── /app (pages, layouts)
  ├── /app/api (route handlers — REST-like)
  ├── /lib (business logic, AI calls)
  └── /prisma (schema, migrations)
    │
    ├── PostgreSQL (Neon)
    └── Claude API (Anthropic)
```

### Core User Flow (MVP)
1. User lands → marketing page
2. Signs up / logs in (email magic link or Google)
3. **Onboarding intake form** — 5-7 questions about AI experience, goals, learning style
4. Claude analyzes answers → generates personalized AI journey stage + learning path
5. Dashboard: curated resources (articles, tools, courses) mapped to their path
6. User can mark items done, update goals, see progress

### Data Model (simplified)
- `User` — id, email, name, createdAt
- `OnboardingResponse` — userId, answers (JSON), stage, createdAt
- `LearningPath` — userId, items[], generatedAt
- `Resource` — id, title, url, type, stage[], tags[]
- `UserProgress` — userId, resourceId, status, completedAt

---

## Dev Environment Setup

### Requirements
- Node.js 20+
- pnpm 9+
- PostgreSQL (local via Docker or Neon free tier)

### Quick Start
```bash
git clone <repo>
cd ai-journey-platform
pnpm install
cp .env.example .env.local
# Fill in: DATABASE_URL, ANTHROPIC_API_KEY, AUTH_SECRET, AUTH_GOOGLE_*
pnpm db:push      # apply schema
pnpm dev          # http://localhost:3000
```

### Environment Variables
```
DATABASE_URL=postgresql://...
ANTHROPIC_API_KEY=sk-ant-...
AUTH_SECRET=...
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## CI/CD Pipeline (GitHub Actions)

On every PR:
1. **lint** — ESLint + Prettier check
2. **typecheck** — `tsc --noEmit`
3. **test** — Vitest unit tests
4. **build** — `next build` (catches runtime errors)
5. **preview** — Vercel preview deployment (auto via Vercel GitHub integration)

On merge to `main`:
- Auto-deploy to production via Vercel

---

## ADR Log

| # | Decision | Rationale |
|---|----------|-----------|
| 1 | Next.js over separate frontend+backend | Faster iteration at MVP stage; monolith can split later |
| 2 | Claude for personalization | Native capability, already in stack, streaming support |
| 3 | Prisma over raw SQL | Type safety + migrations critical as schema evolves quickly |
| 4 | Vercel for hosting | Zero-config Next.js deployment, preview environments free |
| 5 | Neon for Postgres | Serverless, branch-per-environment, generous free tier |
