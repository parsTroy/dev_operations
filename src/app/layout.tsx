import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import { PerformanceMonitor } from "~/components/performance/performance-monitor";
import { PerformanceAnalytics } from "~/components/performance/performance-analytics";

export const metadata: Metadata = {
  title: "dev_operations - Developer Collaboration Hub",
  description: "A collaborative app for developers to manage projects, tasks, and documentation",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["developer", "collaboration", "project management", "tasks", "documentation"],
  authors: [{ name: "dev_operations" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "dev_operations - Developer Collaboration Hub",
    description: "A collaborative app for developers to manage projects, tasks, and documentation",
    type: "website",
    locale: "en_US",
    url: "https://www.devoperations.ca",
    siteName: "dev_operations",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "dev_operations - Developer Collaboration Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "dev_operations - Developer Collaboration Hub",
    description: "A collaborative app for developers to manage projects, tasks, and documentation",
    images: ["/og-image.jpg"],
  },
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
  preload: true,
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body>
        <PerformanceMonitor />
        <PerformanceAnalytics />
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}