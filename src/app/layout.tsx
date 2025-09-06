import "~/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { TRPCReactProvider } from "~/trpc/react";
import { PerformanceMonitor } from "~/components/performance/performance-monitor";

export const metadata: Metadata = {
  title: "dev_operations - Developer Collaboration Hub",
  description: "A collaborative app for developers to manage projects, tasks, and documentation",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  keywords: ["developer", "collaboration", "project management", "tasks", "documentation"],
  authors: [{ name: "dev_operations" }],
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
        url: "/og-image.jpg", // Path to your generated image
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
    images: ["/public/og-image.jpg"], // Same image for Twitter
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
      </head>
      <body>
        <PerformanceMonitor />
        <SessionProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}