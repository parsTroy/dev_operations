import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

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
        _count: {
          select: {
            members: true,
            tasks: true,
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
      // Check project limit
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
        select: { 
          subscriptionTier: true, 
          projectLimit: true,
          _count: { 
            select: { 
              projects: true 
            } 
          }
        }
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check if user has reached their project limit
      if (user._count.projects >= user.projectLimit) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `You have reached your project limit of ${user.projectLimit}. Upgrade your plan to create more projects.`,
        });
      }

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
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1),
        description: z.string(),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin of the project
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
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update this project",
        });
      }

      return ctx.db.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          tags: input.tags,
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin of the project
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
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to delete this project",
        });
      }

      return ctx.db.project.delete({
        where: { id: input.id },
      });
    }),

  inviteMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        email: z.string().email(),
        role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin of the project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          members: {
            some: {
              userId: ctx.session.user.id,
              role: "ADMIN",
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to invite members to this project",
        });
      }

      // Find user by email
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found with this email",
        });
      }

      // Check if user is already a member
      const existingMember = await ctx.db.projectMember.findFirst({
        where: {
          projectId: input.projectId,
          userId: user.id,
        },
      });

      if (existingMember) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already a member of this project",
        });
      }

      return ctx.db.projectMember.create({
        data: {
          projectId: input.projectId,
          userId: user.id,
          role: input.role,
        },
        include: {
          user: true,
        },
      });
    }),

  removeMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        memberId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin of the project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          members: {
            some: {
              userId: ctx.session.user.id,
              role: "ADMIN",
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to remove members from this project",
        });
      }

      return ctx.db.projectMember.delete({
        where: { id: input.memberId },
      });
    }),

  updateMemberRole: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        memberId: z.string(),
        role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin of the project
      const project = await ctx.db.project.findFirst({
        where: {
          id: input.projectId,
          members: {
            some: {
              userId: ctx.session.user.id,
              role: "ADMIN",
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You don't have permission to update member roles in this project",
        });
      }

      return ctx.db.projectMember.update({
        where: { id: input.memberId },
        data: { role: input.role },
        include: {
          user: true,
        },
      });
    }),
});