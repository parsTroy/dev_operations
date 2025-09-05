"use client";

import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { SignOutButton } from "~/components/auth/sign-out-button";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { MarkdownEditor } from "~/components/docs/markdown-editor";
import { useEffect, useState } from "react";
import { use } from "react";

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
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-gray-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Documentation</h1>
              <p className="text-gray-600">Project documentation and notes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto h-[calc(100vh-140px)]">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b bg-white">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Documentation</h3>
              <Button onClick={handleNewDoc} className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                New Document
              </Button>
            </div>
          </div>

          {/* Docs List */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-12 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : docs?.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No documents yet</p>
                <Button onClick={handleNewDoc} className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
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
                        onClick={() => handleEditDoc(doc)}
                        className="h-8 w-8 p-0"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Editor Modal */}
          {(editingDoc || isCreating) && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
              <div className="bg-white rounded-lg shadow-xl w-[90vw] h-[90vh] max-w-6xl animate-in zoom-in-95 duration-200">
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
        </div>
      </main>
    </div>
  );
}


