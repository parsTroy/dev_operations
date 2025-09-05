"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Mail, CheckCircle, XCircle } from "lucide-react";

interface InvitationSystemProps {
  projectId: string;
}

export function InvitationSystem({ projectId }: InvitationSystemProps) {
  const [invitations, setInvitations] = useState<Array<{
    id: string;
    email: string;
    role: string;
    status: "pending" | "accepted" | "declined";
  }>>([]);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MEMBER" | "VIEWER">("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = api.useUtils();
  const inviteMember = api.projects.inviteMember.useMutation({
    onSuccess: async () => {
      await utils.chat.getProjectMembers.invalidate({ projectId });
      setEmail("");
      setIsSubmitting(false);
    },
    onError: (error) => {
      console.error("Error inviting member:", error);
      setIsSubmitting(false);
    },
  });

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await inviteMember.mutateAsync({
        email: email.trim(),
        role,
        projectId,
      });
    } catch (error) {
      console.error("Error inviting member:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Invite Team Members</h3>
      </div>

      <form onSubmit={handleInvite} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter member's email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "MEMBER" | "VIEWER")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="MEMBER">Member - Can create and edit tasks</option>
              <option value="VIEWER">Viewer - Can only view project</option>
            </select>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !email.trim()}
          className="w-full md:w-auto"
        >
          <Mail className="h-4 w-4 mr-2" />
          {isSubmitting ? "Sending Invite..." : "Send Invitation"}
        </Button>
      </form>

      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-3">How it works:</h4>
        <ul className="text-sm text-gray-600 space-y-2">
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>If the user has an account, they'll be added immediately</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>If they don't have an account, one will be created for them</span>
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span>They'll receive an email notification about the project</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
