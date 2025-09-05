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
import { Plus, Users, CheckSquare, FileText, Edit, MoreVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

function DashboardContent() {
  const { data: session } = useSession();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showProjectMenu, setShowProjectMenu] = useState<string | null>(null);

  const { data: projects, isLoading } = api.projects.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading projects...</p>
        </div>
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Projects</h2>
              <p className="text-gray-600">Manage and collaborate on your development projects</p>
            </div>
            <NewProjectButton />
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
    <AuthRedirect>
      <DashboardContent />
    </AuthRedirect>
  );
}