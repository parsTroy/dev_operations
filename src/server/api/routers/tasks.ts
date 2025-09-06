import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.task.findMany({
        where: { projectId: input.projectId },
        include: {
          assignee: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
      dueDate: z.date().optional(),
      assignedTo: z.string().optional(),
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          assignedTo: input.assignedTo,
          projectId: input.projectId,
        },
        include: {
          assignee: true,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
      dueDate: z.date().optional(),
      assignedTo: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          assignedTo: input.assignedTo,
        },
        include: {
          assignee: true,
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.update({
        where: { id: input.id },
        data: { status: input.status },
        include: {
          assignee: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.delete({
        where: { id: input.id },
      });
    }),
});