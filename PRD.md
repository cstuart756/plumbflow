# PlumbFlow — Product Requirements Document

**Version:** 1.0
**Status:** Approved
**Owner:** Stuart
**Last updated:** 21 October 2026

---

## 1. Problem Statement

Independent plumbing businesses lose revenue to missed calls, after-hours
enquiries, and manual diary management. Existing lead-generation sites charge
per lead but still leave the plumber managing bookings by phone and text.

## 2. Solution

PlumbFlow is a multi-tenant SaaS platform that gives every plumbing business:

- A branded public booking page at `/b/[slug]`
- An admin dashboard to view and manage incoming jobs
- Automated email confirmations to customers and owners
- A flat monthly subscription, billed via Stripe

## 3. User Roles

| Role | Description | Primary Goal |
|------|-------------|--------------|
| Platform Admin | Stuart | Onboard tenants, monitor health, provide support |
| Business Owner | Plumber / plumbing company | Receive and manage bookings without admin overhead |
| End Customer | Homeowner / commercial client | Book a service in under 60 seconds |

> **Not in scope this release:** business staff sub-accounts (single owner
> login per tenant at launch).

## 4. Core Value Proposition

**For plumbers:** Never miss a booking. A professional online presence without
commissioning a website. £19/month, cancel anytime.

**For customers:** Book a trusted local plumber in under a minute. Instant
email confirmation. No phone tag.

## 5. Business Model

- **Monetisation:** SaaS subscription per tenant, billed via Stripe.
- **Flow:** 14-day free trial → single paid tier at launch (£19/month) →
  tiered plans post-launch once usage data exists.
- **Tenancy:** One tenant = one plumbing business. Shared-schema multi-tenancy
  with `tenant_id` on every table (see `docs/schema/tenant-model.md`).

## 6. Success Metrics (MVP)

| Metric | Target |
|--------|--------|
| Time from signup to first live booking page | < 10 minutes |
| Booking form conversion (visits → submissions) | > 30% |
| Silent booking failures (5xx with no user feedback) | Zero |
| Trial → paid conversion (first cohort of 10) | > 40% |

## 7. Non-Goals — Explicitly Out of Scope

Documented to prevent scope creep. These are **Won't Have** for this release:

- Multi-plumber marketplace where customers compare quotes
- Native mobile application (iOS/Android)
- Live chat or chatbot
- GPS tracking or dispatch routing
- Inventory or parts management
- AI-generated content of any kind
- SMS notifications (deferred to Should Have / v1.1)
- Team member sub-accounts
- Invoicing and accounting integrations

## 8. Technical Constraints

- **Stack:** Next.js (App Router) + TypeScript, PostgreSQL via Prisma,
  Tailwind CSS, NextAuth, Resend (email), Stripe (billing).
- **Deployment:** Heroku Pipeline — `plumbflow-staging` and
  `plumbflow-production`. Heroku Postgres + Heroku Redis add-ons.
- **Version control:** Git + GitHub. No direct commits to `main`. Every change
  flows through issue → branch → PR → review → merge.

## 9. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep into marketplace territory | High | Non-goals section is contractual; Won't Have issues stay open and labelled |
| Tenant data leakage (cross-tenant query) | Critical | Prisma middleware enforces `tenant_id`; integration test per model |
| Stripe billing bugs block revenue | High | Billing tested in Stripe test mode before production promotion |
| Solo developer bandwidth | Medium | MoSCoW cut enforced at 60% Must Have ceiling |