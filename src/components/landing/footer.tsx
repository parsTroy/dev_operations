"use client";

import { Github, Mail, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">dev_operations</h3>
            <p className="text-gray-400 mb-4 max-w-md">
              The all-in-one platform for developer collaboration. 
              Manage projects, tasks, and team communication in one place.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/parsTroy/dev_operations" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              {/* <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a> */}
              <a href="mailto:support@devoperations.ca" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href="/demo" className="hover:text-white transition-colors">Demo</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/documentation" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 dev_operations. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
