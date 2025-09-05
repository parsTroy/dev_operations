"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { DemoProjectCard } from "~/components/demo/demo-project-card";
import { DemoKanban } from "~/components/demo/demo-kanban";
import { DemoChat } from "~/components/demo/demo-chat";
import { DemoTeam } from "~/components/demo/demo-team";
import { ArrowLeft, Users, CheckSquare, MessageCircle, FileText } from "lucide-react";
import Link from "next/link";
import { demoProjects, demoTasks, demoMessages, demoTeamMembers } from "~/components/demo/demo-data";

export default function DemoPage() {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "team">("overview");

  const selectedProjectData = demoProjects.find(p => p.id === selectedProject);

  if (selectedProject && selectedProjectData) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Projects
                </Button>
                <h1 className="text-xl font-semibold text-gray-900">dev_operations</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">Demo Mode</span>
                <Link href="/api/auth/signin">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Project Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedProjectData.name}</h1>
                <p className="text-gray-600 mt-2">{selectedProjectData.description}</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="h-4 w-4" />
                    <span>{selectedProjectData.members} members</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <CheckSquare className="h-4 w-4" />
                    <span>{selectedProjectData.tasks} tasks</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {selectedProjectData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Overview
                </div>
              </button>
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
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h3>
                <p className="text-gray-600 mb-4">
                  This is a demo of how dev_operations helps you manage your development projects. 
                  You can see the project details, team members, and task management in action.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900">Project Management</h4>
                    <p className="text-sm text-blue-700">Organize tasks with Kanban boards</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-medium text-green-900">Team Collaboration</h4>
                    <p className="text-sm text-green-700">Work together seamlessly</p>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-medium text-purple-900">Real-time Chat</h4>
                    <p className="text-sm text-purple-700">Communicate instantly</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Management</h3>
                <p className="text-gray-600">Drag and drop tasks between columns to see how project management works.</p>
              </div>
              <DemoKanban tasks={demoTasks} />
            </div>
          )}

          {activeTab === "team" && (
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Members</h3>
                <p className="text-gray-600">See how role-based access control works with your team.</p>
              </div>
              <DemoTeam members={demoTeamMembers} />
            </div>
          )}
        </main>

        {/* Demo Chat */}
        <DemoChat messages={demoMessages} memberCount={demoTeamMembers.length} />
      </div>
    );
  }

  // Projects Overview
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/landing">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Landing
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">dev_operations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Demo Mode</span>
              <Link href="/api/auth/signin">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Interactive Demo</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore dev_operations features with this interactive demo. 
            Click on any project to see how task management, team collaboration, and real-time chat work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {demoProjects.map((project) => (
            <DemoProjectCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ready to Get Started?</h3>
            <p className="text-gray-600 mb-6">
              This demo shows just a fraction of what dev_operations can do. 
              Sign up to create your own projects and start collaborating with your team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/api/auth/signin">
                <Button size="lg">
                  Start Building
                </Button>
              </Link>
              <Link href="/landing">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
