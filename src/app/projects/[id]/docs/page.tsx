"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { ArrowLeft, FileText, Edit, Trash2, Eye, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { use } from "react";
import { MarkdownEditor } from "~/components/docs/markdown-editor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface DocsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function DocsPage({ params }: DocsPageProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { id } = use(params);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return <DocsPageContent projectId={id} />;
}

function DocsPageContent({ projectId }: { projectId: string }) {
  const { data: session } = useSession();
  const [editingDoc, setEditingDoc] = useState<{ id: string; title: string; content: string } | null>(null);
  const [viewingDoc, setViewingDoc] = useState<{ id: string; title: string; content: string } | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: project } = api.projects.getById.useQuery({ id: projectId });
  const { data: docs, isLoading } = api.docs.getByProject.useQuery({ projectId });

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
  const deleteDoc = api.docs.delete.useMutation({
    onSuccess: async () => {
      await utils.docs.invalidate();
      setViewingDoc(null);
    },
  });

  const handleSave = async (title: string, content: string) => {
    if (editingDoc) {
      await updateDoc.mutateAsync({
        id: editingDoc.id,
        title,
        content,
      });
    } else if (isCreating) {
      await createDoc.mutateAsync({
        title,
        content,
        projectId,
      });
    }
  };

  const handleCancel = () => {
    setEditingDoc(null);
    setViewingDoc(null);
    setIsCreating(false);
  };

  const handleEditDoc = (doc: { id: string; title: string; content: string }) => {
    setEditingDoc(doc);
    setViewingDoc(null);
    setIsCreating(false);
  };

  const handleViewDoc = (doc: { id: string; title: string; content: string }) => {
    setViewingDoc(doc);
    setEditingDoc(null);
    setIsCreating(false);
  };

  const handleDeleteDoc = async (docId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDoc.mutateAsync({ id: docId });
    }
  };

  const handleNewDoc = () => {
    setIsCreating(true);
    setEditingDoc(null);
    setViewingDoc(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href={`/projects/${projectId}`}>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Project
                </Button>
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">dev_operations</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                Welcome, {session?.user.name || session?.user.email}
              </span>
              <SignOutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Project Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-6 w-6 text-gray-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
                <p className="text-gray-600">Project documentation and notes</p>
              </div>
            </div>
            <Button onClick={handleNewDoc} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Document
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        ) : docs?.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first document.</p>
            <Button onClick={handleNewDoc} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create First Document
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs?.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div>
                      <h3 className="font-medium text-gray-900">{doc.title}</h3>
                      <p className="text-sm text-gray-500">
                        Updated {new Date(doc.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {doc.content.substring(0, 150)}...
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDoc(doc)}
                      className="flex items-center gap-1"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditDoc(doc)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteDoc(doc.id)}
                    className="text-red-600 border-red-300 hover:bg-red-50 flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Editor Modal */}
      {(editingDoc || isCreating) && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] max-w-6xl animate-in zoom-in-95 duration-200 flex flex-col">
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

      {/* Viewer Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] max-w-6xl animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
              <h2 className="text-xl font-semibold text-gray-900">{viewingDoc.title}</h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditDoc(viewingDoc)}
                  className="flex items-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="h-full overflow-y-auto p-6">
                <div className="prose prose-headings:font-semibold prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-8 prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6 prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4 prose-p:mb-4 prose-strong:font-semibold prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-gray-100 prose-pre:p-4 prose-pre:rounded prose-pre:overflow-x-auto prose-ul:mb-4 prose-ol:mb-4 prose-li:mb-1 max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {viewingDoc.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



