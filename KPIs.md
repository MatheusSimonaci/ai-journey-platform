# Launch KPI Framework & PostHog Instrumentation Plan

**Document:** AI Journey Platform Launch Success Metrics  
**Version:** 1.0 (Final)  
**Date:** 2026-04-24  
**Owner:** CTO (PostHog instrumentation) + CEO (strategic approval)  
**Goal:** Measure whether users are succeeding on their AI learning journeys

---

## 1. Activation Event Definition

### Primary Definition: First Resource Completion
**Activation Event:** User completes (marks as done) their first resource within their personalized learning path.

**Event Name:** `resource_completed`  
**Required Properties:**
- `distinct_id` (set to `user_id`)
- `resource_id` (string)
- `is_first_resource` (boolean) — true if this is the user's first completion ever
- `resource_type` (article/course/tool)
- `resource_stage` (beginner/intermediate/advanced)

**Why this definition:**
- **Signals actual value extraction:** Completing a resource means the user consumed content and felt it was worth marking done.
- **Achievable in Week 1:** Realistic for high-intent users.
- **Measurable & automatable:** Product behavior drives the metric.

---

## 2. Success Targets

### Week 1 (Launch Momentum)
| Metric | Target | Rationale |
|--------|--------|-----------|
| **Signups** | 500+ | Initial buzz from launch channels |
| **Onboarding Completion** | ≥ 75% | High intent expected from early adopters |
| **Activation Rate** | 25–35% | % of signups who complete ≥1 resource |
| **Day-1 Retention** | ≥ 40% | Users returning the next day to continue |

### Month 1 (Habit Formation)
| Metric | Target | Rationale |
|--------|--------|-----------|
| **MAU** | 2000+ | Organic growth + referrals |
| **Week-2 Retention** | ≥ 30% | Measure of sustainable value |
| **Resources Completed** | Avg ≥ 3 / user | Depth of engagement |
| **NPS** | ≥ 40 | Quality of the personalized paths |

---

## 3. PostHog Event Instrumentation Spec

### Core Events (Implemented)

#### Server-Side (via `src/lib/server-events.ts`)
1. **`user_signup`**
   - Trigger: NextAuth `createUser` event
   - Properties: `email_domain`, `method` (email/oauth)
   
2. **`onboarding_completed`**
   - Trigger: `/api/onboarding` success
   - Properties: `ai_experience_level`, `primary_goal`, `path_stage`, `resource_count`
   
3. **`resource_assigned`**
   - Trigger: Learning path generation (one per resource)
   - Properties: `resource_id`, `resource_count`, `path_stage`
   
4. **`resource_completed`** ⭐ PRIMARY
   - Trigger: `/api/progress/:id` PATCH (status: completed)
   - Properties: `resource_id`, `resource_type`, `is_first_resource`, `resource_stage`

#### Client-Side (via `src/lib/events.ts` & Hooks)
5. **`session_start`**
   - Trigger: `useEventTracking` hook on Dashboard mount
   - Properties: `session_id`, `device_type`
   
6. **`$pageview`**
   - Trigger: Global provider route change listener
   
7. **`resource_viewed`**
   - Trigger: User opens a resource link

### User Identification
- **Identification:** `src/components/PostHogIdentifier.tsx` calls `posthog.identify()` on every authenticated session.
- **Distinct ID:** All server-side events use `userId` as the `distinct_id` to ensure event correlation across client/server.

---

## 4. Validation Plan

### Pre-Launch Checklist
- [x] PostHog project created and `NEXT_PUBLIC_POSTHOG_KEY` configured.
- [x] Verify `user_signup` fires exactly once per user in PostHog.
- [x] Verify `resource_completed` correctly calculates `is_first_resource` by checking DB state.
- [x] Confirm `distinct_id` is consistent between client-side `$pageview` and server-side `resource_completed`.

### How to Verify
1. **Signup Test:** Create a new account. Check PostHog for `user_signup` and `onboarding_completed`.
2. **Activation Test:** Mark a resource as done. Verify `resource_completed` appears with `is_first_resource: true`.
3. **Repeat Completion Test:** Mark a second resource as done. Verify `resource_completed` appears with `is_first_resource: false`.
4. **Session Test:** Refresh the page. Verify `session_start` fires.

---

## 5. Revision History
- **2026-04-23:** Initial draft (CTO)
- **2026-04-24:** Finalized (v1.0), updated implementation details and added validation plan.
