"use client";

import { createContext, useContext, ReactNode } from "react";
import { useTaskModal } from "~/hooks/use-task-modal";
import { NewTaskForm } from "./new-task-form";

interface TaskModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export function useTaskModalContext() {
  const context = useContext(TaskModalContext);
  if (!context) {
    throw new Error("useTaskModalContext must be used within a TaskModalProvider");
  }
  return context;
}

interface TaskModalProviderProps {
  children: ReactNode;
  projectId: string;
}

export function TaskModalProvider({ children, projectId }: TaskModalProviderProps) {
  const modal = useTaskModal();

  return (
    <TaskModalContext.Provider value={modal}>
      {children}
      {modal.isOpen && <NewTaskForm onClose={modal.closeModal} projectId={projectId} />}
    </TaskModalContext.Provider>
  );
}
