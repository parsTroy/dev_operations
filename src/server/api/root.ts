import { createTRPCRouter } from "~/server/api/trpc";
import { projectsRouter } from "~/server/api/routers/projects";
import { tasksRouter } from "~/server/api/routers/tasks";
import { commentsRouter } from "~/server/api/routers/comments";
import { docsRouter } from "~/server/api/routers/docs";
import { chatRouter } from "~/server/api/routers/chat";
import { notificationsRouter } from "~/server/api/routers/notifications";
import { subscriptionsRouter } from "~/server/api/routers/subscriptions";
import { analyticsRouter } from "~/server/api/routers/analytics";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  tasks: tasksRouter,
  comments: commentsRouter,
  docs: docsRouter,
  chat: chatRouter,
  notifications: notificationsRouter,
  subscriptions: subscriptionsRouter,
  analytics: analyticsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;