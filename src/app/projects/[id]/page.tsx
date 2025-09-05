import { api } from "~/trpc/server";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { TaskModalProvider } from "~/components/tasks/task-modal-provider";
import { NewTaskButton } from "~/components/tasks/new-task-button";
import { ArrowLeft, Users, Calendar, Tag } from "lucide-react";
import Link from "next/link";

interface ProjectPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/api/auth/signin");
  }

  const { id } = await params;
  const project = await api.projects.getById({ id });
  const tasks = await api.tasks.getByProject({ projectId: id });

  // Group tasks by status
  const tasksByStatus = {
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };

  return (
    <TaskModalProvider projectId={id}>
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Projects
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">dev_operations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session.user.name || session.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Project Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <p className="text-gray-600 mt-2">{project.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{project.members.length} members</span>
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Calendar className="h-4 w-4" />
                  <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <NewTaskButton />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* TODO Column */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">To Do</h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {tasksByStatus.TODO.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.TODO.map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-3 border hover:shadow-sm transition-shadow">
                  <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                  {task.description && (
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {task.assignee.name?.charAt(0) || '?'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* IN_PROGRESS Column */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">In Progress</h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {tasksByStatus.IN_PROGRESS.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.IN_PROGRESS.map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-3 border hover:shadow-sm transition-shadow">
                  <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                  {task.description && (
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {task.assignee.name?.charAt(0) || '?'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DONE Column */}
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Done</h3>
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                {tasksByStatus.DONE.length}
              </span>
            </div>
            <div className="space-y-3">
              {tasksByStatus.DONE.map((task) => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-3 border hover:shadow-sm transition-shadow">
                  <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
                  {task.description && (
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{task.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {task.priority}
                    </span>
                    {task.assignee && (
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {task.assignee.name?.charAt(0) || '?'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      </div>
    </TaskModalProvider>
  );
}