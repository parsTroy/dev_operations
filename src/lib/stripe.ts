import Stripe from 'stripe';
import { env } from '~/env';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
  typescript: true,
});

export const stripeConfig = {
  publishableKey: env.STRIPE_PUBLISHABLE_KEY,
  priceIds: {
    proMonthly: env.STRIPE_PRICE_ID_PRO_MONTHLY,
    proAnnual: env.STRIPE_PRICE_ID_PRO_ANNUAL,
    lifetime: env.STRIPE_PRICE_ID_LIFETIME,
  },
};

// Test function to verify Stripe connection
export async function testStripeConnection() {
  try {
    const products = await stripe.products.list({ limit: 3 });
    console.log('✅ Stripe connection successful!');
    console.log('Products found:', products.data.length);
    return true;
  } catch (error) {
    console.error('❌ Stripe connection failed:', error);
    return false;
  }
}