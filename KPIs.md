# Launch KPI Framework & PostHog Instrumentation Plan

**Document:** AI Journey Platform Launch Success Metrics  
**Date:** 2026-04-23  
**Owner:** CTO (PostHog instrumentation) + CEO (strategic approval)  
**Goal:** Measure whether users are succeeding on their AI learning journeys

---

## 1. Activation Event Definition

### Primary Definition: First Resource Completion
**Activation Event:** User completes (marks as done) their first resource within their personalized learning path.

**Event Name:** `resource_completed`  
**Required Properties:**
- `user_id` (string)
- `resource_id` (string)
- `is_first_resource` (boolean) — true if this is the user's first completion
- `time_to_activation_hours` (number) — hours between signup and first completion

**Why this definition:**
- **Signals actual value extraction:** Completing a resource means the user consumed content and felt it was worth marking done. Onboarding alone doesn't guarantee engagement.
- **Achievable in Week 1:** Ambitious but realistic for a high-intent user base (educators, AI-curious professionals).
- **Measurable & automatable:** No manual intervention; product behavior drives the metric.
- **Defensible business signal:** Activation → return → lifetime value pipeline.

### Rejected Alternatives (with tradeoffs):

#### Alt A: Onboarding Completion
- **Event:** User finishes intake form and receives first learning path
- **Tradeoff:** Too early. 40-50% of users typically complete onboarding but abandon before first engagement. High false-positive activation rate.

#### Alt B: 7-Day Return
- **Event:** User logs in again within 7 days of signup
- **Tradeoff:** Measures retention, not activation. Too late to correlate with launch day momentum. Better as a secondary metric (Week 1 return rate).

---

## 2. Week 1 Targets (Post-Launch)

| Metric | Definition | Target | Rationale |
|--------|-----------|--------|-----------|
| **MAU (Launch Week)** | Unique users who signed up during launch week | 500–1000 | Depends on launch reach. Conservative target for initial buzz. |
| **Activation Rate** | % of launch week signups who complete ≥1 resource by day 7 | 25–35% | Industry benchmark for educational products: 20–30%. 25% is defensible, 35% is strong. |
| **Return-Within-7-Days** | % of activated users who log in again after their first completion | 60–70% | Early retention signal; expect drop-off. 60% is acceptable, 70% is excellent. |

### Formulas:
```
Activation Rate = (Users with ≥1 resource_completed by Day 7) / (Launch Week Signups) × 100%
Return-Within-7-Days = (Activated users with login after first completion) / (Activated Users) × 100%
```

### PostHog Events for Week 1:
- `user_signup` — capture at signup completion
- `resource_completed` — capture when user marks resource done
- `session_start` — capture on every login to measure return visits

---

## 3. Month 1 Targets (End of First Month)

| Metric | Definition | Target | Rationale |
|--------|-----------|--------|-----------|
| **MAU (Month 1)** | Unique monthly active users (cumulative + returning) | 2000–3000 | Organic growth + word-of-mouth post-launch. |
| **Activation Rate (Month 1)** | % of all signups (launch week + month 1) who activated | 20–25% | Lower than Week 1 as user quality may dilute. Conservative vs. early adopters. |
| **Return Rate (Month 1)** | % of activated users who logged in at least 2x in the month | 50–60% | Measure of habit formation; returning only once is weak retention. |
| **Content Completion Rate** | % of assigned resources (in user's path) that are marked done | 15–25% | Users typically complete 1–2 resources in first month. Paths vary in length. |

### Formulas:
```
Month 1 Activation Rate = (Users with ≥1 resource_completed in Month 1) / (All Month 1 Signups) × 100%
Return Rate = (Users with ≥2 logins in Month 1) / (Activated Users in Month 1) × 100%
Content Completion Rate = (Total resources marked done) / (Total resources assigned across all paths) × 100%
```

### PostHog Events for Month 1:
- All Week 1 events, plus:
- `learning_path_generated` — capture when Claude generates personalized path
- `resource_assigned` — track when a resource is added to a user's path (allows completion rate denominator)

---

## 4. Event-to-KPI Mapping

| KPI | Required Events | Properties | PostHog Insight Type |
|-----|-----------------|-----------|----------------------|
| Activation Rate | `user_signup`, `resource_completed` | user_id, is_first_resource, timestamp | Funnels: Signup → First Completion |
| Return-Within-7-Days | `resource_completed`, `session_start` | user_id, timestamp, resource_id | Retention (7-day window after first completion) |
| Content Completion Rate | `resource_assigned`, `resource_completed` | user_id, resource_id, count | Formula (Custom): Completed / Assigned |
| MAU | `session_start` | user_id, timestamp | Trends (unique user count by day) |

---

## 5. PostHog Event Instrumentation Spec

### Events to Instrument in Codebase

#### Core Events
1. **`user_signup`**
   - When: NewAuth completes (NextAuth callback or /api/onboarding POST)
   - Properties: `email_domain` (company/personal), `signup_source` (landing page / referral)
   
2. **`onboarding_completed`**
   - When: User submits intake form, Claude path is generated
   - Properties: `ai_experience_level` (json: expert/intermediate/beginner), `primary_goal` (string), `path_stage` (string)
   
3. **`resource_completed`** ⭐ PRIMARY
   - When: User clicks "Mark as Done" on a resource
   - Properties: `resource_id`, `resource_type` (article/course/tool), `is_first_resource` (boolean), `time_to_completion_hours`, `resource_stage` (beginner/intermediate/advanced)
   
4. **`resource_assigned`**
   - When: Learning path is generated and resources are assigned to user
   - Properties: `resource_id`, `resource_count` (total in path), `path_stage`
   
5. **`session_start`**
   - When: User logs in / page loads with authenticated session
   - Properties: `session_id`, `device_type` (web/mobile)
   
6. **`resource_viewed`** (optional, for engagement funnel)
   - When: User opens a resource detail page
   - Properties: `resource_id`, `resource_type`

### Implementation Location
- `src/lib/events.ts` — centralized event tracking utility
- Add PostHog client initialization to `src/app/providers.tsx`
- Call `trackEvent()` in:
  - Auth callback (NextAuth) → `user_signup`
  - `/api/onboarding` handler → `onboarding_completed`, `resource_assigned`
  - Resource completion endpoint → `resource_completed`
  - Dashboard/page load → `session_start`

### PostHog Configuration
- **Project:** AI Journey Platform (create in PostHog)
- **API Key:** Store in `NEXT_PUBLIC_POSTHOG_KEY` (public; safe for frontend)
- **Events Retention:** 90 days (enough for Month 1 retrospective)
- **Dashboards to Create:**
  - "Activation Funnel" (Signup → Onboarding → First Completion)
  - "Retention" (7-day return rate from first completion)
  - "MAU Trend" (daily unique users)
  - "Content Completion Rate" (completed / assigned)

---

## 6. Assumptions & Constraints

### Assumptions
1. **User intent is high:** Launch is to educators and AI-curious professionals, not random traffic. Activation rate targets reflect this.
2. **Paths are curated:** Resources are high-quality and personalized, so completion rate ~15–25% is realistic (not 50%+).
3. **Week 1 is isolated:** Marketing push is concentrated in Week 1; Month 1 includes organic + paid traffic.
4. **No technical barriers:** PostHog integration completes before launch; tracking is reliable.

### Constraints
- **Timing:** KPI instrumentation must ship 1–2 weeks before launch to validate events in staging.
- **Data privacy:** Email/PII is NOT logged; only user_id + aggregate properties.
- **Precision:** PostHog free tier tracks up to ~2M events/month; scaling assumed if $$ grows.

---

## 7. Success Criteria & Next Steps

### For CEO Approval
- ✅ Activation event is clear and defensible (not too early, not too late)
- ✅ Targets are ambitious but realistic for a launch audience
- ✅ Event mapping is complete and testable
- ✅ No ambiguities about what "success" looks like

### Next Steps (After Approval)
1. **CTO:** Implement PostHog SDK + event tracking in codebase
2. **CTO:** Deploy to staging, validate events fire correctly
3. **CTO:** Create PostHog dashboards for real-time monitoring
4. **CEO:** Review dashboards, make any strategic adjustments
5. **Launch:** Monitor Week 1 activation in real-time; adjust messaging if rates fall below 20%

---

## 8. Revision History
- **2026-04-23:** Initial draft (CTO)
