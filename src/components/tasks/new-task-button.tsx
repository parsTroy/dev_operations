"use client";

import { Button } from "~/components/ui/button";
import { useTaskModalContext } from "./task-modal-provider";
import { Plus } from "lucide-react";

export function NewTaskButton() {
  const { openModal } = useTaskModalContext();

  return (
    <Button onClick={openModal} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      Add Task
    </Button>
  );
}
