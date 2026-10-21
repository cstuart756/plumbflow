# PlumbFlow — Feature Backlog (MoSCoW)

**Capacity:** 60 story points (1 pt ≈ half a day)
**Rule:** Must ≤ 36 pts (60%), Should = 12 pts (20%), Could = 12 pts (20%)

---

## MUST HAVE — 36 pts (60%)

| # | Feature | Pts | Business Justification |
|---|---------|-----|------------------------|
| 1 | Multi-tenant auth: signup, login, tenant creation, session | 6 | No product without it. Every query is tenant-scoped. Reuses proven TaskForge NextAuth pattern. |
| 2 | Tenant onboarding: business name, slug, phone, services (single form) | 3 | A tenant with no services has a useless booking page. |
| 3 | Public booking page `/b/[slug]` with validated booking form | 8 | The core revenue-generating flow. The entire product exists to make this work. |
| 4 | Booking persistence: server-side Zod validation, conflict check, tenant attribution | 3 | Current `BookingForm.tsx` posts unvalidated, unscoped data. Blocks launch. |
| 5 | Admin dashboard: list bookings, view detail, change status | 5 | Owner cannot operate the business without seeing bookings. |
| 6 | Email notifications: customer confirmation + owner alert (Resend) | 3 | Unconfirmed bookings are not trusted bookings. Drives conversion. |
| 7 | Stripe subscription: 14-day trial → £19/month, portal access | 7 | The revenue model. Without billing there is no business. |
| 8 | Legal pages: Privacy Policy + Terms of Service | 1 | UK/EU legal requirement. TaskForge components port directly. |

**Must Have total: 36 pts — exactly at the 60% ceiling.**

> **Risk note on #7:** Stripe at 7 pts is the tightest line item. If it slips
> past Week 10, it moves to Should Have and the first 5 tenants are invoiced
> manually. Decision point: end of Sprint 2.

---

## SHOULD HAVE — 12 pts (20%)

| # | Feature | Pts | Business Justification |
|---|---------|-----|------------------------|
| 9 | Tenant settings: edit business details, full services CRUD | 4 | Services change over time. Without this, owners email you to update. Deferrable for first 5 tenants via admin-only edit. |
| 10 | Password reset + email verification | 3 | Real users need self-service recovery. Deferrable — manual reset via admin for launch cohort. Code ports from TaskForge. |
| 11 | Booking calendar view + full status workflow (confirmed / completed / cancelled) | 5 | Improves day-to-day ops significantly, but a list dashboard ships the product. |

**Should Have total: 12 pts.**

---

## COULD HAVE — 12 pts (20%)

| # | Feature | Pts | Business Justification |
|---|---------|-----|------------------------|
| 12 | Customer CRM: view booking history per customer | 4 | Retention value. Empty at launch — no history exists yet. |
| 13 | SMS reminders via Twilio | 3 | Reduces no-shows, but email covers launch. Costs per-message. |
| 14 | Reviews / ratings collection | 2 | Marketing value. Needs volume before it's meaningful. |
| 15 | Analytics dashboard: jobs per month, revenue | 3 | Useful once there is data to analyse. |

**Could Have total: 12 pts.**

---

## WON'T HAVE (THIS RELEASE)

Explicitly out of scope. Issues remain open and labelled `priority:won't-have`.

| Feature | Reason for exclusion |
|---------|----------------------|
| Multi-plumber marketplace / quote comparison | Different product, different business model |
| Native mobile app | Web-first; PWA covers mobile for now |
| Live chat / chatbot | Support volume does not justify it yet |
| GPS tracking / dispatch routing | High complexity, low launch value |
| Inventory / parts management | Out of core domain |
| AI features of any kind | No validated use case, no launch justification |
| Team member sub-accounts | Early tenants are solo plumbers |
| Invoicing / accounting integrations | Out of core domain |
| Recurring bookings | Edge case at launch |
| Custom branding (logo, colours) | Polish, not function |

---

## Milestones

- **MVP** — Issues #1–#8 (Must Have)
- **Post-Launch v1.1** — Issues #9–#11 (Should Have)
- **Backlog** — Issues #12–#15 (Could Have)