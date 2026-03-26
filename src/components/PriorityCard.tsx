'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { AutomationPriority } from '@/lib/types';

interface PriorityCardProps {
  priority: AutomationPriority;
  milestoneStage: number;
  milestoneName: string;
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

export default function PriorityCard({ priority, milestoneStage, milestoneName }: PriorityCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden hover:border-emerald-300 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex flex-col gap-3 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 text-sm font-bold shrink-0">
              {priority.rank}
            </span>
            <h4 className="text-slate-900 font-semibold">{priority.name}</h4>
          </div>
          <span className="text-slate-400 text-lg shrink-0">{expanded ? '\u25B2' : '\u25BC'}</span>
        </div>

        <div className="flex flex-wrap gap-2 ml-10">
          <Badge label="Impact" value={priority.impact} colorMap={impactColors} />
          <Badge label="Effort" value={priority.effort} colorMap={effortColors} />
          <Badge label="Complexity" value={priority.complexity} colorMap={complexityColors} />
          <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-md border bg-emerald-100 text-emerald-700 border-emerald-200">
            M{milestoneStage}: {milestoneName}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-200 px-5 pb-5 pt-4 ml-10 space-y-4 text-sm">
          {priority.whatToAutomate && (
            <div>
              <h5 className="text-emerald-600 font-medium mb-1">What to Automate</h5>
              <p className="text-slate-600">{priority.whatToAutomate}</p>
            </div>
          )}

          {priority.currentState && (
            <div>
              <h5 className="text-emerald-600 font-medium mb-1">Current State</h5>
              <p className="text-slate-600">{priority.currentState}</p>
            </div>
          )}

          {priority.whyItMatters && (
            <div>
              <h5 className="text-emerald-600 font-medium mb-1">Why It Matters</h5>
              <p className="text-slate-600">{priority.whyItMatters}</p>
            </div>
          )}

          {priority.estimatedTimeSavings && (
            <div>
              <h5 className="text-emerald-600 font-medium mb-1">Estimated Time Savings</h5>
              <p className="text-slate-600">{priority.estimatedTimeSavings}</p>
            </div>
          )}

          {priority.dependencies.length > 0 && (
            <div>
              <h5 className="text-emerald-600 font-medium mb-1">Dependencies</h5>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                {priority.dependencies.map((dep, idx) => (
                  <li key={idx}>{dep}</li>
                ))}
              </ul>
            </div>
          )}

          {priority.suggestedApproach && (
            <div>
              <h5 className="text-emerald-600 font-medium mb-1">Suggested Approach</h5>
              <p className="text-slate-600">{priority.suggestedApproach}</p>
            </div>
          )}

          {priority.successCriteria && (
            <div>
              <h5 className="text-emerald-600 font-medium mb-1">Success Criteria</h5>
              <p className="text-slate-600">{priority.successCriteria}</p>
            </div>
          )}

          <div className="pt-2">
            <Link
              href={`/plan/${priority.departmentSlug}/priority-${priority.rank}`}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
            >
              View Implementation Plan &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
