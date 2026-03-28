'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RankedOpportunity } from '@/lib/types';
import GapCard from './GapCard';

interface GapCardListProps {
  priorities: RankedOpportunity[];
  totalPriorities: number;
}

export default function GapCardList({ priorities, totalPriorities }: GapCardListProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = priorities.length;

  if (total === 0) return null;

  const current = priorities[currentIndex];

  function handleSaved() {
    router.refresh();
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  const overallComplete = totalPriorities - total;
  const percent = Math.round((overallComplete / totalPriorities) * 100);

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">
            {overallComplete} of {totalPriorities} priorities are complete
          </span>
          <span className="text-sm font-medium text-slate-700">{percent}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Current card */}
      <GapCard
        key={current.id}
        priority={current}
        index={currentIndex}
        total={total}
        onSaved={handleSaved}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
