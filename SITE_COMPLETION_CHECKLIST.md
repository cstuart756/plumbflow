# Site Completion Checklist

This checklist is ordered by deployment risk and product readiness. Work items should be completed top to bottom.

## 1. Production Environment Variables

- [x] Confirm every runtime env var is set in Heroku.
- [x] Keep `.env.example` aligned with actual code usage.
- [x] Verify secrets are present before each deploy.

Current note:
- Postgres addon and baseline runtime config are now provisioned on Heroku.
- Stripe test-mode config is now set in Heroku and checkout session creation is verified.
- Resend email is configured and verified with a real mailbox recipient.
- CRM, SMS, and analytics secrets still need production values for full feature verification.

Immediate Heroku setup commands (run with real values):

```bash
heroku addons:create heroku-postgresql:essential-0 -a plumbflow-app
heroku config:set NEXT_PUBLIC_SITE_URL="https://plumbflow-app-ec3192841557.herokuapp.com" -a plumbflow-app
heroku config:set ADMIN_PASSWORD="<set-strong-password>" ADMIN_AUTH_SECRET="<set-32+-char-secret>" -a plumbflow-app
heroku config:set STRIPE_SECRET_KEY="<sk_...>" STRIPE_BOOKING_PRICE_ID="<price_...>" STRIPE_WEBHOOK_SECRET="<whsec_...>" -a plumbflow-app
heroku config:set EMAIL_PROVIDER="sendgrid" SENDGRID_API_KEY="<key>" MAIL_FROM="Plumbflow <noreply@yourdomain.com>" -a plumbflow-app
heroku config:set TWILIO_ACCOUNT_SID="<AC...>" TWILIO_AUTH_TOKEN="<token>" TWILIO_PHONE_NUMBER="<+number>" -a plumbflow-app
heroku config:set CRM_PROVIDER="hubspot" HUBSPOT_API_KEY="<key>" -a plumbflow-app
heroku config:set CRON_SECRET="<set-32+-char-secret>" NEXT_PUBLIC_POSTHOG_KEY="<phc_...>" -a plumbflow-app
```

## 2. Core Customer Flow

- [x] Booking form submits into checkout and creates a booking record.
- [x] Checkout marks the lead as started and the webhook finalizes it on payment.
- [x] Confirmation email, SMS, and CRM sync are wired into the paid-booking path.
- [x] Run a live end-to-end smoke test in the deployed app.
- [x] Confirm the booking persists in Postgres.
- [x] Confirm confirmation email behavior in a real environment.
- [ ] Confirm SMS behavior in a real environment.
- [ ] Confirm CRM lead creation/update behavior in a real environment.

## 3. Admin Surface

- [x] Admin login/logout flow is wired.
- [x] Booking list, edit, and delete actions are wired.
- [x] Dashboard KPIs and lead metrics are wired.
- [ ] Verify the full admin surface in the deployed app.

## 4. Checkout and Billing

- [x] Booking checkout creates a Stripe session when configured.
- [x] Webhook handling updates the booking and lead state on success.
- [x] Validate Stripe checkout with a live test mode flow.
- [x] Verify webhook handling for success and failure cases.
- [ ] Confirm pricing tiers match the marketing copy.

Current Stripe/pricing mapping note:
- Stripe checkout currently charges `price_1TxtsaLYr2lf5YJtMl9iRKe3` at $99.00.
- Marketing homepage cards show Starter $29, Pro $79, Business $149.
- `/api/pricing` defaults currently return Basic $49.99, Pro $99.99, Premium $299.99.
- Action needed: choose one source of truth and align Stripe checkout price(s), homepage cards, and `/api/pricing` data.

## 5. Content and SEO

- [x] Review homepage booking CTA and booking flow hierarchy.
- [x] Blog index is server-rendered for crawlability.
- [x] Sitemap and robots output include the public content routes.
- [ ] Review remaining homepage copy and CTA hierarchy.

## 6. Localization

- [ ] Decide whether to keep English and Spanish.
- [ ] If yes, implement App Router-compatible locale handling.
- [ ] Remove any leftover legacy i18n routing assumptions.

## 7. Observability

- [ ] Add or verify error logging.
- [ ] Add failure alerts for bookings, webhooks, CRM, email, and SMS.
- [ ] Confirm analytics events fire for key funnel actions.

## 8. Test Coverage

- [ ] Add smoke tests for booking and admin APIs.
- [ ] Add regression coverage for auth and Prisma bootstrapping.
- [ ] Add one build check that runs before deploys.

## Status

- Completed: Production Environment Variables
- Completed: Build fixes and Heroku deploy
- Completed: Booking funnel wiring, admin nav polish, and SEO indexability
- In progress: Provider integration verification (CRM/SMS)