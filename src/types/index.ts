export type Role = "ADMIN" | "MEMBER" | "VIEWER"
export type Status = "TODO" | "IN_PROGRESS" | "DONE"
export type Priority = "LOW" | "MEDIUM" | "HIGH"

export interface Project {
  id: string
  name: string
  description: string
  tags: string[]
  members: ProjectMember[]
  tasks: Task[]
  docs: DocPage[]
  createdAt: Date
  updatedAt: Date
}

export interface ProjectMember {
  id: string
  role: Role
  userId: string
  projectId: string
  user: User
}

export interface Task {
  id: string
  title: string
  description: string | null
  status: Status
  priority: Priority
  dueDate: Date | null
  projectId: string
  assignedTo: string | null
  assignee: User | null
  comments: Comment[]
  createdAt: Date
  updatedAt: Date
}

export interface Comment {
  id: string
  content: string
  taskId: string
  userId: string
  user: User
  createdAt: Date
}

export interface DocPage {
  id: string
  title: string
  content: string
  projectId: string
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  name: string | null
  email: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}