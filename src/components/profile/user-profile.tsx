"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { Github, Mail, Calendar, ExternalLink } from "lucide-react";

export function UserProfile() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  if (!session?.user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
          </div>
        )}
        <span className="hidden md:block text-sm">
          {session.user.name || session.user.email}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
                  {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "U"}
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {session.user.name || "User"}
                </h3>
                <p className="text-gray-600 text-sm">
                  {session.user.email}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{session.user.email}</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Calendar className="h-4 w-4" />
                <span>Member since {new Date().getFullYear()}</span>
              </div>

              <div className="pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => window.open("https://github.com", "_blank")}
                >
                  <Github className="h-4 w-4 mr-2" />
                  View GitHub Profile
                  <ExternalLink className="h-3 w-3 ml-auto" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
