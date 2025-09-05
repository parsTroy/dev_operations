"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { X, Plus } from "lucide-react";

interface NewProjectFormProps {
  onClose: () => void;
}

export function NewProjectForm({ onClose }: NewProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const utils = api.useUtils();
  const createProject = api.projects.create.useMutation({
    onSuccess: async () => {
      await utils.projects.invalidate();
      onClose();
      router.refresh();
    },
    onError: (error) => {
      console.error("Error creating project:", error);
      setIsSubmitting(false);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    setIsSubmitting(true);
    const tagArray = tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    try {
      await createProject.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        tags: tagArray,
      });
    } catch (error) {
      console.error("Error creating project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Create New Project</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Project Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="React, TypeScript, AI (comma-separated)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Separate tags with commas
            </p>
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
              disabled={isSubmitting || !name.trim() || !description.trim()}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                "Creating..."
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Project
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}