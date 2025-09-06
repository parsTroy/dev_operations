import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const projectsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.project.findMany({
      where: {
        members: {
          some: {
            userId: ctx.session.user.id,
          },
        },
      },
      include: {
        _count: {
          select: {
            tasks: true,
            members: true,
          },
        },
        members: {
          include: {
            user: true,
          },
        },
        // Include actual tasks data for dashboard
        tasks: {
          include: {
            assignee: true,
          },
          orderBy: { updatedAt: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.project.findFirst({
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
            orderBy: { createdAt: "desc" },
          },
          docs: {
            orderBy: { updatedAt: "desc" },
          },
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string(),
      tags: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          description: input.description,
          tags: input.tags,
        },
      });

      // Add the creator as an admin member
      await ctx.db.projectMember.create({
        data: {
          projectId: project.id,
          userId: ctx.session.user.id,
          role: "ADMIN",
        },
      });

      return project;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      name: z.string().min(1),
      description: z.string(),
      tags: z.array(z.string()),
    }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          tags: input.tags,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.project.delete({
        where: { id: input.id },
      });
    }),

  inviteMember: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        email: z.string().email(),
        role: z.enum(["MEMBER", "VIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user is admin of the project
      const membership = await ctx.db.projectMember.findFirst({
        where: {
          projectId: input.projectId,
          userId: ctx.session.user.id,
          role: "ADMIN",
        },
      });

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only project admins can invite members",
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
      const existingMembership = await ctx.db.projectMember.findFirst({
        where: {
          projectId: input.projectId,
          userId: user.id,
        },
      });

      if (existingMembership) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already a member of this project",
        });
      }

      const projectMember = await ctx.db.projectMember.create({
        data: {
          projectId: input.projectId,
          userId: user.id,
          role: input.role,
        },
        include: { user: true },
      });

      return projectMember;
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
      const membership = await ctx.db.projectMember.findFirst({
        where: {
          projectId: input.projectId,
          userId: ctx.session.user.id,
          role: "ADMIN",
        },
      });

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only project admins can remove members",
        });
      }

      await ctx.db.projectMember.delete({
        where: {
          id: input.memberId,
        },
      });

      return { success: true };
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
      const membership = await ctx.db.projectMember.findFirst({
        where: {
          projectId: input.projectId,
          userId: ctx.session.user.id,
          role: "ADMIN",
        },
      });

      if (!membership) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only project admins can update member roles",
        });
      }

      const projectMember = await ctx.db.projectMember.update({
        where: { id: input.memberId },
        data: { role: input.role },
        include: { user: true },
      });

      return projectMember;
    }),
});