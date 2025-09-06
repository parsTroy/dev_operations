"use client";

import { createContext, useContext, type ReactNode } from "react";
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
  const { isOpen, openModal, closeModal } = useTaskModal();

  return (
    <TaskModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && <NewTaskForm onClose={closeModal} projectId={projectId} />}
    </TaskModalContext.Provider>
  );
}
