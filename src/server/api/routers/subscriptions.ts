import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { stripe } from "~/lib/stripe";
import { TRPCError } from "@trpc/server";

export const subscriptionsRouter = createTRPCRouter({
  // Get user's current subscription
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        subscriptionTier: true,
        projectLimit: true,
        subscriptionStatus: true,
        _count: {
          select: {
            projects: true,
          },
        },
        subscriptions: {
          where: {
            status: {
              in: ["active", "trialing"],
            },
          },
          include: {
            subscriptionPlan: true,
          },
          take: 1,
        },
      },
    });

    return user;
  }),

  // Create Stripe customer
  createCustomer: protectedProcedure
    .mutation(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      if (user.stripeCustomerId) {
        return { customerId: user.stripeCustomerId };
      }

      try {
        const customer = await stripe.customers.create({
          email: user.email!,
          name: user.name || undefined,
          metadata: {
            userId: user.id,
          },
        });

        await ctx.db.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customer.id },
        });

        await ctx.db.stripeCustomer.create({
          data: {
            userId: user.id,
            stripeCustomerId: customer.id,
            email: user.email!,
            name: user.name,
          },
        });

        return { customerId: customer.id };
      } catch (error) {
        console.error("Error creating Stripe customer:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create customer",
        });
      }
    }),

  // Create subscription
  createSubscription: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
        paymentMethodId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      if (!user.stripeCustomerId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User must have a Stripe customer ID",
        });
      }

      try {
        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: user.stripeCustomerId,
          items: [{ price: input.priceId }],
          payment_behavior: "default_incomplete",
          payment_settings: { save_default_payment_method: "on_subscription" },
          expand: ["latest_invoice.payment_intent"],
        });

        // Get subscription plan details
        const price = await stripe.prices.retrieve(input.priceId);
        const product = await stripe.products.retrieve(price.product as string);

        // Create subscription plan if it doesn't exist
        let subscriptionPlan = await ctx.db.subscriptionPlan.findUnique({
          where: { stripePriceId: input.priceId },
        });

        if (!subscriptionPlan) {
          subscriptionPlan = await ctx.db.subscriptionPlan.create({
            data: {
              name: product.name,
              description: product.description || undefined,
              price: price.unit_amount! / 100, // Convert from cents
              interval: price.recurring?.interval || "lifetime",
              intervalCount: price.recurring?.interval_count || 1,
              stripePriceId: input.priceId,
              features: product.metadata,
            },
          });
        }

        // Create user subscription record
        const userSubscription = await ctx.db.userSubscription.create({
          data: {
            userId: user.id,
            subscriptionPlanId: subscriptionPlan.id,
            stripeCustomerId: user.stripeCustomerId,
            stripeSubscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
          },
        });

        // Update user subscription tier
        const subscriptionTier = price.recurring ? "pro" : "lifetime";
        const projectLimit = subscriptionTier === "pro" ? 999999 : 999999;

        await ctx.db.user.update({
          where: { id: user.id },
          data: {
            subscriptionTier,
            projectLimit,
            subscriptionStatus: subscription.status,
          },
        });

        return {
          subscriptionId: subscription.id,
          clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
          status: subscription.status,
        };
      } catch (error) {
        console.error("Error creating subscription:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create subscription",
        });
      }
    }),

  // Cancel subscription
  cancelSubscription: protectedProcedure
    .mutation(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        include: {
          subscriptions: {
            where: { status: "active" },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      });

      if (!user || !user.subscriptions[0]) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active subscription found",
        });
      }

      try {
        const subscription = await stripe.subscriptions.update(
          user.subscriptions[0].stripeSubscriptionId,
          {
            cancel_at_period_end: true,
          }
        );

        await ctx.db.userSubscription.update({
          where: { id: user.subscriptions[0].id },
          data: {
            cancelAtPeriodEnd: true,
            status: subscription.status,
          },
        });

        return { success: true };
      } catch (error) {
        console.error("Error canceling subscription:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to cancel subscription",
        });
      }
    }),

  // Get subscription plans
  getPlans: protectedProcedure
    .query(async ({ ctx }) => {
      const plans = await ctx.db.subscriptionPlan.findMany({
        where: { isActive: true },
        orderBy: { price: "asc" },
      });

      return plans;
    }),

  // Get usage tracking
  getUsage: protectedProcedure
    .query(async ({ ctx }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setHours(0, 0, 0, 0);

      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const usage = await ctx.db.usageTracking.findMany({
        where: {
          userId: user.id,
          period: "month",
          periodStart: currentMonth,
        },
      });

      const projectCount = await ctx.db.project.count({
        where: {
          members: {
            some: { userId: user.id },
          },
        },
      });

      return {
        projectsUsed: projectCount,
        projectLimit: user.projectLimit,
        usage,
      };
    }),
});