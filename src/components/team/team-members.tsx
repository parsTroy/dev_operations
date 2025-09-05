"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Users, UserPlus, Crown, Shield, Eye, Trash2, Mail } from "lucide-react";
import { InvitationSystem } from "./invitation-system";

interface TeamMembersProps {
  projectId: string;
  currentUserId: string;
}

export function TeamMembers({ projectId, currentUserId }: TeamMembersProps) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const { data: members, isLoading } = api.chat.getProjectMembers.useQuery({ projectId });
  const { data: project } = api.projects.getById.useQuery({ id: projectId });

  const utils = api.useUtils();
  const removeMember = api.projects.removeMember.useMutation({
    onSuccess: async () => {
      await utils.chat.getProjectMembers.invalidate({ projectId });
      await utils.projects.getById.invalidate({ id: projectId });
    },
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <Crown className="h-4 w-4 text-yellow-600" />;
      case "MEMBER":
        return <Shield className="h-4 w-4 text-blue-600" />;
      case "VIEWER":
        return <Eye className="h-4 w-4 text-gray-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "bg-yellow-100 text-yellow-800";
      case "MEMBER":
        return "bg-blue-100 text-blue-800";
      case "VIEWER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      await removeMember.mutateAsync({ memberId });
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
          <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2 py-1 rounded-full">
            {members?.length || 0}
          </span>
        </div>
        <Button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Invite Member
        </Button>
      </div>

      <div className="space-y-3">
        {members?.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {member.user.name?.charAt(0) || member.user.email?.charAt(0) || "?"}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">
                    {member.user.name || "Unknown User"}
                  </h4>
                  {member.userId === currentUserId && (
                    <span className="text-xs text-gray-500">(You)</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                {getRoleIcon(member.role)}
                {member.role}
              </span>
              {member.userId !== currentUserId && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id)}
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Invitation System */}
      <div className="mt-8">
        <InvitationSystem projectId={projectId} />
      </div>

      {showInviteModal && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
}

interface InviteMemberModalProps {
  projectId: string;
  onClose: () => void;
}

function InviteMemberModal({ projectId, onClose }: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"MEMBER" | "VIEWER">("MEMBER");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const utils = api.useUtils();
  const inviteMember = api.projects.inviteMember.useMutation({
    onSuccess: async () => {
      await utils.chat.getProjectMembers.invalidate({ projectId });
      await utils.projects.getById.invalidate({ id: projectId });
      onClose();
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Invite Team Member</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            ×
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !email.trim()}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              {isSubmitting ? "Inviting..." : "Send Invite"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
