# Technical Product Requirements Document — AI Journey Platform

**Version:** 1.0  
**Date:** 2026-04-22  
**Author:** CTO (Paperclip agent — MAT-3)  
**Status:** Draft

---

## 1. Overview

### 1.1 Problem Statement
Most people know AI is important but don't know where to start or how to progress. They either dive into hype content with no structure, or get overwhelmed by technical depth. There's no guided, personalized path to build real AI literacy and capability.

### 1.2 Product Vision
A platform that meets each user exactly where they are in their AI journey — whether they're a curious non-technical person, a developer upskilling, or a professional applying AI to their domain — and gives them a clear, actionable, personalized roadmap.

### 1.3 Success Metrics (MVP)
| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Signups | 500 |
| Onboarding completion rate | ≥ 70% |
| Week-2 retention | ≥ 30% |
| Resources marked complete | Avg ≥ 3 per active user |
| NPS | ≥ 40 |

---

## 2. Users & Use Cases

### 2.1 Target Users

**Persona A — The Curious Newcomer**
- Non-technical professional (marketer, manager, teacher)
- Wants to understand AI basics and stay relevant
- Overwhelmed by technical content; needs approachable starting points

**Persona B — The Upskilling Developer**
- Software engineer or data professional
- Comfortable with code; wants to integrate AI into their work
- Needs curated resources at the right depth, not generic tutorials

**Persona C — The Domain Practitioner**
- Domain expert (lawyer, doctor, designer) exploring AI in their field
- Wants applied knowledge, not theory
- Needs use-case-specific guidance

### 2.2 Key Use Cases

| ID | Use Case | Persona |
|----|----------|---------|
| UC-1 | Complete onboarding and receive personalized AI stage + path | All |
| UC-2 | Browse dashboard with curated resources for my stage | All |
| UC-3 | Mark resources as done and track progress | All |
| UC-4 | Update goals/context and regenerate path | All |
| UC-5 | Share progress or path with others | All |

---

## 3. Feature Requirements

### 3.1 Authentication (P0)

**FR-AUTH-1:** Email magic link sign-in  
**FR-AUTH-2:** Google OAuth sign-in  
**FR-AUTH-3:** Session persistence across devices  
**FR-AUTH-4:** User can delete their account and all data  

### 3.2 Onboarding Intake (P0)

**FR-ONBOARD-1:** 5–7 question intake form covering:
- Current AI experience level (none / basic awareness / hands-on / building)
- Primary goal (stay informed / apply to work / build products / research)
- Domain / industry context
- Available time per week (< 1h / 1–3h / 3–5h / 5h+)
- Preferred learning style (reading / video / hands-on / mixed)

**FR-ONBOARD-2:** Responses stored server-side, not just browser state  
**FR-ONBOARD-3:** Form must be completable in under 3 minutes  
**FR-ONBOARD-4:** Progress saved so users can resume if they close mid-flow  

### 3.3 AI-Powered Path Generation (P0)

**FR-AI-1:** On onboarding completion, call Claude API to:
- Classify user into one of 4 journey stages (Aware / Exploring / Applying / Building)
- Generate a personalized learning path (ordered list of 8–12 resources)
- Write a 2–3 sentence "where you are" summary for the user

**FR-AI-2:** Path generation must complete within 10 seconds (use streaming for perceived speed)  
**FR-AI-3:** Generated path persisted to DB and associated with user  
**FR-AI-4:** System prompt must be deterministic enough for consistent stage classification (evaluated against test cases)  

**Journey Stages:**
| Stage | Description |
|-------|-------------|
| Aware | Knows AI is important; no hands-on experience |
| Exploring | Has tried tools (ChatGPT, etc.); building mental models |
| Applying | Uses AI regularly in their work; wants to go deeper |
| Building | Technical; integrating or building AI-powered products |

### 3.4 Dashboard (P0)

**FR-DASH-1:** Show user's current stage and personalized summary  
**FR-DASH-2:** Display learning path as an ordered, interactive list  
**FR-DASH-3:** Each resource card shows: title, type (article/video/tool/course), estimated time, stage tag  
**FR-DASH-4:** User can mark resource as "done" / "skipped" / "bookmarked"  
**FR-DASH-5:** Visual progress indicator (e.g., 3 of 10 resources completed)  
**FR-DASH-6:** Resources link out to external URLs (open in new tab)  

### 3.5 Resource Library (P1)

**FR-RES-1:** Curated resource database seeded with ≥ 50 quality resources at launch  
**FR-RES-2:** Resources tagged by: stage, type, domain, estimated duration  
**FR-RES-3:** Admin interface (internal) to add/edit/tag resources  
**FR-RES-4:** Resource quality rated by engagement (clicks, completions) over time  

### 3.6 Path Refresh (P1)

**FR-REFRESH-1:** User can re-run onboarding with updated answers  
**FR-REFRESH-2:** Previous path history preserved (can view old paths)  
**FR-REFRESH-3:** Path refresh triggers new Claude API call with updated context  

---

## 4. Non-Functional Requirements

### 4.1 Performance
- Page load (LCP): < 2.5s on 4G connection
- AI path generation: streaming begins within 2s, completes within 10s
- API route p95 latency: < 500ms (excluding AI calls)

### 4.2 Reliability
- Target uptime: 99.5% (Vercel SLA)
- DB connection pooling to handle spikes (Neon + Prisma Accelerate)

### 4.3 Security
- All secrets via environment variables, never in source
- Auth tokens HttpOnly, Secure, SameSite=Strict
- SQL injection prevented by Prisma parameterized queries
- Rate limiting on AI endpoints: 10 requests/user/hour
- GDPR-compliant: users can export and delete all their data

### 4.4 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigable throughout
- Screen reader tested for onboarding form and dashboard

### 4.5 Privacy
- No PII sold or shared with third parties
- Onboarding answers used only for path generation
- Analytics: anonymous/aggregated only at MVP stage

---

## 5. Data Model

```prisma
model User {
  id                String               @id @default(cuid())
  email             String               @unique
  name              String?
  createdAt         DateTime             @default(now())
  onboardingResponses OnboardingResponse[]
  learningPaths     LearningPath[]
  progress          UserProgress[]
}

model OnboardingResponse {
  id          String   @id @default(cuid())
  userId      String
  answers     Json
  stage       String   // Aware | Exploring | Applying | Building
  summary     String
  createdAt   DateTime @default(now())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  learningPath LearningPath?
}

model LearningPath {
  id                   String              @id @default(cuid())
  userId               String
  onboardingResponseId String              @unique
  items                LearningPathItem[]
  generatedAt          DateTime            @default(now())
  user                 User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  onboardingResponse   OnboardingResponse  @relation(fields: [onboardingResponseId], references: [id])
}

model LearningPathItem {
  id             String       @id @default(cuid())
  learningPathId String
  resourceId     String
  order          Int
  learningPath   LearningPath @relation(fields: [learningPathId], references: [id], onDelete: Cascade)
  resource       Resource     @relation(fields: [resourceId], references: [id])
}

model Resource {
  id               String             @id @default(cuid())
  title            String
  url              String
  type             String             // article | video | tool | course
  stages           String[]
  domain           String?
  estimatedMinutes Int?
  tags             String[]
  learningPathItems LearningPathItem[]
  userProgress     UserProgress[]
}

model UserProgress {
  id          String    @id @default(cuid())
  userId      String
  resourceId  String
  status      String    // done | skipped | bookmarked
  updatedAt   DateTime  @updatedAt
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  resource    Resource  @relation(fields: [resourceId], references: [id])

  @@unique([userId, resourceId])
}
```

---

## 6. API Design

### 6.1 Route Handlers (Next.js App Router)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/onboarding` | Submit onboarding answers, trigger AI path generation |
| GET | `/api/learning-path` | Get current user's active learning path |
| GET | `/api/learning-path/history` | Get all past paths |
| PATCH | `/api/progress/:resourceId` | Update progress status for a resource |
| GET | `/api/resources` | List resources (filterable by stage, type) |
| DELETE | `/api/user` | Delete account + all data |

### 6.2 AI Integration (Claude)

**Endpoint:** `/api/onboarding` (server-side only, never exposed to client)

**Prompt Design:**
- System prompt: static, describes stage taxonomy and scoring rubric
- User message: structured JSON of onboarding answers
- Expected response: JSON with `stage`, `summary`, `resourceIds[]` (ranked)
- Tool use: optional — could use `get_resources` tool for Claude to select from DB

**Streaming:** `streamObject` from Vercel AI SDK for progressive dashboard hydration

---

## 7. Milestones & Scope

### MVP (Target: 4–6 weeks from project start)
- [ ] Auth (magic link + Google)
- [ ] Onboarding form (5 questions)
- [ ] AI path generation (Claude integration)
- [ ] Dashboard (path display + progress tracking)
- [ ] Resource library (50+ seeded resources)
- [ ] Deploy to Vercel + Neon

### Post-MVP (V1.1)
- [ ] Path refresh / re-onboarding
- [ ] Resource discovery / search
- [ ] Weekly email digest (your progress this week)
- [ ] Social sharing (share your AI stage)

### V2 (Future)
- [ ] Community features (discuss resources)
- [ ] Domain-specific tracks (AI for lawyers, AI for designers, etc.)
- [ ] Cohort learning / accountability partners
- [ ] Creator tools (organizations can submit resources)

---

## 8. Open Questions — RESOLVED (2026-04-22, CEO)

| # | Question | Decision |
|---|----------|----------|
| OQ-1 | What are the 50+ seed resources for launch? Who curates them? | **CEO owns curation.** CTO provides schema + admin UI; CEO sources content. |
| OQ-2 | Claude tool use vs. generate-then-map for resource selection? | **Claude selects from DB via tool use** — better quality control. |
| OQ-3 | Waitlist / invite flow before public launch? | **No waitlist.** Open access from day one — need real signups to validate. |
| OQ-4 | Privacy policy / ToS — who drafts? | **CEO drafts.** CTO to tag CEO when deploy is close. |
| OQ-5 | Analytics tool? | **PostHog** — open source, GDPR-friendly, generous free tier. |

---

## 9. Dependencies

| Dependency | Type | Risk |
|-----------|------|------|
| Anthropic Claude API availability | External | Low (99.9% uptime) |
| Neon Postgres provisioning | External | Low |
| Vercel project setup + env vars | External | Low |
| Resource curation (50 items) | Internal | Medium — blocks seed data |
| Auth.js v5 stability | Library | Medium — v5 still RC |

---

*This PRD is a living document. Update as requirements clarify or change.*
