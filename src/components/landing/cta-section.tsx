"use client";

import { Button } from "~/components/ui/button";
import { ArrowRight, CheckCircle } from "lucide-react";
import Link from "next/link";

export function CTASection() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Development Workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are already building better software 
            with dev_operations. Start your free project today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/api/auth/signin">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/demo">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent border-white text-white hover:bg-white hover:text-blue-600">
                Try Demo
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Free to Start</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">5 min</div>
              <div className="text-blue-100">Setup Time</div>
            </div>
            <div className="text-white">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Team Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
