"use client";

import { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "~/components/ui/button";
import { Save, X } from "lucide-react";

interface MarkdownEditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function MarkdownEditor({
  initialTitle = "",
  initialContent = "",
  onSave,
  onCancel,
  isSaving = false,
}: MarkdownEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSave = () => {
    if (title.trim()) {
      onSave(title.trim(), content);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title..."
          className="text-lg font-semibold bg-transparent border-none outline-none flex-1 mr-4"
        />
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || !title.trim()}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isSaving}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <MDEditor
          value={content}
          onChange={(val) => setContent(val || "")}
          data-color-mode="light"
          height="100%"
        />
      </div>
    </div>
  );
}
