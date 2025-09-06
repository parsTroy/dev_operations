import { db } from "~/server/db";

// Query optimization utilities
export const dbOptimizations = {
  // Optimized project queries with selective fields
  getProjectsOptimized: async (userId: string) => {
    return db.project.findMany({
      where: {
        members: {
          some: { userId }
        }
      },
      select: {
        id: true,
        name: true,
        description: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            members: true,
            tasks: true,
          }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 20, // Limit results
    });
  },

  // Optimized task queries
  getTasksOptimized: async (projectId: string) => {
    return db.task.findMany({
      where: { projectId },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        assignedTo: true,
        assignee: {
          select: {
            id: true,
            name: true,
            image: true,
          }
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  // Batch operations for better performance
  batchUpdateTasks: async (updates: Array<{ id: string; data: any }>) => {
    const promises = updates.map(({ id, data }) =>
      db.task.update({
        where: { id },
        data,
      })
    );
    return Promise.all(promises);
  },
};
