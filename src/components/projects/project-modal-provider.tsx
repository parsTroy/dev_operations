"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useProjectModal } from "~/hooks/use-project-modal";
import { NewProjectForm } from "./new-project-form";

interface ProjectModalContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const ProjectModalContext = createContext<ProjectModalContextType | undefined>(undefined);

export function useProjectModalContext() {
  const context = useContext(ProjectModalContext);
  if (!context) {
    throw new Error("useProjectModalContext must be used within a ProjectModalProvider");
  }
  return context;
}

interface ProjectModalProviderProps {
  children: ReactNode;
}

export function ProjectModalProvider({ children }: ProjectModalProviderProps) {
  const { isOpen, openModal, closeModal } = useProjectModal();

  return (
    <ProjectModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      {isOpen && <NewProjectForm onClose={closeModal} />}
    </ProjectModalContext.Provider>
  );
}