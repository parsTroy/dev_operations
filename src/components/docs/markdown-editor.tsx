"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { X, Save } from "lucide-react";

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
      <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-900">Document Editor</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={!title.trim() || isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Document Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter document title"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content (Markdown)
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[calc(100vh-400px)] min-h-[400px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
              placeholder="Write your document content in Markdown..."
            />
          </div>

          <div className="text-sm text-gray-500">
            <p>You can use Markdown syntax:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li><code>**bold**</code> for <strong>bold text</strong></li>
              <li><code>*italic*</code> for <em>italic text</em></li>
              <li><code># Heading</code> for headings</li>
              <li><code>`code`</code> for inline code</li>
              <li><code>- item</code> for bullet lists</li>
              <li><code>1. item</code> for numbered lists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
