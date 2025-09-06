"use client";

import { useDraggable } from "@dnd-kit/core";
import { Button } from "~/components/ui/button";
import { Edit, User, Calendar, AlertCircle } from "lucide-react";
import { useTaskModalContext } from "~/components/tasks/task-modal-provider";

interface DraggableTaskCardProps {
  task: {
    id: string;
    title: string;
    description: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: Date | null;
    assignedTo: string | null;
    assignee: { name: string | null } | null;
  };
  projectId: string;
  isHighlighted?: boolean;
}

export function DraggableTaskCard({ task, projectId, isHighlighted = false }: DraggableTaskCardProps) {
  const { openModal, setEditingTask } = useTaskModalContext();
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800 border-red-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setEditingTask(task);
    openModal();
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`bg-white rounded-lg p-3 border shadow-sm hover:shadow-md transition-all duration-300 cursor-grab active:cursor-grabbing group relative ${
        isDragging ? "opacity-50" : ""
      } ${
        isHighlighted ? "ring-2 ring-blue-500 bg-blue-50 animate-pulse" : ""
      }`}
    >
      {/* Edit button - positioned absolutely outside draggable area */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleEditClick}
        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity z-10"
      >
        <Edit className="h-3 w-3" />
      </Button>

      {/* Draggable content area */}
      <div className="pr-8">
        <div className="mb-2">
          <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{task.title}</h4>
        </div>

        {task.description && (
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs ${
                isOverdue ? "text-red-600" : "text-gray-500"
              }`}>
                <Calendar className="h-3 w-3" />
                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Assigned Team Member - Always show this section for consistency */}
        <div className="mt-2 flex items-center gap-2">
          <User className="h-3 w-3 text-gray-400" />
          <span className="text-xs text-gray-600">
            {task.assignee ? (task.assignee.name || 'Unknown User') : 'Unassigned'}
          </span>
        </div>

        {/* Overdue Warning */}
        {isOverdue && (
          <div className="mt-2 flex items-center gap-1 text-xs text-red-600">
            <AlertCircle className="h-3 w-3" />
            <span>Overdue</span>
          </div>
        )}
      </div>
    </div>
  );
}
