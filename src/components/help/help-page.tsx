"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Search, HelpCircle, MessageCircle, Mail, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";

export function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I create my first project?",
      answer: "To create your first project, click the 'New Project' button on your dashboard, fill in the project details, and invite team members. You can start with up to 5 projects on the free plan."
    },
    {
      question: "How do I invite team members?",
      answer: "Go to your project, click on the 'Team' tab, and use the 'Invite Member' button. Enter their email address and assign them a role (Admin, Member, or Viewer)."
    },
    {
      question: "What's the difference between project roles?",
      answer: "Admins can manage all aspects of the project including settings and team members. Members can create and edit tasks, documents, and chat. Viewers can only view project content."
    },
    {
      question: "How do I upgrade my subscription?",
      answer: "Go to the Billing page in your account settings, choose your preferred plan, and follow the payment process. You can upgrade or downgrade at any time."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use enterprise-grade security with encrypted data transmission and storage. Your data is never shared with third parties without your explicit consent."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "You can cancel your subscription anytime from the Billing page. Your account will remain active until the end of your current billing period."
    }
  ];

  const helpCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      topics: ["Creating Projects", "Inviting Team Members", "Basic Navigation"]
    },
    {
      title: "Project Management",
      icon: MessageCircle,
      topics: ["Task Management", "Documentation", "Team Collaboration"]
    },
    {
      title: "Billing & Subscriptions",
      icon: Mail,
      topics: ["Upgrading Plans", "Payment Methods", "Billing History"]
    }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
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
            <div className="flex items-center space-x-4">
              <Link href="/api/auth/signin">
                <Button size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Find answers to common questions and get the help you need.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Help Categories */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Help Categories</h2>
            <div className="space-y-4">
              {helpCategories.map((category, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center space-x-3 mb-3">
                    <category.icon className="h-5 w-5 text-blue-600" />
                    <h3 className="font-medium text-gray-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {category.topics.map((topic, topicIndex) => (
                      <li key={topicIndex} className="text-sm text-gray-600">
                        • {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {filteredFaqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Support */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600 mb-6">
              Can't find the answer you're looking for? Contact our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button size="lg">
                  Contact Support
                </Button>
              </Link>
              <Link href="/documentation">
                <Button variant="outline" size="lg">
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}