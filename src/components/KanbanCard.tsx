'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RankedOpportunity } from '@/lib/types';
import { usePriorityModal } from './PriorityModalContext';
import { useRole } from './RoleContext';
import { MILESTONE_STAGES } from '@/lib/constants';

interface KanbanCardProps {
  opportunity: RankedOpportunity;
}

const departmentColors: Record<string, string> = {
  accounting: 'bg-violet-100 text-violet-700',
  'sales-operations': 'bg-sky-100 text-sky-700',
};

const complexityColors: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  'Medium-High': 'bg-orange-100 text-orange-700',
  High: 'bg-red-100 text-red-700',
};

export default function KanbanCard({ opportunity }: KanbanCardProps) {
  const { openModal } = usePriorityModal();
  const role = useRole();
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  const deptColor = departmentColors[opportunity.departmentSlug] ?? 'bg-slate-100 text-slate-600';
  const complexColor = complexityColors[opportunity.complexity] ?? 'bg-slate-100 text-slate-500';

  const currentStage = opportunity.milestoneStage;
  const canAdvance = currentStage < 3;
  const canRevert = currentStage > 0;

  async function updateStage(newStage: number) {
    setUpdating(true);
    try {
      const res = await fetch(`/api/milestones/${opportunity.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage: newStage }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div
      className="bg-white border border-slate-200 rounded-lg p-3 hover:border-emerald-300 hover:bg-slate-50 transition-colors cursor-pointer"
      onClick={() => openModal(opportunity)}
    >
      {/* Name */}
      <p className="text-sm font-medium text-slate-900 leading-snug mb-2 line-clamp-2">
        {opportunity.name}
      </p>

      {/* Department tag */}
      <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded ${deptColor} mb-2`}>
        {opportunity.departmentName}
      </span>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`text-[10px] px-1.5 py-0.5 rounded ${complexColor}`}>
          {opportunity.complexity}
        </span>
        <span className="ml-auto text-[10px] font-semibold text-emerald-600">
          {opportunity.score}
        </span>
      </div>

      {/* Stage controls (owner only) */}
      {role === 'owner' && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => canRevert && updateStage(currentStage - 1)}
            disabled={!canRevert || updating}
            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ← Back
          </button>
          <span className="text-[10px] text-slate-400">
            {MILESTONE_STAGES[currentStage]?.name ?? 'Unknown'}
          </span>
          <button
            onClick={() => canAdvance && updateStage(currentStage + 1)}
            disabled={!canAdvance || updating}
            className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Advance →
          </button>
        </div>
      )}
    </div>
  );
}
