"use client";

import { useEffect } from "react";

interface PerformanceMetrics {
  loadTime: number;
  domContentLoaded: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

export function PerformanceAnalytics() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;

    const metrics: Partial<PerformanceMetrics> = {};

    // Basic performance metrics
    if (typeof window !== "undefined" && window.performance) {
      const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
      
      metrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart;
      metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart;

      // First Paint
      const paintEntries = performance.getEntriesByType("paint");
      const firstPaint = paintEntries.find(entry => entry.name === "first-paint");
      if (firstPaint) {
        metrics.firstPaint = firstPaint.startTime;
      }

      const firstContentfulPaint = paintEntries.find(entry => entry.name === "first-contentful-paint");
      if (firstContentfulPaint) {
        metrics.firstContentfulPaint = firstContentfulPaint.startTime;
      }
    }

    // Web Vitals (using correct imports)
    import("web-vitals").then(({ onLCP, onCLS, onINP }) => {
      onLCP((metric: any) => {
        metrics.largestContentfulPaint = metric.value;
        sendMetrics(metrics);
      });

      onINP((metric: any) => {
        metrics.firstInputDelay = metric.value;
        sendMetrics(metrics);
      });

      onCLS((metric: any) => {
        metrics.cumulativeLayoutShift = metric.value;
        sendMetrics(metrics);
      });
    });

    const sendMetrics = (currentMetrics: Partial<PerformanceMetrics>) => {
      // Send to your analytics service
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "performance_metrics", {
          event_category: "Performance",
          custom_map: currentMetrics,
        });
      }
    };
  }, []);

  return null;
}
