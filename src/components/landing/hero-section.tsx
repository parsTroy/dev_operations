"use client";

import { Button } from "~/components/ui/button";
import { ArrowRight, CheckCircle, Users, MessageSquare, FileText, CheckSquare } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">dev_operations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/api/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/api/auth/signin">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Developer Collaboration
            <span className="text-blue-600 block">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The all-in-one platform for managing projects, tasks, and team collaboration. 
            Built for developers, by developers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api/auth/signin">
              <Button size="lg" className="w-full sm:w-auto">
                Start Building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <CheckSquare className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Project Management</h3>
            <p className="text-gray-600">
              Organize your projects with Kanban boards, task tracking, and deadline management.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Invite team members, assign roles, and collaborate seamlessly across projects.
            </p>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Chat</h3>
            <p className="text-gray-600">
              Communicate instantly with your team using project-specific chat channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
