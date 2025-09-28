# dev_operations

**A modern developer collaboration platform** that combines project management, team collaboration, and real-time communication in one powerful tool. Built with the T3 Stack and designed for development teams who want to streamline their workflow.

![dev_operations](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Prisma](https://img.shields.io/badge/Prisma-5.0+-2D3748)

## Features

### **Core Functionality**
- **Project Management** - Create, organize, and track development projects
- **Task Management** - Drag-and-drop Kanban boards with priority levels and due dates
- **Team Collaboration** - Role-based access control (Admin, Member, Viewer)
- **Real-time Chat** - Project-specific chat channels with @mentions
- **Documentation** - Markdown-powered project wikis with collaborative editing
- **Notifications** - Real-time notifications for tasks, mentions, and updates

### **Advanced Features**
- **Real-time Updates** - Live updates across all team members using WebSockets
- **GitHub Integration** - Seamless authentication and project linking
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI/UX** - Beautiful, intuitive interface with smooth animations
- **Interactive Demo** - Try the platform without signing up

## Technology Stack

### **Frontend**
- **[Next.js 15.5.2](https://nextjs.org)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first styling
- **[shadcn/ui](https://ui.shadcn.com)** - Beautiful, accessible components
- **[Lucide React](https://lucide.dev)** - Modern icon library

### **Backend**
- **[tRPC](https://trpc.io)** - End-to-end type-safe APIs
- **[Prisma](https://prisma.io)** - Next-generation ORM
- **[NextAuth.js](https://next-auth.js.org)** - Authentication system
- **[PostgreSQL](https://postgresql.org)** - Robust database (via Supabase)

### **Real-time & Communication**
- **[Pusher](https://pusher.com)** - WebSocket service for real-time features
- **WebSocket Integration** - Live chat and notifications
- **@mentions System** - Tag team members in conversations

### **Development Tools**
- **[ESLint](https://eslint.org)** - Code linting
- **[Prettier](https://prettier.io)** - Code formatting
- **[Husky](https://typicode.github.io/husky)** - Git hooks
- **[TypeScript](https://www.typescriptlang.org)** - Static type checking

## Demo

Try the interactive demo at `/demo` to explore features without signing up:
- **Project Overview** - See how projects are organized
- **Task Management** - Experience the drag-and-drop Kanban board
- **Team Collaboration** - View role-based access control
- **Real-time Chat** - See how team communication works

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (auth)/            # Authentication pages
│   ├── projects/          # Project management pages
│   ├── landing/           # Landing page
│   └── demo/              # Interactive demo
├── components/            # Reusable UI components
│   ├── auth/              # Authentication components
│   ├── chat/              # Real-time chat components
│   ├── docs/              # Documentation components
│   ├── landing/           # Landing page components
│   ├── notifications/     # Notification system
│   ├── projects/          # Project management components
│   ├── tasks/             # Task management components
│   └── team/              # Team collaboration components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries
├── server/                # Backend API routes
│   ├── api/               # tRPC routers
│   └── auth/              # NextAuth configuration
└── styles/                # Global styles
```

## Key Features in Detail

### **Project Management**
- Create and organize development projects
- Add descriptions, tags, and team members
- Track project progress and deadlines
- Role-based permissions (Admin, Member, Viewer)

### **Task Management**
- Drag-and-drop Kanban boards
- Priority levels (High, Medium, Low)
- Due dates and assignments
- Real-time status updates

### **Team Collaboration**
- Invite team members via email
- Role-based access control
- Project-specific permissions
- Member management and removal

### **Real-time Communication**
- Project-specific chat channels
- @mentions for team members
- Live message updates
- Notification system

### **Documentation**
- Markdown-powered project wikis
- Collaborative editing
- Version history
- Rich text formatting

## Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### **Other Platforms**
- **Netlify** - Static site hosting
- **Railway** - Full-stack deployment
- **Docker** - Containerized deployment

## Acknowledgments

- [T3 Stack](https://create.t3.gg/) for the amazing starter template
- [shadcn/ui](https://ui.shadcn.com) for beautiful components
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
- [Pusher](https://pusher.com) for real-time features

## Contact

- **Portfolio** - [View Portfolio](https://troyparsons.ca)
- **LinkedIn** - [Connect on LinkedIn](https://linkedin.com/in/troyalparsons/)
- **Email** - your.email@example.com

---

**Built by Troy Parsons**

*Ready to streamline your development workflow? [View the live demo!](https://devoperations.ca)*