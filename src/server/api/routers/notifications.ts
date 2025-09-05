import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

// In-memory store for demo purposes (in production, use a database)
const notificationStore = new Map<string, Array<{
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}>>();

// Initialize with some demo notifications
if (!notificationStore.has("demo-user")) {
  notificationStore.set("demo-user", [
    {
      id: "1",
      type: "TASK_ASSIGNED",
      title: "New task assigned",
      message: "You have been assigned a new task",
      read: false,
      createdAt: new Date(),
    },
    {
      id: "2", 
      type: "TASK_UPDATED",
      title: "Task updated",
      message: "A task you're working on has been updated",
      read: true,
      createdAt: new Date(Date.now() - 86400000), // 1 day ago
    },
    {
      id: "3",
      type: "MENTION",
      title: "You were mentioned",
      message: "@username mentioned you in a chat message",
      read: false,
      createdAt: new Date(Date.now() - 3600000), // 1 hour ago
    },
  ]);
}

export const notificationsRouter = createTRPCRouter({
  getByUser: protectedProcedure.query(async ({ ctx }) => {
    // Get notifications for the current user
    const userId = ctx.session.user.id;
    const notifications = notificationStore.get(userId) || notificationStore.get("demo-user") || [];
    
    // Sort by creation date (newest first)
    return notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }),

  markAsRead: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const notifications = notificationStore.get(userId) || notificationStore.get("demo-user") || [];
      
      const notification = notifications.find(n => n.id === input.id);
      if (notification) {
        notification.read = true;
        notificationStore.set(userId, notifications);
      }
      
      return { success: true };
    }),

  markAllAsRead: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const notifications = notificationStore.get(userId) || notificationStore.get("demo-user") || [];
    
    // Mark all notifications as read
    notifications.forEach(notification => {
      notification.read = true;
    });
    
    notificationStore.set(userId, notifications);
    return { success: true };
  }),

  addNotification: protectedProcedure
    .input(z.object({
      type: z.string(),
      title: z.string(),
      message: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const notifications = notificationStore.get(userId) || [];
      
      const newNotification = {
        id: Date.now().toString(),
        type: input.type,
        title: input.title,
        message: input.message,
        read: false,
        createdAt: new Date(),
      };
      
      notifications.unshift(newNotification);
      notificationStore.set(userId, notifications);
      
      return newNotification;
    }),
});
