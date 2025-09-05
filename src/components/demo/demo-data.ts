export const demoProjects = [
  {
    id: "demo-1",
    name: "E-commerce Platform",
    description: "Building a modern e-commerce platform with React, Node.js, and PostgreSQL",
    tags: ["React", "Node.js", "PostgreSQL", "Stripe"],
    members: 4,
    tasks: 12,
    updatedAt: new Date("2024-01-15"),
    status: "active"
  },
  {
    id: "demo-2", 
    name: "Mobile App",
    description: "Cross-platform mobile app for task management and team collaboration",
    tags: ["React Native", "TypeScript", "Firebase"],
    members: 3,
    tasks: 8,
    updatedAt: new Date("2024-01-12"),
    status: "active"
  },
  {
    id: "demo-3",
    name: "API Documentation",
    description: "Comprehensive API documentation and developer portal",
    tags: ["Next.js", "OpenAPI", "Tailwind"],
    members: 2,
    tasks: 5,
    updatedAt: new Date("2024-01-10"),
    status: "completed"
  }
];

export const demoTasks = [
  {
    id: "task-1",
    title: "Set up authentication system",
    description: "Implement JWT-based authentication with role-based access control",
    status: "DONE" as const,
    priority: "HIGH" as const,
    assignee: { name: "Sarah Johnson" },
    dueDate: new Date("2024-01-20")
  },
  {
    id: "task-2", 
    title: "Design user dashboard",
    description: "Create responsive dashboard with project overview and task management",
    status: "IN_PROGRESS" as const,
    priority: "MEDIUM" as const,
    assignee: { name: "Mike Chen" },
    dueDate: new Date("2024-01-25")
  },
  {
    id: "task-3",
    title: "Implement real-time notifications",
    description: "Add WebSocket support for live updates and team notifications",
    status: "TODO" as const,
    priority: "HIGH" as const,
    assignee: { name: "Alex Rodriguez" },
    dueDate: new Date("2024-01-30")
  },
  {
    id: "task-4",
    title: "Write API documentation",
    description: "Document all endpoints with examples and response schemas",
    status: "TODO" as const,
    priority: "LOW" as const,
    assignee: { name: "Emma Wilson" },
    dueDate: new Date("2024-02-05")
  }
];

export const demoMessages = [
  {
    id: "msg-1",
    content: "Hey team! I've finished the authentication setup. Ready for review 🚀",
    user: { name: "Sarah Johnson" },
    createdAt: new Date("2024-01-15T10:30:00"),
    userId: "user-1"
  },
  {
    id: "msg-2", 
    content: "Great work @Sarah! I'll take a look at it this afternoon",
    user: { name: "Mike Chen" },
    createdAt: new Date("2024-01-15T10:35:00"),
    userId: "user-2"
  },
  {
    id: "msg-3",
    content: "The dashboard design is coming along nicely. Should have mockups ready by tomorrow",
    user: { name: "Mike Chen" },
    createdAt: new Date("2024-01-15T14:20:00"),
    userId: "user-2"
  },
  {
    id: "msg-4",
    content: "Perfect! @Mike let me know if you need any feedback on the designs",
    user: { name: "Alex Rodriguez" },
    createdAt: new Date("2024-01-15T14:25:00"),
    userId: "user-3"
  }
];

export const demoTeamMembers = [
  {
    id: "member-1",
    user: { name: "Sarah Johnson", email: "sarah@company.com" },
    role: "ADMIN" as const
  },
  {
    id: "member-2", 
    user: { name: "Mike Chen", email: "mike@company.com" },
    role: "MEMBER" as const
  },
  {
    id: "member-3",
    user: { name: "Alex Rodriguez", email: "alex@company.com" },
    role: "MEMBER" as const
  },
  {
    id: "member-4",
    user: { name: "Emma Wilson", email: "emma@company.com" },
    role: "VIEWER" as const
  }
];
