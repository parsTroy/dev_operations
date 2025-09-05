"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Users, CheckSquare, FileText, Edit, MoreVertical } from "lucide-react";

interface DemoProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    tags: string[];
    members: number;
    tasks: number;
    updatedAt: Date;
    status: string;
  };
  onSelect: (projectId: string) => void;
}

export function DemoProjectCard({ project, onSelect }: DemoProjectCardProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow relative group cursor-pointer"
         onClick={() => onSelect(project.id)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-1 mb-4">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVertical className="h-3 w-3" />
          </Button>
          {showMenu && (
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border z-10">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(false);
                }}
                className="w-full justify-start text-xs"
              >
                <Edit className="h-3 w-3 mr-2" />
                Edit Project
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{project.members}</span>
          </div>
          <div className="flex items-center gap-1">
            <CheckSquare className="h-4 w-4" />
            <span>{project.tasks}</span>
          </div>
        </div>
        <span className="text-xs">
          {project.updatedAt.toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}
