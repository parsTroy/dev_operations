"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { NotificationsDropdown } from "~/components/notifications/notifications-dropdown";
import { UserProfile } from "~/components/profile/user-profile";
import { AuthRedirect } from "~/components/auth/auth-redirect";
import { ArrowLeft, CreditCard, Calendar, Download, Settings, AlertCircle } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";

function BillingContent() {
  const { data: session } = useSession();
  const router = useRouter();

  const { data: user, isLoading } = api.subscriptions.getCurrentSubscription.useQuery();
  const { data: projects } = api.projects.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading billing information...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentSubscription = user.subscriptions?.[0];
  const projectCount = user._count?.projects || 0;
  const projectLimit = user.projectLimit;

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
          <h1 className="text-3xl font-bold text-gray-900">Billing & Subscription</h1>
          <p className="text-gray-600 mt-2">Manage your subscription and billing information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Plan</h2>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">
                    {user.subscriptionTier} Plan
                  </h3>
                  <p className="text-gray-600">
                    {user.subscriptionTier === 'free' 
                      ? 'Perfect for getting started'
                      : 'Full access to all features'
                    }
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900">
                    {user.subscriptionTier === 'free' ? '$0' : 
                     user.subscriptionTier === 'pro' ? '$19' : '$499'}
                  </div>
                  <div className="text-gray-600">
                    {user.subscriptionTier === 'free' ? 'forever' :
                     user.subscriptionTier === 'pro' ? 'per month' : 'one-time'}
                  </div>
                </div>
              </div>

              {/* Usage Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Projects Used</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {projectCount} / {projectLimit}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((projectCount / projectLimit) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Status</p>
                      <p className="text-lg font-semibold text-green-600 capitalize">
                        {user.subscriptionStatus || 'Active'}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Upgrade Prompt for Free Users */}
              {user.subscriptionTier === 'free' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900">Upgrade to Pro</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Get unlimited projects, advanced features, and priority support.
                      </p>
                      <div className="mt-3">
                        <Link href="/pricing">
                          <Button size="sm">
                            View Plans
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subscription Details */}
              {currentSubscription && (
                <div className="border-t pt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Subscription Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Plan:</span>
                      <span className="ml-2 font-medium">{currentSubscription.subscriptionPlan.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span className="ml-2 font-medium capitalize">{currentSubscription.status}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Next Billing:</span>
                      <span className="ml-2 font-medium">
                        {currentSubscription.currentPeriodEnd 
                          ? new Date(currentSubscription.currentPeriodEnd).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Cancel at period end:</span>
                      <span className="ml-2 font-medium">
                        {currentSubscription.cancelAtPeriodEnd ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/pricing" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Change Plan
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Download Invoices
                </Button>
                <Button variant="outline" className="w-full justify-start" disabled>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Update Payment Method
                </Button>
              </div>
            </div>

            {/* Billing History */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Billing History</h3>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No billing history yet</p>
                <p className="text-gray-400 text-xs mt-1">
                  Your invoices will appear here
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BillingPage() {
  return (
    <AuthRedirect>
      <BillingContent />
    </AuthRedirect>
  );
}
