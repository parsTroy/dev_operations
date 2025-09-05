import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify user has access to this project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found or access denied");
      }

      return ctx.db.task.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          assignee: true,
          comments: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Task title is required"),
        description: z.string().optional(),
        projectId: z.string(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
        dueDate: z.date().optional(),
        assignedTo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found or access denied");
      }

      return ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          projectId: input.projectId,
          priority: input.priority,
          dueDate: input.dueDate,
          assignedTo: input.assignedTo,
        },
        include: {
          assignee: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  updateStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this task's project
      const task = await ctx.db.task.findFirst({
        where: {
          id: input.id,
          project: {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      });

      if (!task) {
        throw new Error("Task not found or access denied");
      }

      return ctx.db.task.update({
        where: { id: input.id },
        data: { status: input.status },
        include: {
          assignee: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
        dueDate: z.date().optional(),
        assignedTo: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify user has access to this task's project
      const task = await ctx.db.task.findFirst({
        where: {
          id,
          project: {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
        },
      });

      if (!task) {
        throw new Error("Task not found or access denied");
      }

      return ctx.db.task.update({
        where: { id },
        data: updateData,
        include: {
          assignee: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this task's project
      const task = await ctx.db.task.findFirst({
        where: {
          id: input.id,
          project: {
            members: {
              some: {
                userId: ctx.session.user.id,
                role: "ADMIN", // Only admins can delete tasks
              },
            },
          },
        },
      });

      if (!task) {
        throw new Error("Task not found or access denied");
      }

      return ctx.db.task.delete({
        where: { id: input.id },
      });
    }),
});