import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusher } from "~/lib/pusher";

export const notificationsRouter = createTRPCRouter({
  getByUser: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.notification.findMany({
      where: { userId: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.notification.update({
        where: { id: input.id },
        data: { isRead: true },
      });
      return { success: true };
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db.notification.updateMany({
      where: { 
        userId: ctx.session.user.id,
        isRead: false 
      },
      data: { isRead: true },
    });
    return { success: true };
  }),

  addNotification: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.string(),
        title: z.string(),
        message: z.string(),
        data: z.record(z.any()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const notification = await ctx.db.notification.create({
        data: {
          userId: input.userId,
          type: input.type,
          title: input.title,
          message: input.message,
          data: input.data ?? {},
          isRead: false,
        },
      });

      // Send real-time notification via Pusher
      try {
        await pusher.trigger(`user-${input.userId}`, "new-notification", {
          notification,
        });
      } catch (error) {
        console.error("Failed to send Pusher notification:", error);
      }

      return notification;
    }),
});
