"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { TaskModalProvider } from "~/components/tasks/task-modal-provider";
import { NewTaskButton } from "~/components/tasks/new-task-button";
import { NotificationsDropdown } from "~/components/notifications/notifications-dropdown";
import { UserProfile } from "~/components/profile/user-profile";
import { EditProjectModal } from "~/components/projects/edit-project-modal";
import { DroppableColumn } from "~/components/tasks/droppable-column";
import { ChatWindow } from "~/components/chat/chat-window";
import { TeamMembers } from "~/components/team/team-members";
import { ProjectAnalytics } from "~/components/analytics/project-analytics";
import { ArrowLeft, Users, Calendar, Tag, FileText, Edit, MoreVertical, CheckSquare, MessageCircle, BarChart3 } from "lucide-react";
import Link from "next/link";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { useState, useEffect } from "react";
import { use } from "react";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = use(params);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [activeTask, setActiveTask] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"tasks" | "team" | "analytics">("tasks");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  const { data: project, isLoading: projectLoading } = api.projects.getById.useQuery({ id });
  const { data: tasks, isLoading: tasksLoading } = api.tasks.getByProject.useQuery({ projectId: id });

  const utils = api.useUtils();
  const updateTaskStatus = api.tasks.updateStatus.useMutation({
    onSuccess: async () => {
      // Only invalidate tasks for this specific project
      await utils.tasks.getByProject.invalidate({ projectId: id });
    },
  });

  if (status === "loading" || projectLoading || tasksLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || !project) {
    return null;
  }

  // Group tasks by status
  const tasksByStatus = {
    TODO: tasks?.filter((task) => task.status === "TODO") || [],
    IN_PROGRESS: tasks?.filter((task) => task.status === "IN_PROGRESS") || [],
    DONE: tasks?.filter((task) => task.status === "DONE") || [],
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks?.find((t) => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || active.id === over.id) return;

    const taskId = active.id as string;
    const newStatus = over.id as "TODO" | "IN_PROGRESS" | "DONE";

    updateTaskStatus.mutate({
      id: taskId,
      status: newStatus,
    });
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
              <NotificationsDropdown />
              <UserProfile />
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
            <div className="flex items-center gap-2">
              <Link href={`/projects/${id}/docs`}>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Docs
                </Button>
              </Link>
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowProjectMenu(!showProjectMenu)}
                  className="flex items-center gap-2"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                {showProjectMenu && (
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowEditModal(true);
                        setShowProjectMenu(false);
                      }}
                      className="w-full justify-start text-xs"
                    >
                      <Edit className="h-3 w-3 mr-2" />
                      Edit Project
                    </Button>
                  </div>
                )}
              </div>
              <NewTaskButton />
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("tasks")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "tasks"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Tasks
              </div>
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "team"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team
              </div>
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "analytics"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "tasks" ? (
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <DroppableColumn
                id="TODO"
                title="To Do"
                tasks={tasksByStatus.TODO}
                projectId={id}
              />
              <DroppableColumn
                id="IN_PROGRESS"
                title="In Progress"
                tasks={tasksByStatus.IN_PROGRESS}
                projectId={id}
              />
              <DroppableColumn
                id="DONE"
                title="Done"
                tasks={tasksByStatus.DONE}
                projectId={id}
              />
            </div>
            
            <DragOverlay>
              {activeTask ? (
                <div className="bg-white rounded-lg p-3 border shadow-lg opacity-90">
                  <h4 className="font-medium text-gray-900 text-sm">{activeTask.title}</h4>
                  {activeTask.description && (
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{activeTask.description}</p>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeTask.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                      activeTask.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {activeTask.priority}
                    </span>
                    {activeTask.assignee && (
                      <div className="flex items-center gap-1">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                          {activeTask.assignee.name?.charAt(0) || '?'}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : activeTab === "team" ? (
          <TeamMembers projectId={id} currentUserId={session?.user?.id || ""} />
        ) : (
          <ProjectAnalytics projectId={id} />
        )}
      </main>
      </div>

      {/* Edit Project Modal */}
      {showEditModal && project && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Overlay to close project menu */}
      {showProjectMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowProjectMenu(false)}
        />
      )}

      {/* Chat Window */}
      <ChatWindow projectId={id} />
    </TaskModalProvider>
  );
}