"use client";

import { Button } from "~/components/ui/button";
import { ArrowLeft, BookOpen, Users, CheckSquare, FileText, CreditCard, BarChart3, MessageSquare, Settings, Shield, Zap, Target } from "lucide-react";
import Link from "next/link";

export function DocumentationPage() {
  const documentationSections = [
    {
      title: "Getting Started",
      description: "Learn the basics of dev_operations and set up your first project",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      items: [
        "Creating your first project",
        "Inviting team members",
        "Understanding project roles",
        "Setting up notifications"
      ]
    },
    {
      title: "Project Management",
      description: "Master project organization and task management",
      icon: Target,
      color: "text-green-600",
      bgColor: "bg-green-100",
      items: [
        "Creating and managing projects",
        "Task creation and assignment",
        "Kanban board navigation",
        "Project documentation"
      ]
    },
    {
      title: "Team Collaboration",
      description: "Work effectively with your team members",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      items: [
        "Inviting team members",
        "Role-based permissions",
        "Real-time chat features",
        "Task comments and mentions"
      ]
    },
    {
      title: "Task Management",
      description: "Organize and track your work efficiently",
      icon: CheckSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      items: [
        "Creating and editing tasks",
        "Drag and drop functionality",
        "Task priorities and due dates",
        "Task status management"
      ]
    },
    {
      title: "Documentation",
      description: "Create and manage project documentation",
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100",
      items: [
        "Markdown editor features",
        "Creating documentation pages",
        "Organizing project docs",
        "Collaborative editing"
      ]
    },
    {
      title: "Billing & Subscriptions",
      description: "Manage your subscription and billing",
      icon: CreditCard,
      color: "text-red-600",
      bgColor: "bg-red-100",
      items: [
        "Understanding subscription tiers",
        "Upgrading your plan",
        "Billing dashboard",
        "Payment methods"
      ]
    },
    {
      title: "Analytics & Reports",
      description: "Track your project performance and productivity",
      icon: BarChart3,
      color: "text-teal-600",
      bgColor: "bg-teal-100",
      items: [
        "Project analytics dashboard",
        "Task completion tracking",
        "Team productivity metrics",
        "Performance insights"
      ]
    },
    {
      title: "Real-time Features",
      description: "Stay connected with live updates and notifications",
      icon: Zap,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      items: [
        "Live task updates",
        "Real-time chat",
        "Push notifications",
        "Team activity feeds"
      ]
    },
    {
      title: "Account Settings",
      description: "Customize your account and preferences",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
      items: [
        "Profile management",
        "Notification preferences",
        "Security settings",
        "Account preferences"
      ]
    }
  ];

  const quickStartGuides = [
    {
      title: "Create Your First Project",
      description: "Step-by-step guide to setting up your first project",
      href: "/",
      icon: Target
    },
    {
      title: "Invite Team Members",
      description: "Learn how to add collaborators to your projects",
      href: "/",
      icon: Users
    },
    {
      title: "Set Up Task Management",
      description: "Organize your work with our Kanban board system",
      href: "/",
      icon: CheckSquare
    },
    {
      title: "Configure Notifications",
      description: "Stay updated with real-time notifications",
      href: "/",
      icon: MessageSquare
    }
  ];

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
                  Back to Home
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">dev_operations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/api/auth/signin">
                <Button size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know to get the most out of dev_operations. 
            From basic setup to advanced features, we've got you covered.
          </p>
        </div>

        {/* Quick Start Guides */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickStartGuides.map((guide, index) => (
              <Link key={index} href={guide.href} className="group">
                <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <guide.icon className="h-6 w-6 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">
                      {guide.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-600">{guide.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Documentation Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documentationSections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${section.bgColor} rounded-lg flex items-center justify-center`}>
                    <section.icon className={`h-5 w-5 ${section.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                </div>
                <p className="text-gray-600 mb-4">{section.description}</p>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* API Reference */}
        <div className="bg-white rounded-lg p-8 shadow-sm border mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">REST API</h3>
              <p className="text-gray-600 mb-4">
                Access dev_operations programmatically with our REST API endpoints.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Projects management</li>
                <li>• Task operations</li>
                <li>• Team member management</li>
                <li>• Real-time updates</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h3>
              <p className="text-gray-600 mb-4">
                Get notified when important events happen in your projects.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Task status changes</li>
                <li>• New team members</li>
                <li>• Project updates</li>
                <li>• Payment events</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need More Help?
          </h2>
          <p className="text-gray-600 mb-8">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg">
                Contact Support
              </Button>
            </Link>
            <Link href="/help">
              <Button variant="outline" size="lg">
                Help Center
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}