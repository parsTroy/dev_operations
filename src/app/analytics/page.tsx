"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { NotificationsDropdown } from "~/components/notifications/notifications-dropdown";
import { UserProfile } from "~/components/profile/user-profile";
import { AuthRedirect } from "~/components/auth/auth-redirect";
import { ArrowLeft, BarChart3, TrendingUp, Users, CheckSquare, FileText, Clock, Target } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

function AnalyticsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  const { data: projects } = api.projects.getAll.useQuery();
  const { data: user } = api.subscriptions.getCurrentSubscription.useQuery();

  // Calculate analytics from projects data
  const analytics = {
    totalProjects: projects?.length || 0,
    totalTasks: projects?.reduce((acc, project) => acc + (project._count?.tasks || 0), 0) || 0,
    completedTasks: projects?.reduce((acc, project) => 
      acc + (project.tasks?.filter(task => task.status === 'DONE').length || 0), 0) || 0,
    totalMembers: projects?.reduce((acc, project) => acc + (project._count?.members || 0), 0) || 0,
    activeProjects: projects?.filter(project => 
      new Date(project.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length || 0,
  };

  const completionRate = analytics.totalTasks > 0 ? 
    Math.round((analytics.completedTasks / analytics.totalTasks) * 100) : 0;

  const stats = [
    {
      title: "Total Projects",
      value: analytics.totalProjects,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      change: "+12%",
      changeType: "positive"
    },
    {
      title: "Total Tasks",
      value: analytics.totalTasks,
      icon: CheckSquare,
      color: "text-green-600",
      bgColor: "bg-green-100",
      change: "+8%",
      changeType: "positive"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      change: "+5%",
      changeType: "positive"
    },
    {
      title: "Team Members",
      value: analytics.totalMembers,
      icon: Users,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      change: "+3%",
      changeType: "positive"
    }
  ];

  return (
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Track your project performance and team productivity</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex space-x-2">
            {[
              { key: "7d", label: "Last 7 days" },
              { key: "30d", label: "Last 30 days" },
              { key: "90d", label: "Last 90 days" }
            ].map((range) => (
              <Button
                key={range.key}
                variant={timeRange === range.key ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range.key as "7d" | "30d" | "90d")}
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <span className={`text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </span>
                    <span className="text-sm text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Project Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Projects</span>
                <span className="font-semibold">{analytics.activeProjects}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Projects</span>
                <span className="font-semibold">{analytics.totalProjects}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${analytics.totalProjects > 0 ? (analytics.activeProjects / analytics.totalProjects) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Task Completion */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Completion</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Completed</span>
                <span className="font-semibold">{analytics.completedTasks}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Tasks</span>
                <span className="font-semibold">{analytics.totalTasks}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {projects?.slice(0, 5).map((project) => (
              <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{project.name}</p>
                    <p className="text-xs text-gray-500">
                      {project._count?.tasks || 0} tasks • {project._count?.members || 0} members
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <AuthRedirect>
      <AnalyticsContent />
    </AuthRedirect>
  );
}
