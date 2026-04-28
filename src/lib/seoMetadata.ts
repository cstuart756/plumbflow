/**
 * SEO & Metadata Utilities
 * For generating Open Graph, Twitter, and other meta tags
 */

import { Metadata } from "next";

export function generateBlogMetadata(post: {
  title: string;
  excerpt?: string;
  metaDescription?: string;
  keywords?: string[];
  ogImage?: string;
  slug: string;
}): Metadata {
  const description = post.metaDescription || post.excerpt || "Expert plumbing advice";

  return {
    title: post.title,
    description,
    keywords: post.keywords || ["plumbing", "tips", "advice"],
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: `https://plumbflow.com/blog/${post.slug}`,
      images: [
        {
          url: post.ogImage || "https://plumbflow.com/og-default.png",
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [post.ogImage || "https://plumbflow.com/og-default.png"],
    },
  };
}

export function generatePricingMetadata(): Metadata {
  return {
    title: "Pricing - Plumbflow",
    description: "Simple, transparent pricing for plumbing businesses",
    openGraph: {
      title: "Plumbflow Pricing",
      description: "Find the perfect plan for your plumbing business",
      url: "https://plumbflow.com/pricing",
      type: "website",
    },
  };
}

export function generateLocalBusinessSchema(company: {
  name: string;
  address: string;
  phone: string;
  latitude: number;
  longitude: number;
  region: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: company.name,
    description: "Online booking platform for plumbing services",
    address: {
      "@type": "PostalAddress",
      addressLocality: company.address,
      addressRegion: company.region,
    },
    telephone: company.phone,
    geo: {
      "@type": "GeoCoordinates",
      latitude: company.latitude,
      longitude: company.longitude,
    },
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
