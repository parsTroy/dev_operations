import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { pusher } from "~/lib/pusher";

export const chatRouter = createTRPCRouter({
  getMessages: protectedProcedure
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

      return ctx.db.chatMessage.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          user: true,
          mentions: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
        take: 50, // Limit to last 50 messages
      });
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1, "Message content is required"),
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

      // Extract mentions from content (e.g., @username)
      const mentionRegex = /@(\w+)/g;
      const mentions = [];
      let match;
      while ((match = mentionRegex.exec(input.content)) !== null) {
        mentions.push(match[1]);
      }

      // Find mentioned users
      const mentionedUsers = await ctx.db.user.findMany({
        where: {
          name: {
            in: mentions,
          },
        },
      });

      // Create the message
      const message = await ctx.db.chatMessage.create({
        data: {
          content: input.content,
          projectId: input.projectId,
          userId: ctx.session.user.id,
          mentions: {
            create: mentionedUsers.map((user) => ({
              userId: user.id,
            })),
          },
        },
        include: {
          user: true,
          mentions: {
            include: {
              user: true,
            },
          },
        },
      });

      // Trigger real-time update
      await pusher.trigger(`project-${input.projectId}`, "new-message", {
        message,
      });

      return message;
    }),

  getProjectMembers: protectedProcedure
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

      return ctx.db.projectMember.findMany({
        where: {
          projectId: input.projectId,
        },
        include: {
          user: true,
        },
      });
    }),
});
