"use client";

import { useState } from "react";
import { signIn, getProviders } from "next-auth/react";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Github, Chrome } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
  const [providers, setProviders] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      const res = await getProviders();
      setProviders(res);
    };
    fetchProviders();
  }, []);

  const handleSignIn = async (providerId: string) => {
    setIsLoading(true);
    try {
      await signIn(providerId, { callbackUrl: "/" });
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to your account to continue
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="space-y-4">
              {providers &&
                Object.values(providers).map((provider: any) => (
                  <Button
                    key={provider.name}
                    onClick={() => handleSignIn(provider.id)}
                    disabled={isLoading}
                    className="w-full h-12 text-base font-medium"
                    variant={provider.name === "GitHub" ? "default" : "outline"}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {provider.name === "GitHub" ? (
                        <Github className="h-5 w-5" />
                      ) : provider.name === "Google" ? (
                        <Chrome className="h-5 w-5" />
                      ) : null}
                      <span>
                        {isLoading ? "Signing in..." : `Continue with ${provider.name}`}
                      </span>
                    </div>
                  </Button>
                ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                By signing in, you agree to our{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:text-blue-800">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <span className="text-blue-600 font-medium">
                Sign up is automatic when you sign in
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
