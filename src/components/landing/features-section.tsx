"use client";

import { 
  CheckSquare, 
  Users, 
  MessageSquare, 
  FileText, 
  Bell, 
  Shield, 
  Zap,
  GitBranch,
  Calendar,
  BarChart3
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: CheckSquare,
      title: "Task Management",
      description: "Drag-and-drop Kanban boards with priority levels, due dates, and assignees.",
      color: "blue"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Role-based access control with Admin, Member, and Viewer permissions.",
      color: "green"
    },
    {
      icon: MessageSquare,
      title: "Real-time Chat",
      description: "Project-specific chat channels with @mentions and instant notifications.",
      color: "purple"
    },
    {
      icon: FileText,
      title: "Documentation",
      description: "Markdown-powered project wikis with collaborative editing capabilities.",
      color: "orange"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay updated with real-time notifications for tasks, mentions, and updates.",
      color: "red"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with project-level access control and data privacy.",
      color: "indigo"
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description: "Live updates across all team members using WebSocket technology.",
      color: "yellow"
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description: "Seamless integration with GitHub for authentication and project linking.",
      color: "gray"
    },
    {
      icon: Calendar,
      title: "Project Timeline",
      description: "Track project progress with visual timelines and milestone management.",
      color: "pink"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Monitor team productivity with detailed project and task analytics.",
      color: "teal"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      red: "bg-red-100 text-red-600",
      indigo: "bg-indigo-100 text-indigo-600",
      yellow: "bg-yellow-100 text-yellow-600",
      gray: "bg-gray-100 text-gray-600",
      pink: "bg-pink-100 text-pink-600",
      teal: "bg-teal-100 text-teal-600"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Build Better
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A comprehensive platform that combines project management, team collaboration, 
            and real-time communication in one powerful tool.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(feature.color)}`}>
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
