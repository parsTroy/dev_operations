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
  highlightedTaskId?: string | null;
}

export function DroppableColumn({ id, title, tasks, projectId, highlightedTaskId }: DroppableColumnProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <div
        ref={setNodeRef}
        className={`min-h-[200px] p-4 rounded-lg border-2 border-dashed transition-colors ${
          isOver ? "border-blue-400 bg-blue-50" : "border-gray-200"
        }`}
      >
        <div className="space-y-3">
          {tasks.map((task) => (
            <DraggableTaskCard
              key={task.id}
              task={task}
              projectId={projectId}
              isHighlighted={highlightedTaskId === task.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
