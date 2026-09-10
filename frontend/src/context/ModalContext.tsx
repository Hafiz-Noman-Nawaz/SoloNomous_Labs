'use client';

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isProjectModalOpen: boolean;
  selectedService?: string;
  openProjectModal: (service?: string) => void;
  closeProjectModal: () => void;
}

const ModalContext = createContext<ModalContextType>({
  isProjectModalOpen: false,
  openProjectModal: () => {},
  closeProjectModal: () => {}
});

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<string | undefined>(undefined);

  const openProjectModal = (service?: string) => {
    setSelectedService(service);
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setSelectedService(undefined);
  };

  return (
    <ModalContext.Provider
      value={{
        isProjectModalOpen,
        selectedService,
        openProjectModal,
        closeProjectModal
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
