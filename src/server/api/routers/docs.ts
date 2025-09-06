import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const docsRouter = createTRPCRouter({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.docPage.findMany({
        where: { projectId: input.projectId },
        orderBy: { updatedAt: "desc" },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string(),
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.docPage.create({
        data: {
          title: input.title,
          content: input.content,
          projectId: input.projectId,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.docPage.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.docPage.delete({
        where: { id: input.id },
      });
    }),
});
