import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { db } from "~/server/db";
import { env } from "~/env";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await handleSubscriptionChange(event.data.object);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object);
        break;
      case "invoice.payment_succeeded":
        await handlePaymentSucceeded(event.data.object);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(event.data.object);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}

async function handleSubscriptionChange(subscription: Record<string, unknown>) {
  const userSubscription = await db.userSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id as string },
    include: { user: true },
  });

  if (!userSubscription) return;

  await db.userSubscription.update({
    where: { id: userSubscription.id },
    data: {
      status: subscription.status as string,
      currentPeriodStart: new Date((subscription.current_period_start as number) * 1000),
      currentPeriodEnd: new Date((subscription.current_period_end as number) * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end as boolean,
    },
  });

  // Update user subscription status
  await db.user.update({
    where: { id: userSubscription.userId },
    data: {
      subscriptionStatus: subscription.status as string,
    },
  });
}

async function handleSubscriptionDeleted(subscription: Record<string, unknown>) {
  const userSubscription = await db.userSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id as string },
  });

  if (!userSubscription) return;

  await db.userSubscription.update({
    where: { id: userSubscription.id },
    data: {
      status: "canceled",
    },
  });

  // Reset user to free tier
  await db.user.update({
    where: { id: userSubscription.userId },
    data: {
      subscriptionTier: "free",
      projectLimit: 5,
      subscriptionStatus: "canceled",
    },
  });
}

async function handlePaymentSucceeded(invoice: Record<string, unknown>) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const userSubscription = await db.userSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!userSubscription) return;

  // Record payment transaction
  await db.paymentTransaction.create({
    data: {
      userId: userSubscription.userId,
      stripePaymentIntentId: invoice.payment_intent as string,
      amount: (invoice.amount_paid as number) / 100,
      currency: invoice.currency as string,
      status: "succeeded",
      description: invoice.description as string,
      metadata: invoice.metadata as Record<string, string>,
    },
  });
}

async function handlePaymentFailed(invoice: Record<string, unknown>) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const userSubscription = await db.userSubscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
  });

  if (!userSubscription) return;

  // Record failed payment
  await db.paymentTransaction.create({
    data: {
      userId: userSubscription.userId,
      stripePaymentIntentId: invoice.payment_intent as string,
      amount: (invoice.amount_due as number) / 100,
      currency: invoice.currency as string,
      status: "failed",
      description: invoice.description as string,
      metadata: invoice.metadata as Record<string, string>,
    },
  });
}