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

      // Create message without mentions first
      const message = await ctx.db.chatMessage.create({
        data: {
          content: input.content,
          projectId: input.projectId,
          userId: ctx.session.user.id,
        },
        include: { user: true, mentions: { include: { user: true } } },
      });

      // Create mention records if there are mentioned users
      if (mentionedUsers.length > 0) {
        await ctx.db.mention.createMany({
          data: mentionedUsers.map((user) => ({
            messageId: message.id,
            userId: user.id,
          })),
        });

        // Fetch the message again with mentions
        const messageWithMentions = await ctx.db.chatMessage.findUnique({
          where: { id: message.id },
          include: { user: true, mentions: { include: { user: true } } },
        });

        // Get project members for notifications
        const projectMembers = await ctx.db.projectMember.findMany({
          where: { projectId: input.projectId },
          include: { user: true },
        });

        // Send notifications to mentioned users
        for (const mentionedUser of mentionedUsers) {
          await ctx.db.notification.create({
            data: {
              userId: mentionedUser.id,
              type: "chat_mention",
              title: "You were mentioned in chat",
              message: `${ctx.session.user.name || ctx.session.user.email} mentioned you in a chat message`,
              data: {
                messageId: message.id,
                projectId: input.projectId,
                mentionedBy: ctx.session.user.id,
                mentionedByName: ctx.session.user.name || ctx.session.user.email,
                messageContent: input.content,
              },
            },
          });

          // Send real-time notification via Pusher
          try {
            await pusher.trigger(`user-${mentionedUser.id}`, "new-notification", {
              type: "chat_mention",
              title: "You were mentioned in chat",
              message: `${ctx.session.user.name || ctx.session.user.email} mentioned you in a chat message`,
              data: {
                messageId: message.id,
                projectId: input.projectId,
              },
            });
          } catch (error) {
            console.error("Failed to send Pusher notification:", error);
          }
        }

        // Send general chat notifications to other project members (not the sender or mentioned users)
        const mentionedUserIds = mentionedUsers.map(u => u.id);
        for (const member of projectMembers) {
          if (member.userId !== ctx.session.user.id && !mentionedUserIds.includes(member.userId)) {
            await ctx.db.notification.create({
              data: {
                userId: member.userId,
                type: "chat_message",
                title: "New chat message",
                message: `${ctx.session.user.name || ctx.session.user.email} sent a message in project chat`,
                data: {
                  messageId: message.id,
                  projectId: input.projectId,
                  sentBy: ctx.session.user.id,
                  sentByName: ctx.session.user.name || ctx.session.user.email,
                  messageContent: input.content,
                },
              },
            });

            // Send real-time notification via Pusher
            try {
              await pusher.trigger(`user-${member.userId}`, "new-notification", {
                type: "chat_message",
                title: "New chat message",
                message: `${ctx.session.user.name || ctx.session.user.email} sent a message in project chat`,
                data: {
                  messageId: message.id,
                  projectId: input.projectId,
                },
              });
            } catch (error) {
              console.error("Failed to send Pusher notification:", error);
            }
          }
        }

        // Trigger real-time update with mentions
        await pusher.trigger(`project-${input.projectId}`, "new-message", {
          message: messageWithMentions,
          userId: ctx.session.user.id,
        });

        return messageWithMentions;
      }

      // Get project members for notifications
      const projectMembers = await ctx.db.projectMember.findMany({
        where: { projectId: input.projectId },
        include: { user: true },
      });

      // Send general chat notifications to other project members (not the sender)
      for (const member of projectMembers) {
        if (member.userId !== ctx.session.user.id) {
          await ctx.db.notification.create({
            data: {
              userId: member.userId,
              type: "chat_message",
              title: "New chat message",
              message: `${ctx.session.user.name || ctx.session.user.email} sent a message in project chat`,
              data: {
                messageId: message.id,
                projectId: input.projectId,
                sentBy: ctx.session.user.id,
                sentByName: ctx.session.user.name || ctx.session.user.email,
                messageContent: input.content,
              },
            },
          });

          // Send real-time notification via Pusher
          try {
            await pusher.trigger(`user-${member.userId}`, "new-notification", {
              type: "chat_message",
              title: "New chat message",
              message: `${ctx.session.user.name || ctx.session.user.email} sent a message in project chat`,
              data: {
                messageId: message.id,
                projectId: input.projectId,
              },
            });
          } catch (error) {
            console.error("Failed to send Pusher notification:", error);
          }
        }
      }

      // Trigger real-time update
      await pusher.trigger(`project-${input.projectId}`, "new-message", {
        message,
        userId: ctx.session.user.id,
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
