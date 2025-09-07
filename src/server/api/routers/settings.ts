import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const settingsRouter = createTRPCRouter({
  // Get user settings
  getSettings: protectedProcedure.query(async ({ ctx }) => {
    let settings = await ctx.db.userSettings.findUnique({
      where: { userId: ctx.session.user.id },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await ctx.db.userSettings.create({
        data: {
          userId: ctx.session.user.id,
        },
      });
    }

    return settings;
  }),

  // Update user settings
  updateSettings: protectedProcedure
    .input(
      z.object({
        profileVisibility: z.enum(["team", "public", "private"]).optional(),
        showActivityStatus: z.boolean().optional(),
        emailNotifications: z.boolean().optional(),
        pushNotifications: z.boolean().optional(),
        taskAssignmentAlerts: z.boolean().optional(),
        mentionAlerts: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const settings = await ctx.db.userSettings.upsert({
        where: { userId: ctx.session.user.id },
        create: {
          userId: ctx.session.user.id,
          ...input,
        },
        update: input,
      });

      return settings;
    }),


  // Export user data
  exportData: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        projects: {
          include: {
            project: {
              include: {
                tasks: true,
                docs: true,
                chatMessages: {
                  include: {
                    user: true,
                  },
                },
              },
            },
          },
        },
        tasks: {
          include: {
            project: true,
            comments: true,
          },
        },
        comments: true,
        chatMessages: {
          include: {
            project: true,
            mentions: true,
          },
        },
        settings: true,
        subscriptions: {
          include: {
            subscriptionPlan: true,
          },
        },
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    // Remove sensitive data
    const exportData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        subscriptionTier: user.subscriptionTier,
      },
      projects: user.projects.map((pm) => ({
        id: pm.project.id,
        name: pm.project.name,
        description: pm.project.description,
        role: pm.role,
        joinedAt: pm.project.createdAt,
        tasks: pm.project.tasks.length,
        docs: pm.project.docs.length,
        messages: pm.project.chatMessages.length,
      })),
      tasks: user.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        projectName: task.project.name,
        createdAt: task.createdAt,
        comments: task.comments.length,
      })),
      settings: user.settings,
      subscriptions: user.subscriptions.map((sub) => ({
        plan: sub.subscriptionPlan.name,
        status: sub.status,
        currentPeriodStart: sub.currentPeriodStart,
        currentPeriodEnd: sub.currentPeriodEnd,
      })),
      exportDate: new Date().toISOString(),
    };

    return exportData;
  }),

  // Delete user account
  deleteAccount: protectedProcedure
    .input(z.object({ confirmation: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (input.confirmation !== "DELETE") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Confirmation text must be 'DELETE'",
        });
      }

      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      // Delete user (cascade will handle related records)
      await ctx.db.user.delete({
        where: { id: ctx.session.user.id },
      });

      return { success: true };
    }),
});
