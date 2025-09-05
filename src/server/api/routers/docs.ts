import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";

export const docsRouter = createTRPCRouter({
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

      return ctx.db.docPage.findMany({
        where: {
          projectId: input.projectId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const doc = await ctx.db.docPage.findFirst({
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
        include: {
          project: true,
        },
      });

      if (!doc) {
        throw new Error("Document not found or access denied");
      }

      return doc;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, "Document title is required"),
        content: z.string().default(""),
        projectId: z.string(),
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

      return ctx.db.docPage.create({
        data: {
          title: input.title,
          content: input.content,
          projectId: input.projectId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        content: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify user has access to this document's project
      const doc = await ctx.db.docPage.findFirst({
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

      if (!doc) {
        throw new Error("Document not found or access denied");
      }

      return ctx.db.docPage.update({
        where: { id },
        data: updateData,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to this document's project
      const doc = await ctx.db.docPage.findFirst({
        where: {
          id: input.id,
          project: {
            members: {
              some: {
                userId: ctx.session.user.id,
                role: "ADMIN", // Only admins can delete documents
              },
            },
          },
        },
      });

      if (!doc) {
        throw new Error("Document not found or access denied");
      }

      return ctx.db.docPage.delete({
        where: { id: input.id },
      });
    }),
});
