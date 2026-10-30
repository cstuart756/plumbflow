# Plumbflow

Plumbflow is a web application for plumbing businesses to collect service
bookings, manage customer and job information, and configure their business
accounts. It combines public booking pages with a multi-tenant application,
Stripe subscription billing, and optional email, CRM, SMS, and analytics
integrations.

> **Project status:** This repository contains both implemented application
> flows and demo or in-progress surfaces. In particular, `/account/login` and
> `/account/register` use browser `localStorage` and are demo-only; they are not
> secure authentication. Use the tenant-backed `/login` and `/register` flows
> for the database-backed account experience. Review the current behavior and
> integrations before using the app with real customers.

## Features

- Tenant-scoped business accounts, users, services, customers, and bookings.
- Public booking pages at `/b/<business-slug>`.
- Business onboarding and an authenticated application area.
- Stripe Checkout for business subscription billing, with webhook handling.
- Booking confirmation and business notification emails through Resend.
- Optional CRM connectors for HubSpot, Pipedrive, or Salesforce.
- Optional Twilio SMS, Slack retention alerts, and PostHog client analytics.
- Admin pages, lead capture, and a protected retention-alert endpoint.

The public marketing page includes presentation content and pricing copy. The
amount charged for a subscription is determined by the Stripe Price configured
for the deployment; verify that it matches the intended offer.

## Technology

- [Next.js](https://nextjs.org/) 16 App Router and React 19
- TypeScript and Tailwind CSS 4
- PostgreSQL with Prisma 7 and the Prisma PostgreSQL driver adapter
- NextAuth credentials authentication
- Stripe, Resend, and optional third-party integrations
- Heroku Node.js buildpack for the current production target

## Getting started

### Prerequisites

- Node.js and npm versions supported by the installed Next.js version.
- A PostgreSQL database for database-backed routes.
- Provider credentials for any integrations you want to exercise locally.

### Install

```bash
npm ci
```

Copy `.env.example` to `.env` and set values for your local environment. For
example, in PowerShell:

```powershell
Copy-Item .env.example .env
```

Do not commit `.env` or other files containing credentials. Environment files
are ignored by Git.

### Configure the database

Set `DATABASE_URL` to a PostgreSQL connection string. Generate the Prisma
client and apply the current schema to a local development database:

```bash
npm run prisma:generate
npx prisma db push
```

`db push` synchronizes the Prisma schema directly with the database and does
not create migration history. This repository does not currently include
checked-in Prisma migrations. For a production database, use it only for an
initial empty-database setup; establish and review migration files before
making subsequent production schema changes.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Set only the credentials for integrations you use, but configure the core
variables before deploying. Heroku Postgres supplies `DATABASE_URL`
automatically when the database add-on is attached.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string. |
| `NEXTAUTH_URL` | Yes for authentication and billing redirects | Canonical application URL. |
| `NEXTAUTH_SECRET` | Yes | Secret used by NextAuth to sign and encrypt tokens. Use a long, random value. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Public site URL used for metadata, sitemap, and robots output. |
| `ADMIN_PASSWORD` | Yes for admin login | Password for the single-admin surface. Use a strong, unique value. |
| `ADMIN_AUTH_SECRET` | Yes for admin login | Long, random secret used to sign the admin cookie. |
| `CRON_SECRET` | Yes to call the retention endpoint | Secret expected in the `x-cron-secret` request header. |
| `STRIPE_SECRET_KEY` | For Stripe billing | Stripe secret API key. |
| `STRIPE_BOOKING_PRICE_ID` | For Stripe billing | Stripe Price ID used for subscription Checkout. |
| `STRIPE_WEBHOOK_SECRET` | For Stripe webhooks | Signing secret for the configured Stripe webhook endpoint. |
| `RESEND_API_KEY` | For booking emails | Resend API key. The booking action uses Resend directly. |
| `MAIL_FROM` | Recommended for email | Verified sender identity, such as `Plumbflow <bookings@example.com>`. |
| `EMAIL_PROVIDER` | Optional | Provider selected by the general email service: `resend`, `sendgrid`, or `mailgun`. |
| `SENDGRID_API_KEY` | Optional | SendGrid credential when using that provider. |
| `MAILGUN_API_KEY` | Optional | Mailgun API key when using that provider. |
| `MAILGUN_DOMAIN` | Optional | Verified Mailgun sending domain. |
| `CRM_PROVIDER` | Optional | CRM selection: `hubspot`, `pipedrive`, or `salesforce`. |
| `HUBSPOT_API_KEY` | Optional | HubSpot private app credential. |
| `PIPEDRIVE_API_KEY` | Optional | Pipedrive API token. |
| `SALESFORCE_INSTANCE_URL` | Optional | Salesforce instance URL. |
| `SALESFORCE_ACCESS_TOKEN` | Optional | Salesforce access token. |
| `TWILIO_ACCOUNT_SID` | Optional | Twilio account SID. |
| `TWILIO_AUTH_TOKEN` | Optional | Twilio auth token. |
| `TWILIO_PHONE_NUMBER` | Optional | Twilio sender number. |
| `SLACK_WEBHOOK_URL` | Optional | Slack incoming webhook for retention alerts. |
| `NEXT_PUBLIC_POSTHOG_KEY` | Optional | PostHog project key for client analytics. |

`EMAIL_PROVIDER` configures the general email-service wrapper. The booking
creation action currently sends through Resend directly, so set
`RESEND_API_KEY` for booking confirmations even if another provider is
configured. Never expose secret keys in client-side code or commit them to the
repository. Variables prefixed with `NEXT_PUBLIC_` are intended for browser
use and should not contain secrets.

## Useful commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local Next.js development server. |
| `npm run build` | Create a production build. |
| `npm run start` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm run prisma:generate` | Generate the Prisma client. |
| `npm run prisma:migrate` | Run `prisma migrate dev` for local development. |
| `npm run prisma:studio` | Open Prisma Studio. |

There is no `test` script in `package.json` at this time.

## Heroku deployment

The configured Heroku app is **`plumbflow`** in the **EU** region. Its default
URL is [https://plumbflow-c20a0353a72f.herokuapp.com](https://plumbflow-c20a0353a72f.herokuapp.com).
The app uses the `heroku/nodejs` buildpack and has a Heroku Postgres Essential 0
database attached. Heroku's Node.js buildpack starts the app using the
`start` script in `package.json`.

### Prepare config vars

Set application secrets in the Heroku Dashboard or with the Heroku CLI. Do not
put real credentials in this README or in source control. The database add-on
provides `DATABASE_URL`; set the remaining required variables described above.
For the current default app URL:

```bash
heroku config:set NEXTAUTH_URL=https://plumbflow-c20a0353a72f.herokuapp.com NEXT_PUBLIC_SITE_URL=https://plumbflow-c20a0353a72f.herokuapp.com -a plumbflow
```

Configure Stripe's webhook endpoint as:

```text
https://plumbflow-c20a0353a72f.herokuapp.com/api/stripe/webhook
```

Use the webhook signing secret supplied by Stripe as `STRIPE_WEBHOOK_SECRET`.
If the domain changes, update both URL config vars and the Stripe endpoint.

### Build and deploy

From the repository's deployment branch:

```bash
npm ci
npm run lint
npm run build
git push heroku main
```

The Heroku remote must point to `https://git.heroku.com/plumbflow.git`. If
needed, configure it with:

```bash
heroku git:remote -a plumbflow -r heroku
```

The application build does not apply database schema changes automatically.
For an initial, empty database only, deploy the app and then synchronize the
schema with:

```bash
heroku run npx prisma db push -a plumbflow
```

Do not use `prisma migrate dev` against production. Before ongoing production
schema changes, add checked-in Prisma migrations and use a reviewed
`prisma migrate deploy` release process.

### Verify and troubleshoot

```bash
heroku apps:info -a plumbflow
heroku config -a plumbflow
heroku ps -a plumbflow
heroku logs --tail -a plumbflow
```

`heroku config` displays secret values; avoid sharing its output. The retention
endpoint is `POST /api/cron/retention` and requires the `x-cron-secret` header.
Schedule it with a trusted external scheduler if retention alerts are enabled.

## Application routes

| Route | Purpose |
| --- | --- |
| `/` | Public marketing and demo page. |
| `/register`, `/login` | Tenant-backed business registration and sign-in. |
| `/b/[slug]` | Public booking page for a business. |
| `/app` | Authenticated application area. |
| `/app/onboarding` | Business profile and service setup. |
| `/app/billing` | Subscription billing status and checkout. |
| `/admin` | Admin entry point. |
| `/admin/dashboard` | Admin dashboard and booking management. |
| `/api/auth/[...nextauth]` | NextAuth handler. |
| `/api/stripe/webhook` | Stripe webhook handler. |
| `/api/cron/retention` | Retention-alert endpoint. |
| `/api/leads` | Demo lead capture. |
| `/api/analytics` | Analytics event logging endpoint. |

`/account/login` and `/account/register` are separate demo-only pages that
store credentials in browser `localStorage`; do not use them for real accounts.

## Repository layout

```text
src/
  app/          Next.js routes, pages, and route handlers
  components/   Shared UI components
  emails/       React Email templates
  lib/          Authentication, Prisma, billing, CRM, and business logic
  utils/        Email, SMS, and supporting utilities
prisma/
  schema.prisma PostgreSQL data model
docs/
  schema/       Data model and ERD documentation
```

## Data model

The Prisma schema defines `Tenant`, `User`, `Service`, `Customer`, and
`Booking` records. Users, services, customers, and bookings are associated with
a tenant. Booking status is represented by the `BookingStatus` enum.

See [`docs/schema/tenant-model.md`](docs/schema/tenant-model.md) and
[`docs/schema/ERD.md`](docs/schema/ERD.md) for additional schema notes.

## Contributing

1. Create a branch for your change.
2. Install dependencies with `npm ci`.
3. Run `npm run lint` and `npm run build`.
4. Keep credentials out of commits, logs, and client-side code.

## License

No license file is currently included in this repository. Contact the project
owner for usage and redistribution terms.
