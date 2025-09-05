"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Plus, FileText, Edit, Trash2 } from "lucide-react";

interface DocsListProps {
  projectId: string;
  onEditDoc: (doc: { id: string; title: string; content: string }) => void;
  onNewDoc: () => void;
}

export function DocsList({ projectId, onEditDoc, onNewDoc }: DocsListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");

  const utils = api.useUtils();
  const { data: docs, isLoading } = api.docs.getByProject.useQuery({ projectId });
  const createDoc = api.docs.create.useMutation({
    onSuccess: async () => {
      await utils.docs.invalidate();
      setIsCreating(false);
      setNewTitle("");
    },
  });
  const deleteDoc = api.docs.delete.useMutation({
    onSuccess: async () => {
      await utils.docs.invalidate();
    },
  });

  const handleCreateDoc = async () => {
    if (newTitle.trim()) {
      await createDoc.mutateAsync({
        title: newTitle.trim(),
        content: "",
        projectId,
      });
    }
  };

  const handleDeleteDoc = async (docId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDoc.mutateAsync({ id: docId });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
          <Button onClick={onNewDoc} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Document
          </Button>
        </div>
      </div>

      {/* Docs List */}
      <div className="flex-1 overflow-y-auto p-4">
        {docs?.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No documents yet</p>
            <Button onClick={onNewDoc} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create First Document
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {docs?.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 bg-white rounded-lg border hover:shadow-sm transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.title}</h4>
                    <p className="text-sm text-gray-500">
                      Updated {new Date(doc.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditDoc(doc)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
