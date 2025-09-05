"use client";

import { Users, Crown, Shield, Eye } from "lucide-react";

interface DemoTeamMember {
  id: string;
  user: { name: string; email: string };
  role: "ADMIN" | "MEMBER" | "VIEWER";
}

interface DemoTeamProps {
  members: DemoTeamMember[];
}

export function DemoTeam({ members }: DemoTeamProps) {
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

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="h-5 w-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Team Members</h3>
        <span className="bg-gray-100 text-gray-600 text-sm font-medium px-2 py-1 rounded-full">
          {members.length}
        </span>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {member.user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-gray-900">
                    {member.user.name}
                  </h4>
                </div>
                <p className="text-sm text-gray-500">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                {getRoleIcon(member.role)}
                {member.role}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Demo Mode:</strong> This shows how team collaboration works. 
          Sign up to invite your own team members!
        </p>
      </div>
    </div>
  );
}
