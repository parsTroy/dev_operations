"use client";

import { useEffect, useState } from 'react';
import { loadStripe, type Stripe, type StripeElements } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;

export function useStripeElements() {
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!stripePromise) {
      // Use the publishable key directly from environment
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        console.error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined');
        setIsLoading(false);
        return;
      }
      stripePromise = loadStripe(publishableKey);
    }

    stripePromise.then((stripeInstance) => {
      setStripe(stripeInstance);
      if (stripeInstance) {
        setElements(stripeInstance.elements());
      }
      setIsLoading(false);
    });
  }, []);

  return { stripe, elements, isLoading };
}