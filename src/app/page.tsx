"use client";

import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { NewProjectForm } from "~/components/projects/new-project-form";
import { ProjectModalProvider } from "~/components/projects/project-modal-provider";
import { NewProjectButton } from "~/components/projects/new-project-button";
import { EditProjectModal } from "~/components/projects/edit-project-modal";
import { NotificationsDropdown } from "~/components/notifications/notifications-dropdown";
import { UserProfile } from "~/components/profile/user-profile";
import { AuthRedirect } from "~/components/auth/auth-redirect";
import { PerformanceMonitor } from "~/components/performance/performance-monitor";
import { ArrowLeft, Users, CheckSquare, FileText, Edit, MoreVertical, BarChart3, Calendar, AlertTriangle, Clock, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, Suspense } from "react";
import { api } from "~/trpc/react";

// Loading skeleton component
function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-full"></div>
          <div className="flex gap-1 mb-4">
            <div className="h-6 bg-gray-200 rounded-full w-16"></div>
            <div className="h-6 bg-gray-200 rounded-full w-20"></div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="h-4 bg-gray-200 rounded w-8"></div>
          <div className="h-4 bg-gray-200 rounded w-8"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </div>
    </div>
  );
}

function ProjectsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}

function DashboardStats() {
  const { data: projects } = api.projects.getAll.useQuery();
  const { data: user } = api.subscriptions.getCurrentSubscription.useQuery();

  // Calculate stats from all projects
  const allTasks = projects?.flatMap(project => project.tasks || []) || [];
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(task => task.status === 'DONE').length;
  const inProgressTasks = allTasks.filter(task => task.status === 'IN_PROGRESS').length;
  const todoTasks = allTasks.filter(task => task.status === 'TODO').length;

  // Get upcoming tasks (due in next 7 days)
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const upcomingTasks = allTasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) >= now && 
    new Date(task.dueDate) <= nextWeek
  );

  // Get overdue tasks
  const overdueTasks = allTasks.filter(task => 
    task.dueDate && 
    new Date(task.dueDate) < now && 
    task.status !== 'DONE'
  );

  // Get recent activity (tasks updated in last 3 days)
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
  const recentTasks = allTasks.filter(task => 
    new Date(task.updatedAt) >= threeDaysAgo
  ).slice(0, 4); // Limit to 4 tasks for grid layout

  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500";
      case "MEDIUM":
        return "bg-yellow-500";
      case "LOW":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE":
        return "bg-green-500";
      case "IN_PROGRESS":
        return "bg-yellow-500";
      case "TODO":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgressTasks}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Projects</p>
              <p className="text-2xl font-bold text-gray-900">{projects?.length || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Upcoming Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Overdue Tasks Alert */}
        {overdueTasks.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <h3 className="text-lg font-semibold text-red-900">Overdue Tasks</h3>
            </div>
            <div className="space-y-2">
              {overdueTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-900">{task.title}</p>
                    <p className="text-xs text-red-600">
                      Due {new Date(task.dueDate!).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/projects/${task.projectId}`}>
                    <Button variant="outline" size="sm" className="text-red-600 border-red-300">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
              {overdueTasks.length > 3 && (
                <p className="text-xs text-red-600">
                  +{overdueTasks.length - 3} more overdue tasks
                </p>
              )}
            </div>
          </div>
        )}

        {/* Upcoming Tasks */}
        {upcomingTasks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h3 className="text-lg font-semibold text-blue-900">Upcoming Tasks</h3>
            </div>
            <div className="space-y-2">
              {upcomingTasks.slice(0, 3).map((task) => (
                <div key={task.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">{task.title}</p>
                    <p className="text-xs text-blue-600">
                      Due {new Date(task.dueDate!).toLocaleDateString()}
                    </p>
                  </div>
                  <Link href={`/projects/${task.projectId}`}>
                    <Button variant="outline" size="sm" className="text-blue-600 border-blue-300">
                      View
                    </Button>
                  </Link>
                </div>
              ))}
              {upcomingTasks.length > 3 && (
                <p className="text-xs text-blue-600">
                  +{upcomingTasks.length - 3} more upcoming tasks
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity - Grid Layout */}
      {recentTasks.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentTasks.map((task) => (
              <Link
                key={task.id}
                href={`/projects/${task.projectId}?highlight=${task.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200 group"
              >
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(task.status)} flex-shrink-0`}></div>
                    <h4 className="font-medium text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {task.title}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.assignee ? (
                      task.assignee.image ? (
                        <img
                          src={task.assignee.image}
                          alt={task.assignee.name || "User"}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {task.assignee.name?.charAt(0) || "?"}
                        </div>
                      )
                    ) : null}
                    <p className="text-xs text-gray-500">
                      {task.assignee?.name || 'Unassigned'} • {task.priority} priority
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    <span className="text-xs text-gray-500">
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardContent() {
  const { data: session } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showProjectMenu, setShowProjectMenu] = useState<string | null>(null);

  const { data: projects, isLoading } = api.projects.getAll.useQuery();
  const { data: user } = api.subscriptions.getCurrentSubscription.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">dev_operations</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-96 mb-2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
            </div>
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <ProjectsGridSkeleton />
        </main>
      </div>
    );
  }

  if (!projects) {
    return null;
  }

  return (
    <ProjectModalProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">dev_operations</h1>
              </div>
              <div className="flex items-center space-x-4">
                <NotificationsDropdown />
                <UserProfile />
                <SignOutButton />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Dashboard Overview */}
          <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200 rounded mb-8"></div>}>
            <DashboardStats />
          </Suspense>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
              <p className="text-gray-600">Manage and collaborate on your development projects</p>
              {user && (
                <div className="mt-2 text-sm text-gray-500">
                  {user._count?.projects || 0} of {user.projectLimit} projects used
                  {user.subscriptionTier === 'free' && (
                    <span className="ml-2">
                      <Link href="/pricing" className="text-blue-600 hover:text-blue-800">
                        Upgrade to create more projects
                      </Link>
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Link href="/analytics">
                <Button variant="outline" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </Link>
              <NewProjectButton />
            </div>
          </div>

          {/* Projects Grid */}
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <FileText className="h-full w-full" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No projects</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new project.
              </p>
              <div className="mt-6">
                <NewProjectButton />
              </div>
            </div>
          ) : (
            <Suspense fallback={<ProjectsGridSkeleton />}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow relative group">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Link href={`/projects/${project.id}`} className="block">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
                            {project.name}
                          </h3>
                        </Link>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowProjectMenu(showProjectMenu === project.id ? null : project.id)}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                        {showProjectMenu === project.id && (
                          <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-10">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setEditingProject(project);
                                setShowEditModal(true);
                                setShowProjectMenu(null);
                              }}
                              className="w-full justify-start text-xs"
                            >
                              <Edit className="h-3 w-3 mr-2" />
                              Edit Project
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <Link href={`/projects/${project.id}`} className="block">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{project._count.members}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckSquare className="h-4 w-4" />
                            <span>{project._count.tasks}</span>
                          </div>
                        </div>
                        <span className="text-xs">
                          {new Date(project.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </Suspense>
          )}
        </main>
      </div>

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => {
            setShowEditModal(false);
            setEditingProject(null);
          }}
        />
      )}

      {/* Overlay to close project menus */}
      {showProjectMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowProjectMenu(null)}
        />
      )}
    </ProjectModalProvider>
  );
}

export default function HomePage() {
  return (
    <>
      <PerformanceMonitor />
      <AuthRedirect>
        <DashboardContent />
      </AuthRedirect>
    </>
  );
}