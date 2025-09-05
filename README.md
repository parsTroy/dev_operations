# dev_operations

A collaborative app for developers to manage projects, tasks, and documentation — think GitHub Projects + Trello + Slack (lite).

## Features

### ✅ Phase 1 - Foundations
- [x] T3 stack setup (Next.js, tRPC, Prisma, NextAuth)
- [x] GitHub/Google OAuth authentication
- [x] Basic CRUD for Projects + Tasks
- [x] Dashboard with project listing
- [x] Project creation and management

### ✅ Phase 2 - Collaboration Features
- [x] Project members & role management
- [x] Kanban board for tasks (drag-and-drop ready)
- [x] Task comments system
- [x] Task assignment and priority management

### ✅ Phase 3 - Real-Time & Docs
- [x] Project documentation with Markdown editor
- [x] Collaborative document editing
- [x] Document management system

### ✅ Phase 4 - Polish
- [x] Notifications system
- [x] User profile management
- [x] GitHub integration
- [x] Modern UI with Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: tRPC, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Authentication**: NextAuth.js (GitHub, Google)
- **UI Components**: Radix UI, Lucide React
- **Markdown Editor**: @uiw/react-md-editor
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (or Supabase)
- GitHub OAuth app
- Google OAuth credentials

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd dev_operations
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

Fill in your environment variables:
```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your production environment:

- `DATABASE_URL` - Your production PostgreSQL connection string
- `NEXTAUTH_SECRET` - A secure random string
- `NEXTAUTH_URL` - Your production domain
- `GITHUB_CLIENT_ID` - Your GitHub OAuth app client ID
- `GITHUB_CLIENT_SECRET` - Your GitHub OAuth app client secret
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── projects/          # Project pages
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── docs/             # Documentation components
│   ├── notifications/    # Notification components
│   ├── projects/         # Project components
│   ├── tasks/            # Task components
│   └── ui/               # UI components
├── server/               # Server-side code
│   ├── api/              # tRPC routers
│   └── auth/             # NextAuth configuration
├── types/                # TypeScript types
└── lib/                  # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details