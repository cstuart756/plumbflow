import type { Metadata } from "next";
import { Sora, JetBrains_Mono } from "next/font/google";
import PostHogProvider from "@/components/PostHogProvider";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://plumbflow.com";

const sora = Sora({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  icons: {
    icon: [
      { url: "/images/plumbflowfavicon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/images/plumbflowfavicon.png", type: "image/png" }],
    shortcut: ["/images/plumbflowfavicon.png"],
  },
  title: {
    default: "Plumbflow | Fast, Reliable Plumbing",
    template: "%s | Plumbflow",
  },
  description: "Book trusted local plumbers in minutes for emergency repairs and scheduled plumbing services.",
  keywords: [
    "plumber near me",
    "emergency plumber",
    "drain cleaning",
    "leak repair",
    "water heater installation",
    "plumbing services",
    "book plumber online",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Plumbflow | Stop Missing Calls. Start Booking Automatically.",
    description: "Replace missed calls with an always-on booking system. 24/7 availability, automatic reminders, and mobile-ready dashboard.",
    url: "/",
    siteName: "Plumbflow",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/plumbflowhero.png",
        width: 1200,
        height: 630,
        alt: "Plumbflow dashboard and booking flow",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plumbflow | Stop Missing Calls. Start Booking Automatically.",
    description: "Replace missed calls with an always-on booking system. 24/7 availability, automatic reminders, and mobile-ready dashboard.",
    images: ["/images/plumbflowhero.png"],
    creator: "@plumbflow",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sora.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}

export default RootLayout;
