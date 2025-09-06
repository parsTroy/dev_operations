"use client";

import { useState, useEffect } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { X, User, AlertCircle } from "lucide-react";

interface EditTaskModalProps {
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
  onClose: () => void;
}

export function EditTaskModal({ task, projectId, onClose }: EditTaskModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH",
    dueDate: "",
    assignedTo: "",
  });

  // Initialize form data when task changes
  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description || "",
      priority: task.priority,
      dueDate: task.dueDate ? task.dueDate.toISOString().split('T')[0] : "",
      assignedTo: task.assignedTo || "",
    });
  }, [task]);

  const utils = api.useUtils();
  const updateTask = api.tasks.update.useMutation({
    onSuccess: async () => {
      await utils.tasks.getByProject.invalidate({ projectId });
      onClose();
    },
  });

  const deleteTask = api.tasks.delete.useMutation({
    onSuccess: async () => {
      await utils.tasks.getByProject.invalidate({ projectId });
      onClose();
    },
  });

  // Get project members for assignment dropdown
  const { data: project } = api.projects.getById.useQuery({ id: projectId });
  const teamMembers = project?.members || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    await updateTask.mutateAsync({
      id: task.id,
      title: formData.title.trim(),
      description: formData.description.trim() || undefined,
      priority: formData.priority,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      assignedTo: formData.assignedTo || undefined,
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      await deleteTask.mutateAsync({ id: task.id });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-lg shadow-xl w-[90vw] max-w-md animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Edit Task</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter task description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-1">
              Assign to Team Member
            </label>
            <div className="relative">
              <select
                id="assignedTo"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Unassigned</option>
                {teamMembers.map((member) => (
                  <option key={member.id} value={member.userId}>
                    {member.user.name || member.user.email || 'Unknown User'}
                  </option>
                ))}
              </select>
              <User className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
            {teamMembers.length === 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm text-amber-600">
                <AlertCircle className="h-4 w-4" />
                <span>No team members available. Add team members to assign tasks.</span>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={updateTask.isPending || deleteTask.isPending}
              className="text-red-600 border-red-300 hover:bg-red-50"
            >
              Delete Task
            </Button>
            <div className="flex space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateTask.isPending || deleteTask.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.title.trim() || updateTask.isPending || deleteTask.isPending}
              >
                {updateTask.isPending ? "Updating..." : "Update Task"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
