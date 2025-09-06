"use client";

import { useEffect, useState } from "react";
import { loadStripe, StripeElements } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export function useStripeElements() {
  const [stripe, setStripe] = useState<any>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeInstance = await loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
        );
        
        if (stripeInstance) {
          setStripe(stripeInstance);
          // Initialize elements after stripe is loaded
          const elementsInstance = stripeInstance.elements();
          setElements(elementsInstance);
        }
      } catch (error) {
        console.error("Error loading Stripe:", error);
      } finally {
        setLoading(false);
      }
    };

    void initializeStripe();
  }, []);

  return { stripe, elements, loading };
}