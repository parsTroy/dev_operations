import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const analyticsRouter = createTRPCRouter({
  getProjectStats: protectedProcedure
    .input(z.object({
      timeRange: z.enum(["7d", "30d", "90d"]).default("30d"),
    }))
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const daysAgo = input.timeRange === "7d" ? 7 : input.timeRange === "30d" ? 30 : 90;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      const projects = await ctx.db.project.findMany({
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
          tasks: {
            select: {
              status: true,
              createdAt: true,
            },
          },
        },
      });

      const totalProjects = projects.length;
      const totalTasks = projects.reduce((acc, project) => acc + project._count.tasks, 0);
      const completedTasks = projects.reduce((acc, project) => 
        acc + project.tasks.filter(task => task.status === 'DONE').length, 0
      );
      const totalMembers = projects.reduce((acc, project) => acc + project._count.members, 0);
      
      const activeProjects = projects.filter(project => 
        new Date(project.updatedAt) > startDate
      ).length;

      const completionRate = totalTasks > 0 ? 
        Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        totalProjects,
        totalTasks,
        completedTasks,
        totalMembers,
        activeProjects,
        completionRate,
        projects: projects.slice(0, 5), // Recent projects for activity feed
      };
    }),

  getTaskTrends: protectedProcedure
    .input(z.object({
      timeRange: z.enum(["7d", "30d", "90d"]).default("30d"),
    }))
    .query(async ({ ctx, input }) => {
      const now = new Date();
      const daysAgo = input.timeRange === "7d" ? 7 : input.timeRange === "30d" ? 30 : 90;
      const startDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

      // Get tasks created in the time range
      const tasks = await ctx.db.task.findMany({
        where: {
          project: {
            members: {
              some: {
                userId: ctx.session.user.id,
              },
            },
          },
          createdAt: {
            gte: startDate,
          },
        },
        select: {
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      // Group by day
      const tasksByDay = tasks.reduce((acc, task) => {
        const day = task.createdAt.toISOString().split('T')[0];
        if (!acc[day]) {
          acc[day] = { created: 0, completed: 0 };
        }
        acc[day].created++;
        if (task.status === 'DONE') {
          acc[day].completed++;
        }
        return acc;
      }, {} as Record<string, { created: number; completed: number }>);

      return {
        tasksByDay,
        totalCreated: tasks.length,
        totalCompleted: tasks.filter(task => task.status === 'DONE').length,
      };
    }),
});
