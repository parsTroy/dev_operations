"use client";

import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Button } from "~/components/ui/button";
import { Edit, MoreVertical, GripVertical } from "lucide-react";
import { EditTaskModal } from "./edit-task-modal";

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
}

export function DraggableTaskCard({ task, projectId }: DraggableTaskCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`bg-gray-50 rounded-lg p-3 border hover:shadow-sm transition-shadow ${
          isDragging ? "opacity-50" : ""
        }`}
      >
        <div className="flex items-start justify-between">
          {/* Draggable content area */}
          <div 
            className="flex-1 min-w-0 cursor-move"
            {...listeners}
            {...attributes}
          >
            <div className="flex items-center gap-2 mb-1">
              <GripVertical className="h-3 w-3 text-gray-400" />
              <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
            </div>
            {task.description && (
              <p className="text-gray-600 text-xs mt-1 line-clamp-2">{task.description}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <span className={`text-xs px-2 py-1 rounded-full ${
                task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                'bg-green-100 text-green-800'
              }`}>
                {task.priority}
              </span>
              {task.assignee && (
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {task.assignee.name?.charAt(0) || '?'}
                  </div>
                </div>
              )}
            </div>
            {task.dueDate && (
              <p className="text-xs text-gray-500 mt-1">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
          </div>
          
          {/* Non-draggable menu area */}
          <div className="relative ml-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
              className="h-6 w-6 p-0"
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
                    setShowEditModal(true);
                    setShowMenu(false);
                  }}
                  className="w-full justify-start text-xs"
                >
                  <Edit className="h-3 w-3 mr-2" />
                  Edit
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditTaskModal
          task={task}
          projectId={projectId}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* Overlay to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-5"
          onClick={() => setShowMenu(false)}
        />
      )}
    </>
  );
}
