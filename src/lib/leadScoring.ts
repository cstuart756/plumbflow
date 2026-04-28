/**
 * Lead Scoring & Segmentation System
 * Automatically scores leads based on engagement and converts to segments
 */

import { LeadQuality } from "@prisma/client";

export interface LeadScore {
  email: number; // 0-20: domain reputation, format validity
  engagement: number; // 0-20: email opens, clicks
  funnelProgress: number; // 0-20: how far in booking funnel
  recency: number; // 0-20: how recent was last interaction
  conversion: number; // 0-20: likelihood to convert
  total: number; // 0-100 overall score
}

/**
 * Calculate lead quality score (0-100)
 * Used to prioritize follow-up and determine if lead is HOT/WARM/COLD
 */
export function scoreLeadQuality(leadData: {
  emailDomain?: string;
  emailsOpened?: number;
  emailsClicked?: number;
  funnelProgress?: "email_captured" | "demo_accessed" | "booking_started" | "booking_completed";
  lastInteractionDaysAgo?: number;
  attemptedBooking?: boolean;
  completedBooking?: boolean;
}): LeadScore {
  let score = { email: 0, engagement: 0, funnelProgress: 0, recency: 0, conversion: 0, total: 0 };

  // Email domain quality (0-20)
  const domainBlocklist = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com"]; // Free domains are lower priority
  if (leadData.emailDomain) {
    score.email = domainBlocklist.includes(leadData.emailDomain) ? 10 : 20;
  }

  // Engagement scoring (0-20)
  if (leadData.emailsOpened && leadData.emailsOpened > 0) {
    score.engagement += 10;
  }
  if (leadData.emailsClicked && leadData.emailsClicked > 0) {
    score.engagement += 10;
  }

  // Funnel progress (0-20)
  switch (leadData.funnelProgress) {
    case "email_captured":
      score.funnelProgress = 5;
      break;
    case "demo_accessed":
      score.funnelProgress = 10;
      break;
    case "booking_started":
      score.funnelProgress = 15;
      break;
    case "booking_completed":
      score.funnelProgress = 20;
      break;
  }

  // Recency bonus (0-20) - recent activity is gold
  if (leadData.lastInteractionDaysAgo !== undefined) {
    if (leadData.lastInteractionDaysAgo <= 1) score.recency = 20;
    else if (leadData.lastInteractionDaysAgo <= 3) score.recency = 15;
    else if (leadData.lastInteractionDaysAgo <= 7) score.recency = 10;
    else if (leadData.lastInteractionDaysAgo <= 14) score.recency = 5;
  }

  // Conversion signals (0-20)
  if (leadData.attemptedBooking) {
    score.conversion += 15;
  }
  if (leadData.completedBooking) {
    score.conversion = 20; // Already converted, max score
  }

  score.total = score.email + score.engagement + score.funnelProgress + score.recency + score.conversion;

  return score;
}

/**
 * Determine lead quality tier based on score
 */
export function getLeadQuality(scoreTotal: number): LeadQuality {
  if (scoreTotal >= 70) return "HOT"; // High engagement, recent activity
  if (scoreTotal >= 40) return "WARM"; // Some engagement, moderate activity
  return "COLD"; // Low engagement, old activity
}

/**
 * Determine next action for lead based on quality
 */
export function getRecommendedAction(quality: LeadQuality, daysSinceLastInteraction: number) {
  if (quality === "HOT") {
    return {
      priority: "HIGH",
      action: "Call immediately",
      emailTemplate: "hot_lead_callback",
      delay: "0 hours",
    };
  }

  if (quality === "WARM") {
    if (daysSinceLastInteraction > 7) {
      return {
        priority: "MEDIUM",
        action: "Send re-engagement email",
        emailTemplate: "warm_lead_reengagement",
        delay: "1 hour",
      };
    } else {
      return {
        priority: "MEDIUM",
        action: "Send follow-up reminder",
        emailTemplate: "warm_lead_reminder",
        delay: "24 hours",
      };
    }
  }

  return {
    priority: "LOW",
    action: "Add to nurture sequence",
    emailTemplate: "cold_lead_nurture",
    delay: "3 days",
  };
}

/**
 * Segment leads by quality for bulk actions
 */
export function segmentLeadsByQuality(leads: any[]): {
  hot: any[];
  warm: any[];
  cold: any[];
} {
  return {
    hot: leads.filter((l) => l.quality === "HOT"),
    warm: leads.filter((l) => l.quality === "WARM"),
    cold: leads.filter((l) => l.quality === "COLD"),
  };
}

/**
 * Identify at-risk leads (were HOT but going cold)
 */
export function identifyAtRiskLeads(leads: any[]): any[] {
  const daysSinceInteraction = (date: Date) => (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);

  return leads.filter((lead) => {
    // Were engaged but now inactive for 7+ days
    if (lead.emailsClicked > 0 && daysSinceInteraction(lead.lastInteractionAt) > 7) {
      return true;
    }
    // Started booking but abandoned
    if (lead.bookingStartedAt && !lead.bookingCompletedAt) {
      const daysSinceStart = daysSinceInteraction(lead.bookingStartedAt);
      if (daysSinceStart > 1) return true;
    }
    return false;
  });
}
