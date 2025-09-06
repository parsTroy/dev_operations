"use client";

import { Button } from "~/components/ui/button";
import { ArrowLeft, BookOpen, Code, Users, Zap, Shield, GitBranch, Calendar, BarChart3 } from "lucide-react";
import Link from "next/link";

export function DocumentationPage() {
  const features = [
    {
      icon: Code,
      title: "Getting Started",
      description: "Learn how to set up your first project and invite team members",
      link: "/documentation/getting-started"
    },
    {
      icon: Users,
      title: "Team Management",
      description: "Understand roles, permissions, and how to manage your team",
      link: "/documentation/team-management"
    },
    {
      icon: Zap,
      title: "Real-time Features",
      description: "Learn about live updates, notifications, and real-time collaboration",
      link: "/documentation/real-time-features"
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "Understand our security measures and data protection policies",
      link: "/documentation/security"
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description: "Connect your GitHub account and manage repositories",
      link: "/documentation/github-integration"
    },
    {
      icon: Calendar,
      title: "Project Timeline",
      description: "Track project progress with timelines and milestones",
      link: "/documentation/project-timeline"
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Monitor team productivity and project metrics",
      link: "/documentation/analytics"
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.link}
              className="group bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <feature.icon className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Contact Support
                </Button>
              </Link>
              <Link href="/community">
                <Button variant="outline" size="lg">
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}