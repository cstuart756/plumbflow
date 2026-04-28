# Plumbflow CRM & Growth Infrastructure Setup Guide

This guide covers integrating CRM providers, email services, funnel tracking, and retention alerts.

## 1. CRM Integration (HubSpot, Pipedrive, Salesforce)

### Environment Variables

Add to `.env.local`:

```env
# Choose one CRM provider
CRM_PROVIDER=hubspot  # Options: hubspot, pipedrive, salesforce

# HubSpot
HUBSPOT_API_KEY=your_hubspot_api_key_here

# Pipedrive
PIPEDRIVE_API_KEY=your_pipedrive_api_key_here

# Salesforce
SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
SALESFORCE_ACCESS_TOKEN=your_salesforce_token_here
```

### Get API Keys

**HubSpot:**
1. Go to [HubSpot Settings](https://app.hubspot.com/l/settings/api-keys)
2. Create private app with scope: `crm.objects.contacts.write`
3. Copy API key

**Pipedrive:**
1. Go to Settings → Personal Preferences → API
2. Copy API token

**Salesforce:**
1. Setup → Apps → App Manager → Create Connected App
2. Enable OAuth 2.0
3. Create service account and generate token

## 2. Email Service Integration (SendGrid or Mailgun)

### Environment Variables

```env
# Choose one email provider
EMAIL_PROVIDER=sendgrid  # Options: sendgrid, mailgun

# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key_here

# Mailgun
MAILGUN_API_KEY=your_mailgun_api_key_here
MAILGUN_DOMAIN=mg.yourdomain.com
```

### Get API Keys

**SendGrid:**
1. Go to [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)
2. Create API key with Mail Send scope
3. Copy key

**Mailgun:**
1. Go to Account → API Security
2. Copy API Key
3. Go to Sending → Domain Management and verify your domain

## 3. PostHog Funnel Setup

### Create the Conversion Funnel

1. Go to PostHog → Funnels → Create new
2. Add steps in this order:
   - Step 1: `demo_email_captured`
   - Step 2: `demo_accessed`
   - Step 3: `booking_started`
   - Step 4: `booking_completed`

3. Configure:
   - Time window: 30 days
   - Breakdown by: `utm_source` (to see which traffic sources convert best)
   - Save as: "Demo to Booking Conversion"

### Expected Conversion Rates

- **demo_email_captured**: 100% (baseline)
- **demo_accessed**: 60-70% (not all users follow email link)
- **booking_started**: 25-35% (not all demo users attempt booking)
- **booking_completed**: 15-20% (some abandon during checkout)

### Optimize High Drop-off Points

- If `demo_accessed` is low: Improve email subject/CTA urgency
- If `booking_started` is low: Demo UX is confusing, add tooltips
- If `booking_completed` is low: Checkout has friction (Stripe delays, form length)

## 4. Email Nurture Sequence

The system automatically sends emails:

1. **Immediately**: Welcome email after email capture
2. **24 hours**: "How's the demo going?" with live walkthrough option
3. **3 days**: Social proof testimonials + pricing nudge
4. **7 days**: Final offer with 50% off (expires in 7 days)

### To Customize Email Templates

Edit `/src/lib/emailService.ts` in the `emailTemplates` object.

## 5. Retention Alerts & Cron Job

### Setup Cron Job

**Option A: Vercel Crons** (Recommended for Vercel deployments)

1. Create `vercel.json` in project root:
```json
{
  "crons": [{
    "path": "/api/cron/retention",
    "schedule": "0 9 * * *"
  }]
}
```

2. Add CRON_SECRET to environment:
```env
CRON_SECRET=your_secret_key_here
```

3. Deploy to Vercel

**Option B: External Cron Service** (Free options: EasyCron, cron-job.org)

1. Go to cron-job.org
2. Create new job:
   - URL: `https://yoursite.com/api/cron/retention`
   - Method: POST
   - Headers: Add `x-cron-secret: your_secret_key_here`
   - Schedule: `0 9 * * *` (daily at 9am UTC)

**Option C: Background Job Queue** (Bull, RQ, Celery)

```typescript
// Example with Bull
import Queue from 'bull';

const retentionQueue = new Queue('retention', process.env.REDIS_URL);

retentionQueue.process(async () => {
  await sendRetentionEmails();
});

// Schedule daily
retentionQueue.add({}, { repeat: { cron: '0 9 * * *' } });
```

### Slack Alerts for Inactive Users

1. Create Slack webhook:
   - Go to your Slack workspace → Settings → Apps → Custom Integrations
   - Search "Incoming Webhooks"
   - Create new webhook, select channel
   - Copy URL

2. Add to `.env.local`:
```env
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

Now retention alerts will post to Slack daily.

## 6. Testing CRM & Email Integration

### Test CRM Creation

```bash
curl -X POST http://localhost:3000/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "firstName": "John",
    "lastName": "Smith",
    "phone": "07123456789"
  }'
```

Expected response:
```json
{
  "ok": true,
  "email": "test@example.com",
  "crmId": "hubspot_contact_123",
  "emailSent": true
}
```

### Check Console Logs

```
[LEAD_CAPTURED] {email, firstName, lastName, phone, timestamp}
[CRM] Contact created: hubspot_contact_123
[EMAIL] Welcome email sent to test@example.com
```

## 7. Database Model (for Leads)

If using Prisma, add this to schema:

```prisma
model Lead {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String?
  lastName  String?
  phone     String?
  
  // CRM Integration
  crmId     String?       // External CRM contact ID
  crmProvider String?     // hubspot, pipedrive, salesforce
  
  // Demo Tracking
  demoAccessedAt DateTime?
  bookingStartedAt DateTime?
  bookingCompletedAt DateTime?
  
  // Engagement
  emailsReceived Int @default(1)
  lastEmailAt DateTime?
  lastInteractionAt DateTime @default(now())
  
  // Metadata
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 8. Key Metrics to Monitor

- **Demo Email Capture Rate**: Percentage of visitors who enter email
- **Demo Access Rate**: Percentage of emails that click link (target: 60%+)
- **Booking Start Rate**: Percentage of demo users who click booking button (target: 25%+)
- **Booking Completion Rate**: Percentage who finish checkout (target: 15%+)
- **Overall Conversion**: Demo email → paid customer (target: 3-5%)

## 9. Troubleshooting

### CRM Integration Not Working

- Check API key is valid in provider dashboard
- Check rate limits haven't been exceeded
- Look at console logs: `[CRM]` entries will show errors
- Test API key directly with provider's API explorer

### Emails Not Sending

- Check `EMAIL_PROVIDER` is set correctly
- Verify API keys in `.env.local`
- Check spam folder (SendGrid/Mailgun use shared IPs)
- Look at console logs: `[EMAIL]` entries will show errors

### Funnel Not Tracking

- Verify PostHog events are firing: Open browser DevTools → Network, look for PostHog requests
- Check PostHog API key is valid in `.env.local`: `NEXT_PUBLIC_POSTHOG_KEY`
- Events must match exactly: `demo_email_captured`, `demo_accessed`, etc.

### Cron Job Not Running

- Check cron service dashboard for errors
- Verify endpoint is public (no auth required on `/api/cron/retention`)
- Test manually: `curl https://yoursite.com/api/cron/retention -H "x-cron-secret: YOUR_SECRET"`
- Check server logs for any errors

## Next Steps

1. **Week 1**: Set up CRM + email service, test demo flow
2. **Week 2**: Create PostHog funnel, identify drop-off points
3. **Week 3**: Deploy cron job for retention emails
4. **Week 4**: Optimize based on funnel metrics
5. **Week 5+**: A/B test email templates, CTA copy, timing

## API Reference

### POST `/api/leads`
Create a new lead from demo email capture.

**Request:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Smith",
  "phone": "07123456789"
}
```

**Response:**
```json
{
  "ok": true,
  "email": "user@example.com",
  "crmId": "contact_123",
  "emailSent": true
}
```

### POST `/api/cron/retention`
Trigger retention email send for inactive users.

**Headers:**
```
x-cron-secret: your_secret_key_here
```

**Response:**
```json
{
  "ok": true,
  "message": "Retention check completed"
}
```

---

**Last Updated**: April 28, 2026
**Status**: Production Ready
