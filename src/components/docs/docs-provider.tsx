"use client";

import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { api } from "~/trpc/react";
import { MarkdownEditor } from "./markdown-editor";
import { DocsList } from "./docs-list";

interface DocsProviderProps {
  children: ReactNode;
  projectId: string;
}

interface DocsContextType {
  editingDoc: { id: string; title: string; content: string } | null;
  setEditingDoc: (doc: { id: string; title: string; content: string } | null) => void;
  isCreating: boolean;
  setIsCreating: (creating: boolean) => void;
}

const DocsContext = createContext<DocsContextType | undefined>(undefined);

export function useDocsContext() {
  const context = useContext(DocsContext);
  if (!context) {
    throw new Error("useDocsContext must be used within a DocsProvider");
  }
  return context;
}

export function DocsProvider({ children, projectId }: DocsProviderProps) {
  const [editingDoc, setEditingDoc] = useState<{ id: string; title: string; content: string } | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const utils = api.useUtils();
  const createDoc = api.docs.create.useMutation({
    onSuccess: async () => {
      await utils.docs.invalidate();
      setIsCreating(false);
    },
  });
  const updateDoc = api.docs.update.useMutation({
    onSuccess: async () => {
      await utils.docs.invalidate();
      setEditingDoc(null);
    },
  });

  const handleSave = async (title: string, content: string) => {
    if (editingDoc) {
      // Update existing document
      await updateDoc.mutateAsync({
        id: editingDoc.id,
        title,
        content,
      });
    } else if (isCreating) {
      // Create new document
      await createDoc.mutateAsync({
        title,
        content,
        projectId,
      });
    }
  };

  const handleCancel = () => {
    setEditingDoc(null);
    setIsCreating(false);
  };

  const handleEditDoc = (doc: { id: string; title: string; content: string }) => {
    setEditingDoc(doc);
    setIsCreating(false);
  };

  const handleNewDoc = () => {
    setIsCreating(true);
    setEditingDoc(null);
  };

  return (
    <DocsContext.Provider
      value={{
        editingDoc,
        setEditingDoc,
        isCreating,
        setIsCreating,
      }}
    >
      {children}
      {(editingDoc || isCreating) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] max-w-6xl">
            <MarkdownEditor
              initialTitle={editingDoc?.title || ""}
              initialContent={editingDoc?.content || ""}
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={createDoc.isPending || updateDoc.isPending}
            />
          </div>
        </div>
      )}
      <div className="hidden">
        <DocsList
          projectId={projectId}
          onEditDoc={handleEditDoc}
          onNewDoc={handleNewDoc}
        />
      </div>
    </DocsContext.Provider>
  );
}
