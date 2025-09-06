"use client";

import { loadStripe } from '@stripe/stripe-js';
import { stripeConfig } from '~/lib/stripe';

const stripePromise = loadStripe(stripeConfig.publishableKey);

export function useStripe() {
  return stripePromise;
}