import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { pusher } from "~/lib/pusher";

export const tasksRouter = createTRPCRouter({
  getByProject: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.task.findMany({
        where: { projectId: input.projectId },
        include: {
          assignee: true,
          comments: {
            include: {
              user: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    }),

  create: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]).default("MEDIUM"),
      dueDate: z.date().optional(),
      assignedTo: z.string().optional(),
      projectId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Create the task
      const task = await ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          assignedTo: input.assignedTo,
          projectId: input.projectId,
        },
        include: {
          assignee: true,
          project: {
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      // Get project members for notifications
      const projectMembers = task.project.members;
      
      // Send notifications to all project members except the creator
      for (const member of projectMembers) {
        if (member.userId !== ctx.session.user.id) {
          // Create notification
          await ctx.db.notification.create({
            data: {
              userId: member.userId,
              type: "task_created",
              title: "New Task Created",
              message: `${ctx.session.user.name || ctx.session.user.email} created a new task: "${task.title}"`,
              data: {
                taskId: task.id,
                projectId: input.projectId,
                createdBy: ctx.session.user.id,
                createdByName: ctx.session.user.name || ctx.session.user.email,
              },
            },
          });

          // Send real-time notification via Pusher
          try {
            await pusher.trigger(`user-${member.userId}`, "new-notification", {
              type: "task_created",
              title: "New Task Created",
              message: `${ctx.session.user.name || ctx.session.user.email} created a new task: "${task.title}"`,
              data: {
                taskId: task.id,
                projectId: input.projectId,
              },
            });
          } catch (error) {
            console.error("Failed to send Pusher notification:", error);
          }
        }
      }

      // If task is assigned to someone, send them a specific notification
      if (input.assignedTo && input.assignedTo !== ctx.session.user.id) {
        await ctx.db.notification.create({
          data: {
            userId: input.assignedTo,
            type: "task_assigned",
            title: "Task Assigned to You",
            message: `You have been assigned a new task: "${task.title}"`,
            data: {
              taskId: task.id,
              projectId: input.projectId,
              assignedBy: ctx.session.user.id,
              assignedByName: ctx.session.user.name || ctx.session.user.email,
            },
          },
        });

        // Send real-time notification via Pusher
        try {
          await pusher.trigger(`user-${input.assignedTo}`, "new-notification", {
            type: "task_assigned",
            title: "Task Assigned to You",
            message: `You have been assigned a new task: "${task.title}"`,
            data: {
              taskId: task.id,
              projectId: input.projectId,
            },
          });
        } catch (error) {
          console.error("Failed to send Pusher notification:", error);
        }
      }

      return task;
    }),

  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
      priority: z.enum(["LOW", "MEDIUM", "HIGH"]),
      dueDate: z.date().optional(),
      assignedTo: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get the current task to check for changes
      const currentTask = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: {
          project: {
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
          assignee: true,
        },
      });

      if (!currentTask) {
        throw new Error("Task not found");
      }

      // Update the task
      const updatedTask = await ctx.db.task.update({
        where: { id: input.id },
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          assignedTo: input.assignedTo,
        },
        include: {
          assignee: true,
          project: {
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      // Check if assignment changed
      const assignmentChanged = currentTask.assignedTo !== input.assignedTo;
      const wasUnassigned = !currentTask.assignedTo && input.assignedTo;
      const wasReassigned = currentTask.assignedTo && input.assignedTo && currentTask.assignedTo !== input.assignedTo;

      // Send notifications to project members about task update
      for (const member of updatedTask.project.members) {
        if (member.userId !== ctx.session.user.id) {
          await ctx.db.notification.create({
            data: {
              userId: member.userId,
              type: "task_updated",
              title: "Task Updated",
              message: `${ctx.session.user.name || ctx.session.user.email} updated task: "${updatedTask.title}"`,
              data: {
                taskId: updatedTask.id,
                projectId: updatedTask.projectId,
                updatedBy: ctx.session.user.id,
                updatedByName: ctx.session.user.name || ctx.session.user.email,
              },
            },
          });

          // Send real-time notification via Pusher
          try {
            await pusher.trigger(`user-${member.userId}`, "new-notification", {
              type: "task_updated",
              title: "Task Updated",
              message: `${ctx.session.user.name || ctx.session.user.email} updated task: "${updatedTask.title}"`,
              data: {
                taskId: updatedTask.id,
                projectId: updatedTask.projectId,
              },
            });
          } catch (error) {
            console.error("Failed to send Pusher notification:", error);
          }
        }
      }

      // Send specific notification if task was assigned to someone new
      if (assignmentChanged && input.assignedTo && input.assignedTo !== ctx.session.user.id) {
        await ctx.db.notification.create({
          data: {
            userId: input.assignedTo,
            type: wasUnassigned ? "task_assigned" : "task_reassigned",
            title: wasUnassigned ? "Task Assigned to You" : "Task Reassigned to You",
            message: wasUnassigned 
              ? `You have been assigned a new task: "${updatedTask.title}"`
              : `A task has been reassigned to you: "${updatedTask.title}"`,
            data: {
              taskId: updatedTask.id,
              projectId: updatedTask.projectId,
              assignedBy: ctx.session.user.id,
              assignedByName: ctx.session.user.name || ctx.session.user.email,
            },
          },
        });

        // Send real-time notification via Pusher
        try {
          await pusher.trigger(`user-${input.assignedTo}`, "new-notification", {
            type: wasUnassigned ? "task_assigned" : "task_reassigned",
            title: wasUnassigned ? "Task Assigned to You" : "Task Reassigned to You",
            message: wasUnassigned 
              ? `You have been assigned a new task: "${updatedTask.title}"`
              : `A task has been reassigned to you: "${updatedTask.title}"`,
            data: {
              taskId: updatedTask.id,
              projectId: updatedTask.projectId,
            },
          });
        } catch (error) {
          console.error("Failed to send Pusher notification:", error);
        }
      }

      return updatedTask;
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      id: z.string(),
      status: z.enum(["TODO", "IN_PROGRESS", "DONE"]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get the current task to check for status changes
      const currentTask = await ctx.db.task.findUnique({
        where: { id: input.id },
        include: {
          project: {
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
          assignee: true,
        },
      });

      if (!currentTask) {
        throw new Error("Task not found");
      }

      // Update the task status
      const updatedTask = await ctx.db.task.update({
        where: { id: input.id },
        data: { status: input.status },
        include: {
          assignee: true,
          project: {
            include: {
              members: {
                include: {
                  user: true,
                },
              },
            },
          },
        },
      });

      // Only send notifications if status actually changed
      if (currentTask.status !== input.status) {
        const statusLabels = {
          TODO: "To Do",
          IN_PROGRESS: "In Progress", 
          DONE: "Done"
        };

        // Send notifications to project members about status change
        for (const member of updatedTask.project.members) {
          if (member.userId !== ctx.session.user.id) {
            await ctx.db.notification.create({
              data: {
                userId: member.userId,
                type: "task_moved",
                title: "Task Status Changed",
                message: `${ctx.session.user.name || ctx.session.user.email} moved task "${updatedTask.title}" from ${statusLabels[currentTask.status]} to ${statusLabels[input.status]}`,
                data: {
                  taskId: updatedTask.id,
                  projectId: updatedTask.projectId,
                  movedBy: ctx.session.user.id,
                  movedByName: ctx.session.user.name || ctx.session.user.email,
                  fromStatus: currentTask.status,
                  toStatus: input.status,
                },
              },
            });

            // Send real-time notification via Pusher
            try {
              await pusher.trigger(`user-${member.userId}`, "new-notification", {
                type: "task_moved",
                title: "Task Status Changed",
                message: `${ctx.session.user.name || ctx.session.user.email} moved task "${updatedTask.title}" from ${statusLabels[currentTask.status]} to ${statusLabels[input.status]}`,
                data: {
                  taskId: updatedTask.id,
                  projectId: updatedTask.projectId,
                  fromStatus: currentTask.status,
                  toStatus: input.status,
                },
              });
            } catch (error) {
              console.error("Failed to send Pusher notification:", error);
            }
          }
        }

        // Send specific notification to the assignee if they're different from the mover
        if (updatedTask.assignedTo && updatedTask.assignedTo !== ctx.session.user.id) {
          await ctx.db.notification.create({
            data: {
              userId: updatedTask.assignedTo,
              type: "task_moved",
              title: "Your Task Status Changed",
              message: `Your task "${updatedTask.title}" was moved from ${statusLabels[currentTask.status]} to ${statusLabels[input.status]}`,
              data: {
                taskId: updatedTask.id,
                projectId: updatedTask.projectId,
                movedBy: ctx.session.user.id,
                movedByName: ctx.session.user.name || ctx.session.user.email,
                fromStatus: currentTask.status,
                toStatus: input.status,
              },
            },
          });

          // Send real-time notification via Pusher
          try {
            await pusher.trigger(`user-${updatedTask.assignedTo}`, "new-notification", {
              type: "task_moved",
              title: "Your Task Status Changed",
              message: `Your task "${updatedTask.title}" was moved from ${statusLabels[currentTask.status]} to ${statusLabels[input.status]}`,
              data: {
                taskId: updatedTask.id,
                projectId: updatedTask.projectId,
                fromStatus: currentTask.status,
                toStatus: input.status,
              },
            });
          } catch (error) {
            console.error("Failed to send Pusher notification:", error);
          }
        }
      }

      return updatedTask;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.task.delete({
        where: { id: input.id },
      });
    }),
});