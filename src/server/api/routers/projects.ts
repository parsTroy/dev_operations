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

  inviteMember: protectedProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        role: z.enum(["MEMBER", "VIEWER"]),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has admin access to this project
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
        throw new Error("Project not found or access denied");
      }

      // Find or create user by email
      let user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });

      if (!user) {
        // Create user if they don't exist
        user = await ctx.db.user.create({
          data: {
            email: input.email,
            name: input.email.split("@")[0], // Use email prefix as name
          },
        });
      }

      // Check if user is already a member
      const existingMember = await ctx.db.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId: input.projectId,
          },
        },
      });

      if (existingMember) {
        throw new Error("User is already a member of this project");
      }

      // Add user to project
      return ctx.db.projectMember.create({
        data: {
          userId: user.id,
          projectId: input.projectId,
          role: input.role,
        },
        include: {
          user: true,
        },
      });
    }),

  removeMember: protectedProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Verify user has admin access to this project
      const member = await ctx.db.projectMember.findFirst({
        where: {
          id: input.memberId,
          project: {
            members: {
              some: {
                userId: ctx.session.user.id,
                role: "ADMIN",
              },
            },
          },
        },
      });

      if (!member) {
        throw new Error("Member not found or access denied");
      }

      return ctx.db.projectMember.delete({
        where: { id: input.memberId },
      });
    }),

  updateMemberRole: protectedProcedure
    .input(
      z.object({
        memberId: z.string(),
        role: z.enum(["ADMIN", "MEMBER", "VIEWER"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has admin access to this project
      const member = await ctx.db.projectMember.findFirst({
        where: {
          id: input.memberId,
          project: {
            members: {
              some: {
                userId: ctx.session.user.id,
                role: "ADMIN",
              },
            },
          },
        },
      });

      if (!member) {
        throw new Error("Member not found or access denied");
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