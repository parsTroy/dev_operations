import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { pusher } from "~/lib/pusher";

export const chatRouter = createTRPCRouter({
  getMessages: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const messages = await ctx.db.chatMessage.findMany({
        where: { projectId: input.projectId },
        include: { user: true, mentions: { include: { user: true } } },
        orderBy: { createdAt: "asc" },
      });
      return messages;
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        content: z.string().min(1),
        projectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Parse mentions from content
      const mentionMatches = input.content.match(/@(\w+)/g);
      const mentions = mentionMatches ?? [];

      // Get mentioned users
      const mentionedUsers = await ctx.db.user.findMany({
        where: {
          name: {
            in: mentions.map((m) => m.slice(1)), // Remove @ symbol
          },
        },
      });

      // Create message
      const message = await ctx.db.chatMessage.create({
        data: {
          content: input.content,
          projectId: input.projectId,
          userId: ctx.session.user.id,
          mentions: mentions.map((m) => m.slice(1)), // Store without @ symbol
        },
        include: { user: true, mentions: { include: { user: true } } },
      });

      // Create mention records
      if (mentionedUsers.length > 0) {
        await ctx.db.mention.createMany({
          data: mentionedUsers.map((user) => ({
            messageId: message.id,
            userId: user.id,
          })),
        });
      }

      // Trigger real-time update
      await pusher.trigger(`project-${input.projectId}`, "new-message", {
        message,
      });

      return message;
    }),

  getProjectMembers: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      const members = await ctx.db.projectMember.findMany({
        where: { projectId: input.projectId },
        include: { user: true },
      });
      return members;
    }),
});
