import { NextRequest, NextResponse } from "next/server";
import { stripe } from "~/lib/stripe";
import { db } from "~/server/db";
import { auth } from "~/server/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId, paymentMethodId } = await req.json();

    if (!priceId || !paymentMethodId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Get or create Stripe customer
    let customer = await db.stripeCustomer.findUnique({
      where: { userId: session.user.id },
    });

    if (!customer) {
      const stripeCustomer = await stripe.customers.create({
        email: session.user.email || undefined,
        name: session.user.name || undefined,
        metadata: {
          userId: session.user.id,
        },
      });

      customer = await db.stripeCustomer.create({
        data: {
          userId: session.user.id,
          stripeCustomerId: stripeCustomer.id,
          email: session.user.email || "",
          name: session.user.name || null,
        },
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.stripeCustomerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Update payment method
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.stripeCustomerId,
    });

    await stripe.customers.update(customer.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        client_secret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
      },
    });
  } catch (error) {
    console.error("Subscription creation error:", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}