import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

// In-memory store for notifications (in production, use Redis or database)
interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  data: Record<string, unknown>;
  isRead: boolean;
  createdAt: number;
}

const notifications = new Map<string, Notification[]>();

export const notificationsRouter = createTRPCRouter({
  getByUser: protectedProcedure.query(async ({ ctx }) => {
    const userNotifications = notifications.get(ctx.session.user.id) ?? [];
    return userNotifications.sort((a, b) => b.createdAt - a.createdAt);
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userNotifications = notifications.get(ctx.session.user.id) ?? [];
      const notification = userNotifications.find((n) => n.id === input.id);
      if (notification) {
        notification.isRead = true;
        notifications.set(ctx.session.user.id, userNotifications);
      }
      return { success: true };
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const userNotifications = notifications.get(ctx.session.user.id) ?? [];
    userNotifications.forEach((notification) => {
      notification.isRead = true;
    });
    notifications.set(ctx.session.user.id, userNotifications);
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
    .mutation(async ({ input }) => {
      const userNotifications = notifications.get(input.userId) ?? [];
      const notification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type: input.type,
        title: input.title,
        message: input.message,
        data: input.data ?? {},
        isRead: false,
        createdAt: Date.now(),
      };
      userNotifications.push(notification);
      notifications.set(input.userId, userNotifications);
      return notification;
    }),
});
