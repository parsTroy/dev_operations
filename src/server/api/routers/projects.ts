import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const projectsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.project.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        members: {
          include: {
            user: true,
          },
        },
        tasks: true,
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Project name is required"),
        description: z.string().min(1, "Project description is required"),
        tags: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          tags: input.tags,
          members: {
            create: {
              userId: ctx.session.user.id,
              role: "ADMIN",
            },
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
      });
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.id,
          members: {
            some: {
              userId: ctx.session.user.id,
            },
          },
        },
        include: {
          members: {
            include: {
              user: true,
            },
          },
          tasks: {
            include: {
              assignee: true,
              comments: {
                include: {
                  user: true,
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
          docs: {
            orderBy: {
              updatedAt: "desc",
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found or access denied");
      }

      return project;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().min(1).optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      // Verify user has admin access to this project
      const project = await ctx.db.project.findFirst({
        where: {
          id,
          members: {
            some: {
              userId: ctx.session.user.id,
              role: "ADMIN",
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found or access denied");
      }

      return ctx.db.project.update({
        where: { id },
        data: updateData,
        include: {
          members: {
            include: {
              user: true,
            },
          },
          _count: {
            select: {
              tasks: true,
              members: true,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user has admin access to this project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.id,
          members: {
            some: {
              userId: ctx.session.user.id,
              role: "ADMIN",
            },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found or access denied");
      }

      return ctx.db.project.delete({
        where: { id: input.id },
      });
    }),
});