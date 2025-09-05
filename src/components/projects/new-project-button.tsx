"use client";

import { Button } from "~/components/ui/button";
import { useProjectModalContext } from "./project-modal-provider";
import { Plus } from "lucide-react";

export function NewProjectButton() {
  const { openModal } = useProjectModalContext();

  return (
    <Button onClick={openModal} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      New Project
    </Button>
  );
}