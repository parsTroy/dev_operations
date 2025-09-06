"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { ArrowLeft, AlertCircle } from "lucide-react";
import Link from "next/link";

const errorMessages = {
  Configuration: "There is a problem with the server configuration.",
  AccessDenied: "Access denied. You do not have permission to sign in.",
  Verification: "The verification token has expired or has already been used.",
  Default: "An error occurred during authentication.",
};

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessage = errorMessages[error as keyof typeof errorMessages] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-red-500 mb-4">
              <AlertCircle className="h-full w-full" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Authentication Error
            </h2>
            <p className="text-gray-600">
              {errorMessage}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="space-y-4">
              <Link href="/api/auth/signin" className="block">
                <Button className="w-full h-12 text-base font-medium">
                  Try Again
                </Button>
              </Link>
              <Link href="/landing" className="block">
                <Button variant="outline" className="w-full h-12 text-base font-medium">
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
