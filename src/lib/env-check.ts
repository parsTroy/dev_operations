import { env } from '~/env';

export function checkStripeEnv() {
  const requiredVars = [
    'STRIPE_SECRET_KEY',
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_PRICE_ID_PRO_MONTHLY',
    'STRIPE_PRICE_ID_PRO_ANNUAL',
    'STRIPE_PRICE_ID_LIFETIME',
  ];

  const missing = requiredVars.filter(varName => !env[varName as keyof typeof env]);
  
  if (missing.length > 0) {
    console.error('❌ Missing Stripe environment variables:', missing);
    return false;
  }
  
  console.log('✅ All Stripe environment variables are loaded');
  return true;
}