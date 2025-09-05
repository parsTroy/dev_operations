"use client";

import { useDroppable } from "@dnd-kit/core";
import { DraggableTaskCard } from "./draggable-task-card";

interface DroppableColumnProps {
  id: string;
  title: string;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: Date | null;
    assignedTo: string | null;
    assignee: { name: string | null } | null;
  }>;
  projectId: string;
}

export function DroppableColumn({ id, title, tasks, projectId }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`space-y-3 min-h-[200px] ${
          isOver ? "bg-blue-50 border-2 border-blue-300 border-dashed rounded-lg" : ""
        }`}
      >
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            projectId={projectId}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center text-gray-500 text-sm py-8">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
}
