'use client';

import React, { createContext, useContext, useState } from 'react';
import { SIBLING_CHILDREN, ParentChildProfile } from '@/data/portalParentData';

interface ParentContextType {
  selectedChild: ParentChildProfile;
  setSelectedChildId: (id: string) => void;
  siblings: ParentChildProfile[];
}

const ParentContext = createContext<ParentContextType | undefined>(undefined);

export function ParentProvider({ children }: { children: React.ReactNode }) {
  const [selectedChildId, setSelectedChildId] = useState<string>('child-aarav');

  const selectedChild =
    SIBLING_CHILDREN.find((c) => c.id === selectedChildId) || SIBLING_CHILDREN[0];

  return (
    <ParentContext.Provider
      value={{
        selectedChild,
        setSelectedChildId,
        siblings: SIBLING_CHILDREN,
      }}
    >
      {children}
    </ParentContext.Provider>
  );
}

export function useParent() {
  const context = useContext(ParentContext);
  if (!context) {
    throw new Error('useParent must be used within a ParentProvider');
  }
  return context;
}
