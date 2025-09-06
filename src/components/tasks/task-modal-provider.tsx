"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { NewTaskForm } from "./new-task-form";
import { EditTaskModal } from "./edit-task-modal";

interface TaskModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  editingTask: any | null;
  setEditingTask: (task: any | null) => void;
}

const TaskModalContext = createContext<TaskModalContextType | undefined>(undefined);

export function useTaskModalContext() {
  const context = useContext(TaskModalContext);
  if (context === undefined) {
    throw new Error("useTaskModalContext must be used within a TaskModalProvider");
  }
  return context;
}

interface TaskModalProviderProps {
  children: ReactNode;
  projectId: string;
}

export function TaskModalProvider({ children, projectId }: TaskModalProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any | null>(null);

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setEditingTask(null);
  };

  return (
    <TaskModalContext.Provider
      value={{
        isOpen,
        openModal,
        closeModal,
        editingTask,
        setEditingTask,
      }}
    >
      {children}
      {isOpen && !editingTask && <NewTaskForm onClose={closeModal} projectId={projectId} />}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          projectId={projectId}
          onClose={closeModal}
        />
      )}
    </TaskModalContext.Provider>
  );
}
