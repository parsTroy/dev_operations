"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { NotificationsDropdown } from "~/components/notifications/notifications-dropdown";
import { UserProfile } from "~/components/profile/user-profile";
import { AuthRedirect } from "~/components/auth/auth-redirect";
import { ArrowLeft, User, Shield, Palette, Globe, Database, Trash2 } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useState } from "react";

function SettingsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "privacy" | "appearance" | "data">("profile");

  const { data: user } = api.subscriptions.getCurrentSubscription.useQuery();

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data & Storage", icon: Database },
  ];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="space-y-1">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeTab === tab.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border">
              {activeTab === "profile" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    {/* Profile Picture */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
                        {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "?"}
                      </div>
                      <div>
                        <Button variant="outline" size="sm">
                          Change Photo
                        </Button>
                        <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={session?.user?.name || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Managed by your authentication provider</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={session?.user?.email || ""}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled
                        />
                        <p className="text-xs text-gray-500 mt-1">Managed by your authentication provider</p>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Account Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Member since:</span>
                          <span className="ml-2 font-medium">
                            {user?.createdAt ? formatDate(new Date(user.createdAt)) : "Unknown"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Subscription:</span>
                          <span className="ml-2 font-medium capitalize">
                            {user?.subscriptionTier || "Free"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Projects:</span>
                          <span className="ml-2 font-medium">
                            {user?._count?.projects || 0} of {user?.projectLimit || 5}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <span className="ml-2 font-medium text-green-600">
                            {user?.subscriptionStatus || "Active"}
                          </span>
                        </div>
                      </div>
                      
                      {/* Subscription Details */}
                      {user?.subscriptions && user.subscriptions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h4 className="font-medium text-gray-900 mb-2">Subscription Details</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Plan:</span>
                              <span className="ml-2 font-medium">
                                {user.subscriptions[0]?.subscriptionPlan?.name || "Unknown"}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Next billing:</span>
                              <span className="ml-2 font-medium">
                                {user.subscriptions[0]?.currentPeriodEnd 
                                  ? formatDate(new Date(user.subscriptions[0].currentPeriodEnd))
                                  : "N/A"
                                }
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Amount:</span>
                              <span className="ml-2 font-medium">
                                ${user.subscriptions[0]?.subscriptionPlan?.price || 0}
                                {user.subscriptions[0]?.subscriptionPlan?.interval === "month" ? "/month" : 
                                 user.subscriptions[0]?.subscriptionPlan?.interval === "year" ? "/year" : 
                                 user.subscriptions[0]?.subscriptionPlan?.interval === "lifetime" ? " one-time" : ""}
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-600">Auto-renewal:</span>
                              <span className="ml-2 font-medium">
                                {user.subscriptions[0]?.cancelAtPeriodEnd ? "No" : "Yes"}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "privacy" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Security</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Two-Factor Authentication</h3>
                      <p className="text-sm text-blue-700 mb-3">Add an extra layer of security to your account</p>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-300">
                        Enable 2FA
                      </Button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                        <p className="text-sm text-gray-600">Control who can see your profile information</p>
                      </div>
                      <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Team Members Only</option>
                        <option>All Users</option>
                        <option>Private</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Activity Status</h3>
                        <p className="text-sm text-gray-600">Show when you're online to other team members</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "appearance" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <button className="p-4 border-2 border-blue-500 rounded-lg bg-white">
                          <div className="w-full h-8 bg-white border rounded mb-2"></div>
                          <span className="text-sm font-medium">Light</span>
                        </button>
                        <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-400">
                          <div className="w-full h-8 bg-gray-900 border rounded mb-2"></div>
                          <span className="text-sm font-medium">Dark</span>
                        </button>
                        <button className="p-4 border border-gray-300 rounded-lg hover:border-gray-400">
                          <div className="w-full h-8 bg-gradient-to-r from-blue-500 to-purple-500 border rounded mb-2"></div>
                          <span className="text-sm font-medium">Auto</span>
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Language</h3>
                      <select className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>English</option>
                        <option>Spanish</option>
                        <option>French</option>
                        <option>German</option>
                      </select>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Time Zone</h3>
                      <select className="w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>UTC-8 (Pacific Time)</option>
                        <option>UTC-5 (Eastern Time)</option>
                        <option>UTC+0 (GMT)</option>
                        <option>UTC+1 (Central European Time)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "data" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Data & Storage</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3">Storage Usage</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Projects</span>
                          <span>2.3 MB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Files</span>
                          <span>15.7 MB</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Chat History</span>
                          <span>1.2 MB</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: "25%" }}></div>
                        </div>
                        <p className="text-xs text-gray-500">19.2 MB of 100 MB used</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
                        <p className="text-sm text-gray-600 mb-3">Download a copy of all your data</p>
                        <Button variant="outline" size="sm">
                          <Database className="h-4 w-4 mr-2" />
                          Export All Data
                        </Button>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                        <p className="text-sm text-gray-600 mb-3">Permanently delete your account and all data</p>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AuthRedirect>
      <SettingsContent />
    </AuthRedirect>
  );
}
