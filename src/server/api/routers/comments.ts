import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const commentsRouter = createTRPCRouter({
  getByTask: protectedProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      // Verify user has access to this task's project
      const task = await ctx.db.task.findFirst({
        where: {
          id: input.taskId,
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

      return ctx.db.comment.findMany({
        where: {
          taskId: input.taskId,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      });
    }),

  create: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1, "Comment content is required"),
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this task's project
      const task = await ctx.db.task.findFirst({
        where: {
          id: input.taskId,
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

      return ctx.db.comment.create({
        data: {
          content: input.content,
          taskId: input.taskId,
          userId: ctx.session.user.id,
        },
        include: {
          user: true,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1, "Comment content is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user owns this comment
      const comment = await ctx.db.comment.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!comment) {
        throw new Error("Comment not found or access denied");
      }

      return ctx.db.comment.update({
        where: { id: input.id },
        data: { content: input.content },
        include: {
          user: true,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user owns this comment
      const comment = await ctx.db.comment.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });

      if (!comment) {
        throw new Error("Comment not found or access denied");
      }

      return ctx.db.comment.delete({
        where: { id: input.id },
      });
    }),
});
