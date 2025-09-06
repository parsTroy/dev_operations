"use client";

import { Button } from "~/components/ui/button";
import { ArrowLeft, Users, MessageSquare, Github, Twitter, Linkedin, Mail, Calendar, Award } from "lucide-react";
import Link from "next/link";

export function CommunityPage() {
  const communityStats = [
    { label: "Active Members", value: "2,500+" },
    { label: "Projects Created", value: "15,000+" },
    { label: "Tasks Completed", value: "100,000+" },
    { label: "Countries", value: "50+" }
  ];

  const upcomingEvents = [
    {
      title: "Monthly Community Meetup",
      date: "January 25, 2025",
      time: "2:00 PM EST",
      description: "Join us for our monthly community meetup where we discuss new features and answer questions."
    },
    {
      title: "Developer Workshop: Advanced Project Management",
      date: "February 1, 2025",
      time: "3:00 PM EST",
      description: "Learn advanced techniques for managing complex development projects with dev_operations."
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
            <Users className="h-12 w-12 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with developers, share knowledge, and get inspired by the dev_operations community.
          </p>
        </div>

        {/* Community Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {communityStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Community Channels */}
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Join the Conversation</h2>
            <div className="space-y-4">
              <a href="#" className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="font-medium text-gray-900">Discord Server</h3>
                  <p className="text-sm text-gray-600">Real-time chat with the community</p>
                </div>
              </a>
              <a href="#" className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Github className="h-6 w-6 text-gray-900" />
                <div>
                  <h3 className="font-medium text-gray-900">GitHub Discussions</h3>
                  <p className="text-sm text-gray-600">Technical discussions and feature requests</p>
                </div>
              </a>
              <a href="#" className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <Twitter className="h-6 w-6 text-blue-400" />
                <div>
                  <h3 className="font-medium text-gray-900">Twitter</h3>
                  <p className="text-sm text-gray-600">Follow us for updates and tips</p>
                </div>
              </a>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg p-8 shadow-sm border">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.date} at {event.time}
                  </p>
                  <p className="text-sm text-gray-500">{event.description}</p>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <Button variant="outline" className="w-full">
                <Calendar className="h-4 w-4 mr-2" />
                View All Events
              </Button>
            </div>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-blue-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Be Respectful</h3>
              <p className="text-gray-600 text-sm">
                Treat all community members with respect and kindness. We're all here to learn and grow together.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Share Knowledge</h3>
              <p className="text-gray-600 text-sm">
                Help others by sharing your experiences, tips, and solutions. The community grows stronger together.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Stay On Topic</h3>
              <p className="text-gray-600 text-sm">
                Keep discussions relevant to development, project management, and dev_operations features.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Report Issues</h3>
              <p className="text-gray-600 text-sm">
                If you see something that violates our guidelines, please report it to our moderators.
              </p>
            </div>
          </div>
        </div>

        {/* Get Started */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-gray-600 mb-8">
            Connect with thousands of developers who are already using dev_operations to build amazing projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/api/auth/signin">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg">
                Try Demo
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}