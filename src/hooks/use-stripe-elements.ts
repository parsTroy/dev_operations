"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

export function useStripeElements() {
  const [stripe, setStripe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
        );
        setStripe(stripeInstance);
      } catch (error) {
        console.error("Error loading Stripe:", error);
      } finally {
        setLoading(false);
      }
    };

    void initializeStripe();
  }, []);

  return { stripe, loading };
}