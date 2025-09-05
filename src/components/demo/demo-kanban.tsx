"use client";

import { useState } from "react";
import { CheckSquare, Clock, CheckCircle } from "lucide-react";

interface DemoTask {
  id: string;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  priority: "LOW" | "MEDIUM" | "HIGH";
  assignee: { name: string };
  dueDate: Date;
}

interface DemoKanbanProps {
  tasks: DemoTask[];
}

export function DemoKanban({ tasks }: DemoKanbanProps) {
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  const tasksByStatus = {
    TODO: tasks.filter((task) => task.status === "TODO"),
    IN_PROGRESS: tasks.filter((task) => task.status === "IN_PROGRESS"),
    DONE: tasks.filter((task) => task.status === "DONE"),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const TaskCard = ({ task }: { task: DemoTask }) => (
    <div
      className={`bg-gray-50 rounded-lg p-3 border hover:shadow-sm transition-shadow cursor-move ${
        draggedTask === task.id ? "opacity-50" : ""
      }`}
      draggable
      onDragStart={() => setDraggedTask(task.id)}
      onDragEnd={() => setDraggedTask(null)}
    >
      <div className="flex items-center gap-2 mb-1">
        <CheckSquare className="h-3 w-3 text-gray-400" />
        <h4 className="font-medium text-gray-900 text-sm">{task.title}</h4>
      </div>
      {task.description && (
        <p className="text-gray-600 text-xs mt-1 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
          {task.priority}
        </span>
        <div className="flex items-center gap-1">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
            {task.assignee.name.charAt(0)}
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Due: {task.dueDate.toLocaleDateString()}
      </p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* To Do Column */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-gray-600" />
            <h3 className="font-semibold text-gray-900">To Do</h3>
          </div>
          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
            {tasksByStatus.TODO.length}
          </span>
        </div>
        <div className="space-y-3 min-h-[200px]">
          {tasksByStatus.TODO.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasksByStatus.TODO.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No tasks
            </div>
          )}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">In Progress</h3>
          </div>
          <span className="bg-blue-100 text-blue-600 text-xs font-medium px-2 py-1 rounded-full">
            {tasksByStatus.IN_PROGRESS.length}
          </span>
        </div>
        <div className="space-y-3 min-h-[200px]">
          {tasksByStatus.IN_PROGRESS.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasksByStatus.IN_PROGRESS.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No tasks
            </div>
          )}
        </div>
      </div>

      {/* Done Column */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Done</h3>
          </div>
          <span className="bg-green-100 text-green-600 text-xs font-medium px-2 py-1 rounded-full">
            {tasksByStatus.DONE.length}
          </span>
        </div>
        <div className="space-y-3 min-h-[200px]">
          {tasksByStatus.DONE.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {tasksByStatus.DONE.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No tasks
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
