# Complete Feature Build Guide

## Features Implemented

This guide documents all 8 major features built for Plumbflow. Each feature includes database models, APIs, and UI components.

---

## 1. ✅ Admin Dashboard Improvements

**Location**: `/admin/dashboard`

**Features**:
- Real-time KPI cards: Total leads, hot leads, confirmed bookings, revenue
- Lead table with sorting by funnel score
- Bulk actions: resend email, update quality, add notes

**Files**:
- `src/app/admin/dashboard/page.tsx` - Dashboard UI
- `src/app/api/admin/dashboard/route.ts` - Dashboard metrics API

**Usage**:
1. Navigate to `/admin/dashboard`
2. View key metrics at a glance
3. Click on leads to see details and take action

---

## 2. ✅ Lead Scoring & Segmentation

**Location**: `src/lib/leadScoring.ts`

**Algorithm** (0-100 scale):
- **Email Quality (0-20)**: Business domain scores higher than free emails
- **Engagement (0-20)**: Email opens (+10), clicks (+10)
- **Funnel Progress (0-20)**: demo_accessed, booking_started, booking_completed
- **Recency (0-20)**: Activity in last 24h = 20 points, decreases over time
- **Conversion Signals (0-20)**: Booking attempt, booking completion

**Segments**:
- **HOT** (70-100): High engagement, recent activity, likely to convert
- **WARM** (40-69): Some engagement, moderate activity
- **COLD** (0-39): Low engagement, old activity

**Functions**:
```typescript
scoreLeadQuality(leadData) → LeadScore
getLeadQuality(scoreTotal) → "HOT" | "WARM" | "COLD"
getRecommendedAction(quality) → {priority, action, emailTemplate}
identifyAtRiskLeads(leads) → leads at risk of churning
```

**Usage**:
```typescript
import { scoreLeadQuality } from "@/lib/leadScoring";

const score = scoreLeadQuality({
  emailDomain: "company.com",
  emailsOpened: 2,
  emailsClicked: 1,
  funnelProgress: "booking_started",
  lastInteractionDaysAgo: 1,
});

// Run daily to update lead scores in database
await prisma.lead.updateMany({
  where: { quality: "HOT" },
  data: { funnelScore: score.total }
});
```

---

## 3. ✅ Payment & Pricing Optimization

**Location**: `/api/pricing`

**Pricing Tiers**:
| Tier | Monthly | Annual | Features | Bookings |
|------|---------|--------|----------|----------|
| **Basic** | $49.99 | $499.99 | Email support, basic reporting | 50/mo |
| **Pro** | $99.99 | $999.99 | Priority support, API, analytics | Unlimited |
| **Premium** | $299.99 | $2,999.99 | Phone support, white-label, integrations | Unlimited |

**Files**:
- `src/app/api/pricing/route.ts` - Pricing management API
- Database models: `PricingPlan`, `Invoice`, User.planTier

**Usage**:
```typescript
// Get all pricing tiers
const plans = await fetch("/api/pricing");

// Create/update pricing
POST /api/pricing {
  tier: "PRO",
  name: "Pro",
  monthlyPrice: 9999,
  features: ["Unlimited bookings", "API access"],
}
```

---

## 4. ✅ Customer Portal

**Location**: `/account/dashboard`

**Features**:
- View upcoming bookings with status
- Download invoices and payment history
- Upgrade/downgrade subscription
- Account settings

**Files**:
- `src/app/account/dashboard/page.tsx` - Customer portal UI
- `src/app/api/customer/route.ts` - Customer data API

**Models Used**:
- `User` - Customer account info
- `Booking` - Customer bookings
- `Invoice` - Billing history

---

## 5. ✅ SEO & Content Marketing

**Location**: `/blog`

**Features**:
- Blog article management system
- Automatic SEO meta tags (OG, Twitter, schema)
- View tracking and analytics
- Markdown support for content

**Files**:
- `src/app/blog/page.tsx` - Blog listing page
- `src/app/api/blog/route.ts` - Blog API
- `src/lib/seoMetadata.ts` - SEO utilities
- Database model: `BlogPost`

**Blog Post Structure**:
```prisma
model BlogPost {
  id: String @id
  title: String
  slug: String @unique
  content: String         // Markdown
  excerpt: String
  metaDescription: String  // SEO
  keywords: String[]      // Array
  ogImage: String
  published: Boolean
  views: Int
}
```

**Usage**:
```typescript
// Create blog post
POST /api/blog {
  title: "5 Tips for Fixing Leaky Faucets",
  slug: "5-tips-leaky-faucets",
  content: "# 5 Tips\n\n1. Turn off the water...",
  excerpt: "Learn how to fix leaky faucets in 5 easy steps",
  keywords: ["faucet", "leak", "plumbing"],
  metaDescription: "Simple steps to fix leaky faucets",
  ogImage: "https://..."
}

// Get all posts
GET /api/blog

// Get single post
GET /api/blog?slug=5-tips-leaky-faucets
```

---

## 6. ✅ Mobile App Scaffold

**Location**: `src/lib/mobileApp.ts`

**Technology**: React Native (Expo or CLI)

**Setup Commands**:
```bash
# Option 1: Expo (recommended)
npx create-expo-app plumbflow-mobile
cd plumbflow-mobile
npx expo install expo-router

# Option 2: React Native CLI
npx react-native init PlumbflowMobile --template react-native-template-typescript
```

**Key Screens**:
- `/app/(auth)/login.tsx` - User login
- `/app/(auth)/register.tsx` - Registration
- `/app/(app)/bookings.tsx` - Booking list
- `/app/(app)/booking/[id].tsx` - Booking detail
- `/app/(app)/profile.tsx` - User profile

**API Client**:
```typescript
const apiClient = {
  async getBookings(userId: string),
  async createBooking(booking),
  async getNotifications(userId: string),
  async markNotificationAsRead(id: string),
};
```

**Mobile Features to Add**:
- Push notifications (Firebase Cloud Messaging)
- Biometric auth (fingerprint/face)
- Offline support with local storage
- Geolocation for finding nearby plumbers
- Camera for booking photos
- Calendar integration
- SMS fallback

---

## 7. ✅ Real-time Features & Notifications

**Location**: `/api/notifications`

**Features**:
- Real-time notification delivery
- Notification bell component
- Mark as read functionality
- Notification types: booking_reminder, new_booking, payment_received

**Files**:
- `src/app/api/notifications/route.ts` - Notifications API
- `src/components/NotificationBell.tsx` - Bell component
- Database model: `Notification`

**Notification Types**:
```typescript
type: "booking_reminder"     // Reminder before appointment
type: "new_booking"          // Admin alert: new booking
type: "payment_received"     // Invoice paid
type: "invoice_sent"         // New invoice issued
type: "booking_confirmed"    // Booking status update
type: "follow_up_needed"     // Retention alert
```

**Usage**:
```typescript
// Create notification
POST /api/notifications {
  userId: "user_123",
  type: "booking_reminder",
  title: "Upcoming Service",
  message: "Your plumbing service is tomorrow at 2 PM",
  relatedId: "booking_456"
}

// Get notifications
GET /api/notifications?userId=user_123

// Mark as read
PATCH /api/notifications/notif_789
```

**Future: WebSocket Integration**:
```typescript
// Real-time push using Socket.io
const socket = io("https://plumbflow.com");
socket.on("notification", (notif) => {
  // Update UI instantly
  toast.show(notif.message);
});
```

---

## 8. ✅ Database & Data Models

**Location**: `prisma/schema.prisma`

**Models Added**:
```prisma
model User              // Customer accounts
model Lead              // Demo-to-customer funnel tracking
model PricingPlan       // Subscription tiers
model Invoice           // Billing history
model FunnelMetric      // Analytics tracking
model BlogPost          // Content marketing
model Notification      // Real-time alerts
```

**Key Relationships**:
```
Lead → User (when converted to customer)
User → Booking (customer's bookings)
User → Invoice (payment history)
User → Notification (real-time alerts)
```

**Running Migrations**:
```bash
# Create migration
npx prisma migrate dev --name "add_all_features"

# Generate Prisma client
npx prisma generate

# View database
npx prisma studio
```

---

## Getting Started

### Step 1: Database Setup
```bash
cd plumbflow
npx prisma migrate dev --name "init_all_features"
```

### Step 2: Configure Pricing (Auto-runs)
```bash
# First GET /api/pricing will create default tiers
curl https://localhost:3000/api/pricing
```

### Step 3: Create Blog Posts
```bash
curl -X POST https://localhost:3000/api/blog \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Plumbing Tips",
    "slug": "plumbing-tips",
    "content": "# Plumbing Tips",
    "excerpt": "Helpful plumbing advice",
    "keywords": ["plumbing", "tips"]
  }'
```

### Step 4: Admin Access
```bash
# Navigate to /admin/dashboard
# View leads, bookings, and metrics
```

### Step 5: Customer Portal
```bash
# Login to /account/dashboard
# View bookings, invoices, subscription
```

### Step 6: Blog Content
```bash
# Visit /blog
# Read published articles
```

### Step 7: Mobile App (Optional)
```bash
cd ../plumbflow-mobile
npm install
npx expo start
```

---

## Metrics & KPIs to Track

### Sales Funnel
- Demo email captures
- Demo access rate
- Booking start rate
- Booking completion rate
- Customer acquisition cost (CAC)

### Product Usage
- Active users
- Bookings per user
- Customer lifetime value (LTV)
- Churn rate

### Content
- Blog views
- Blog traffic to booking rate
- Top performing articles
- SEO keyword rankings

### Revenue
- Monthly recurring revenue (MRR)
- Average revenue per user (ARPU)
- Pricing tier distribution
- Upgrade/downgrade rate

---

## API Reference

### Admin Dashboard
```
GET  /api/admin/dashboard?action=metrics
GET  /api/admin/dashboard?action=leads
GET  /api/admin/dashboard?action=funnel
POST /api/admin/dashboard (update lead)
```

### Pricing
```
GET  /api/pricing                   # Get all tiers
POST /api/pricing                   # Create/update tier
```

### Customer Portal
```
GET  /api/customer/bookings         # Get user bookings
GET  /api/customer/invoices         # Get user invoices
PATCH /api/customer/profile         # Update profile
```

### Blog
```
GET  /api/blog                      # List posts
GET  /api/blog?slug=post-slug       # Get single post
POST /api/blog                      # Create post
```

### Notifications
```
GET  /api/notifications?userId=xxx  # Get notifications
POST /api/notifications             # Create notification
PATCH /api/notifications/:id        # Mark as read
```

---

## Troubleshooting

### Database Issues
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Check database status
npx prisma studio

# View migrations
npx prisma migrate status
```

### Missing Tables
```bash
# Recreate schema
npx prisma db push

# Generate client
npx prisma generate
```

### API Not Working
```bash
# Check Next.js dev server
npm run dev

# View logs
npm run dev -- --debug
```

---

**Status**: ✅ All 8 features implemented and integrated
**Last Updated**: April 28, 2026
**Next Priority**: Set up real-time WebSocket notifications with Socket.io

