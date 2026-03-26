'use client';

import type { RankedOpportunity } from '@/lib/types';
import { usePriorityModal } from './PriorityModalContext';

interface PriorityCardProps {
  opportunity: RankedOpportunity;
}

const impactColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  'Very High': 'bg-orange-100 text-orange-700 border-orange-200',
  High: 'bg-amber-100 text-amber-700 border-amber-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low: 'bg-slate-100 text-slate-600 border-slate-200',
};

const effortColors: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  High: 'bg-red-100 text-red-700 border-red-200',
};

const complexityColors: Record<string, string> = {
  Low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Medium-High': 'bg-orange-100 text-orange-700 border-orange-200',
  High: 'bg-red-100 text-red-700 border-red-200',
};

function Badge({ label, value, colorMap }: { label: string; value: string; colorMap: Record<string, string> }) {
  const colors = colorMap[value] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border ${colors}`}>
      <span className="text-slate-400">{label}:</span> {value}
    </span>
  );
}

export default function PriorityCard({ opportunity }: PriorityCardProps) {
  const { openModal } = usePriorityModal();

  return (
    <div
      className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-colors cursor-pointer"
      onClick={() => openModal(opportunity)}
    >
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold shrink-0">
            {opportunity.rank}
          </span>
          <h4 className="text-slate-900 font-semibold">{opportunity.name}</h4>
        </div>

        <div className="flex flex-wrap gap-2 ml-10">
          <Badge label="Impact" value={opportunity.impact} colorMap={impactColors} />
          <Badge label="Effort" value={opportunity.effort} colorMap={effortColors} />
          <Badge label="Complexity" value={opportunity.complexity} colorMap={complexityColors} />
          <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-md border bg-emerald-100 text-emerald-700 border-emerald-200">
            M{opportunity.milestoneStage}: {opportunity.milestoneName}
          </span>
        </div>
      </div>
    </div>
  );
}
