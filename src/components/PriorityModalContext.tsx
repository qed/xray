'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { RankedOpportunity } from '@/lib/types';
import PriorityModal from './PriorityModal';

interface PriorityModalContextValue {
  openModal: (opportunity: RankedOpportunity) => void;
}

const PriorityModalContext = createContext<PriorityModalContextValue | null>(null);

export function usePriorityModal() {
  const ctx = useContext(PriorityModalContext);
  if (!ctx) throw new Error('usePriorityModal must be used within PriorityModalProvider');
  return ctx;
}

export function PriorityModalProvider({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState<RankedOpportunity | null>(null);

  const openModal = useCallback((opp: RankedOpportunity) => {
    setSelected(opp);
  }, []);

  const closeModal = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <PriorityModalContext.Provider value={{ openModal }}>
      {children}
      <PriorityModal opportunity={selected} onClose={closeModal} />
    </PriorityModalContext.Provider>
  );
}
