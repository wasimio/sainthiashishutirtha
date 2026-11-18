'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import AdmissionModal from './AdmissionModal';

interface AdmissionModalContextType {
  openAdmissionModal: (defaultGrade?: string) => void;
  closeAdmissionModal: () => void;
  isModalOpen: boolean;
  defaultGrade?: string;
}

const AdmissionModalContext = createContext<AdmissionModalContextType | undefined>(undefined);

export function AdmissionModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [defaultGrade, setDefaultGrade] = useState<string | undefined>(undefined);

  const openAdmissionModal = useCallback((grade?: string) => {
    setDefaultGrade(grade);
    setIsOpen(true);
  }, []);

  const closeAdmissionModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <AdmissionModalContext.Provider
      value={{
        openAdmissionModal,
        closeAdmissionModal,
        isModalOpen: isOpen,
        defaultGrade,
      }}
    >
      {children}
      <AdmissionModal
        isOpen={isOpen}
        onClose={closeAdmissionModal}
        defaultGrade={defaultGrade}
      />
    </AdmissionModalContext.Provider>
  );
}

export function useAdmissionModal(): AdmissionModalContextType {
  const context = useContext(AdmissionModalContext);
  if (!context) {
    return {
      openAdmissionModal: () => {},
      closeAdmissionModal: () => {},
      isModalOpen: false,
      defaultGrade: undefined,
    };
  }
  return context;
}
