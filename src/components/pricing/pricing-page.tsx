"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Check, X } from "lucide-react";
import { api } from "~/trpc/react";
import { CheckoutForm } from "~/components/payment/checkout-form";

export function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const { data: plans } = api.subscriptions.getPlans.useQuery();
  const { data: currentSubscription } = api.subscriptions.getCurrentSubscription.useQuery();

  const features = [
    "Unlimited projects",
    "Advanced task management",
    "Real-time collaboration",
    "Priority support",
    "Advanced analytics",
    "Custom integrations",
  ];

  const handleSubscribe = async (priceId: string) => {
    setSelectedPlan(priceId);
    setShowCheckout(true);
  };

  const handleSuccess = (subscriptionId: string) => {
    console.log("Subscription successful:", subscriptionId);
    setShowCheckout(false);
    setSelectedPlan(null);
    // Refresh subscription data
    window.location.reload();
  };

  const handleError = (error: string) => {
    console.error("Subscription error:", error);
    setShowCheckout(false);
    setSelectedPlan(null);
  };

  if (showCheckout && selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Complete Your Subscription
            </h1>
            <p className="text-gray-600">
              Enter your payment information to get started
            </p>
          </div>
          
          <CheckoutForm
            priceId={selectedPlan}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Start free, upgrade when you're ready
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Plan */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">$0</p>
              <p className="text-gray-600 mb-6">Perfect for getting started</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>5 projects maximum</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Basic task management</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Team collaboration</span>
              </li>
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Community support</span>
              </li>
            </ul>
            <Button
              className="w-full"
              variant="outline"
              disabled={currentSubscription?.subscriptionTier === "free"}
            >
              {currentSubscription?.subscriptionTier === "free" ? "Current Plan" : "Get Started"}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-lg shadow-sm border-2 border-blue-500 p-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">$19</p>
              <p className="text-gray-600 mb-6">per month</p>
            </div>
            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button
              className="w-full"
              onClick={() => handleSubscribe("pro_monthly")}
              disabled={isLoading || currentSubscription?.subscriptionTier === "pro"}
            >
              {isLoading ? "Processing..." : currentSubscription?.subscriptionTier === "pro" ? "Current Plan" : "Upgrade to Pro"}
            </Button>
          </div>

          {/* Lifetime Plan */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Lifetime</h3>
              <p className="text-4xl font-bold text-gray-900 mb-4">$499</p>
              <p className="text-gray-600 mb-6">one-time payment</p>
            </div>
            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span>{feature}</span>
                </li>
              ))}
              <li className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-3" />
                <span>Lifetime access</span>
              </li>
            </ul>
            <Button
              className="w-full"
              onClick={() => handleSubscribe("lifetime")}
              disabled={isLoading || currentSubscription?.subscriptionTier === "lifetime"}
            >
              {isLoading ? "Processing..." : currentSubscription?.subscriptionTier === "lifetime" ? "Current Plan" : "Get Lifetime Access"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}