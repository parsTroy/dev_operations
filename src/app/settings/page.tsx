"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { NotificationsDropdown } from "~/components/notifications/notifications-dropdown";
import { UserProfile } from "~/components/profile/user-profile";
import { AuthRedirect } from "~/components/auth/auth-redirect";
import { ArrowLeft, User, Shield, Database, Trash2, HelpCircle, Mail, Github, ExternalLink } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useState } from "react";

function SettingsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"profile" | "privacy" | "data" | "support">("profile");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  const { data: user } = api.subscriptions.getCurrentSubscription.useQuery();
  const { data: settings, isLoading: settingsLoading } = api.settings.getSettings.useQuery();

  const utils = api.useUtils();
  const updateSettings = api.settings.updateSettings.useMutation({
    onSuccess: () => {
      utils.settings.getSettings.invalidate();
    },
  });


  const exportData = api.settings.exportData.useMutation({
    onSuccess: (data) => {
      // Create and download JSON file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dev_operations_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  });

  const deleteAccount = api.settings.deleteAccount.useMutation({
    onSuccess: () => {
      // Redirect to landing page after account deletion
      window.location.href = '/landing';
    },
  });

  const settingsTabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "privacy", label: "Privacy & Security", icon: Shield },
    { id: "data", label: "Data & Storage", icon: Database },
    { id: "support", label: "Support", icon: HelpCircle },
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
                                  {session?.user?.image ? (
                                    <img
                                      src={session.user.image}
                                      alt={session.user.name || "User"}
                                      className="w-16 h-16 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
                                      {session?.user?.name?.charAt(0) || session?.user?.email?.charAt(0) || "?"}
                                    </div>
                                  )}
                                  <div>
                                    <p className="text-sm text-gray-500">Profile picture managed by your authentication provider</p>
                                    <p className="text-xs text-gray-400 mt-1">GitHub, Google, etc.</p>
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
                                ${Number(user.subscriptions[0]?.subscriptionPlan?.price || 0)}
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

                    {/* Profile Visibility */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Profile Visibility</h3>
                        <p className="text-sm text-gray-600">Control who can see your profile information</p>
                      </div>
                      <select 
                        value={settings?.profileVisibility || "team"}
                        onChange={(e) => updateSettings.mutate({ 
                          profileVisibility: e.target.value as "team" | "public" | "private" 
                        })}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={updateSettings.isPending}
                      >
                        <option value="team">Team Members Only</option>
                        <option value="public">All Users</option>
                        <option value="private">Private</option>
                      </select>
                    </div>

                    {/* Activity Status */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Activity Status</h3>
                        <p className="text-sm text-gray-600">Show when you're online to other team members</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings?.showActivityStatus ?? true}
                          onChange={(e) => updateSettings.mutate({ showActivityStatus: e.target.checked })}
                          disabled={updateSettings.isPending}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}


              {activeTab === "data" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Data Management</h2>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-2">Export Data</h3>
                        <p className="text-sm text-gray-600 mb-3">Download a copy of all your data including projects, tasks, comments, and chat history</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => exportData.mutate()}
                          disabled={exportData.isPending}
                        >
                          <Database className="h-4 w-4 mr-2" />
                          {exportData.isPending ? "Exporting..." : "Export All Data"}
                        </Button>
                      </div>

                      <div className="border-t pt-4">
                        <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                        <p className="text-sm text-gray-600 mb-3">Permanently delete your account and all data</p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={() => setShowDeleteConfirm(true)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "support" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Support & Resources</h2>
                  
                  <div className="space-y-6">
                    {/* Quick Help Links */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 mb-3">Get Help</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link href="/help">
                          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <HelpCircle className="h-5 w-5 text-blue-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">Help Center</h4>
                                <p className="text-sm text-gray-600">Find answers to common questions</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                            </div>
                          </div>
                        </Link>

                        <Link href="/documentation">
                          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Database className="h-5 w-5 text-green-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">Documentation</h4>
                                <p className="text-sm text-gray-600">Detailed guides and API docs</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                            </div>
                          </div>
                        </Link>

                        <Link href="/contact">
                          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Mail className="h-5 w-5 text-purple-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">Contact Support</h4>
                                <p className="text-sm text-gray-600">Get in touch with our team</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                            </div>
                          </div>
                        </Link>

                        <a href="https://github.com/parsTroy/dev_operations" target="_blank" rel="noopener noreferrer">
                          <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                            <div className="flex items-center gap-3">
                              <Github className="h-5 w-5 text-gray-600" />
                              <div>
                                <h4 className="font-medium text-gray-900">GitHub Repository</h4>
                                <p className="text-sm text-gray-600">View source code and issues</p>
                              </div>
                              <ExternalLink className="h-4 w-4 text-gray-400 ml-auto" />
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="font-medium text-gray-900 mb-3">Direct Contact</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-700">support@devoperations.ca</span>
                        </div>
                        <p className="text-xs text-gray-600 mt-2">We typically respond within 24 hours</p>
                      </div>
                    </div>

                    {/* Additional Resources */}
                    <div className="space-y-4">
                      <h3 className="font-medium text-gray-900 mb-3">Additional Resources</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-700">
                              <strong>Before contacting support:</strong> Check our Help Center for quick answers to common questions
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-700">
                              <strong>Bug reports:</strong> Use our GitHub repository to report bugs and feature requests
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-sm text-gray-700">
                              <strong>Feature requests:</strong> We love hearing your ideas! Contact us or create a GitHub issue
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Account Deletion Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] max-w-md p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-4">Delete Account</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                This action cannot be undone. This will permanently delete your account and remove all data from our servers.
              </p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="font-bold text-red-600">DELETE</span> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmation("");
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteAccount.mutate({ confirmation: deleteConfirmation })}
                  disabled={deleteConfirmation !== "DELETE" || deleteAccount.isPending}
                  className="flex-1"
                >
                  {deleteAccount.isPending ? "Deleting..." : "Delete Account"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
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
