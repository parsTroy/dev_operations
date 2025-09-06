import { createTRPCRouter } from "~/server/api/trpc";
import { projectsRouter } from "~/server/api/routers/projects";
import { tasksRouter } from "~/server/api/routers/tasks";
import { commentsRouter } from "~/server/api/routers/comments";
import { docsRouter } from "~/server/api/routers/docs";
import { notificationsRouter } from "~/server/api/routers/notifications";
import { chatRouter } from "~/server/api/routers/chat";
import { subscriptionsRouter } from "~/server/api/routers/subscriptions";

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
  notifications: notificationsRouter,
  chat: chatRouter,
  subscriptions: subscriptionsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;