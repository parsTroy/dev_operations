"use client";

import { useEffect } from "react";

export function PerformanceMonitor() {
  useEffect(() => {
    // Only run in production
    if (process.env.NODE_ENV !== "production") return;

    // Web Vitals monitoring
    const reportWebVitals = (metric: any) => {
      console.log("Web Vital:", metric);
      
      // Send to analytics service (e.g., Google Analytics, Vercel Analytics)
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", metric.name, {
          event_category: "Web Vitals",
          event_label: metric.id,
          value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
          non_interaction: true,
        });
      }
    };

    // Load web-vitals library dynamically
    import("web-vitals").then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(reportWebVitals);
      getFID(reportWebVitals);
      getFCP(reportWebVitals);
      getLCP(reportWebVitals);
      getTTFB(reportWebVitals);
    });
  }, []);

  return null;
}
