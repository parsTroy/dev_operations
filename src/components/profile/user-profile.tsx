"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { User, Settings, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

export function UserProfile() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = api.subscriptions.getCurrentSubscription.useQuery();

  if (!session?.user) {
    return null;
  }

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
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {session.user.name?.charAt(0) || session.user.email?.charAt(0) || "?"}
          </div>
        )}
        <span className="hidden sm:block text-sm font-medium">
          {session.user.name || session.user.email}
        </span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-4">
            <div className="px-2 py-3 text-sm text-gray-700 border-b">
              <p className="font-medium text-base">{session.user.name || "User"}</p>
              <p className="text-gray-500 text-sm break-all">{session.user.email}</p>
              {user?.createdAt && (
                <p className="text-xs text-gray-400 mt-2 whitespace-nowrap">
                  Member since {new Date(user.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                  {user?.subscriptionTier && user.subscriptionTier !== 'free' && (
                    <span className="ml-2 text-blue-400">
                      • {user.subscriptionTier === 'pro' ? 'Pro' : 'Lifetime'} member
                    </span>
                  )}
                </p>
              )}
            </div>
            
            <div className="py-2">
              <Link href="/billing">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm px-3 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Billing
                </Button>
              </Link>
              
              <Link href="/settings">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-sm px-3 py-2"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Settings
                </Button>
              </Link>
              
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sm text-red-600 hover:text-red-700 px-3 py-2"
                onClick={() => {
                  setIsOpen(false);
                  // Handle sign out
                }}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Sign Out
              </Button>
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
