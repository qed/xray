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
  Critical: 'bg-red-900/50 text-red-300 border-red-800',
  'Very High': 'bg-orange-900/50 text-orange-300 border-orange-800',
  High: 'bg-amber-900/50 text-amber-300 border-amber-800',
  Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-800',
  Low: 'bg-slate-800 text-slate-400 border-slate-700',
};

const effortColors: Record<string, string> = {
  Low: 'bg-emerald-900/50 text-emerald-300 border-emerald-800',
  Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-800',
  High: 'bg-red-900/50 text-red-300 border-red-800',
};

const complexityColors: Record<string, string> = {
  Low: 'bg-emerald-900/50 text-emerald-300 border-emerald-800',
  Medium: 'bg-yellow-900/50 text-yellow-300 border-yellow-800',
  'Medium-High': 'bg-orange-900/50 text-orange-300 border-orange-800',
  High: 'bg-red-900/50 text-red-300 border-red-800',
};

function Badge({ label, value, colorMap }: { label: string; value: string; colorMap: Record<string, string> }) {
  const colors = colorMap[value] ?? 'bg-slate-800 text-slate-400 border-slate-700';
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border ${colors}`}>
      <span className="text-slate-500">{label}:</span> {value}
    </span>
  );
}

export default function PriorityCard({ priority, milestoneStage, milestoneName }: PriorityCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-cyan-400/30 transition-colors">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex flex-col gap-3 cursor-pointer"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-cyan-400/10 text-cyan-400 text-sm font-bold shrink-0">
              {priority.rank}
            </span>
            <h4 className="text-white font-semibold">{priority.name}</h4>
          </div>
          <span className="text-slate-500 text-lg shrink-0">{expanded ? '\u25B2' : '\u25BC'}</span>
        </div>

        <div className="flex flex-wrap gap-2 ml-10">
          <Badge label="Impact" value={priority.impact} colorMap={impactColors} />
          <Badge label="Effort" value={priority.effort} colorMap={effortColors} />
          <Badge label="Complexity" value={priority.complexity} colorMap={complexityColors} />
          <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-md border bg-cyan-900/30 text-cyan-300 border-cyan-800">
            M{milestoneStage}: {milestoneName}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-800 px-5 pb-5 pt-4 ml-10 space-y-4 text-sm">
          {priority.whatToAutomate && (
            <div>
              <h5 className="text-cyan-400 font-medium mb-1">What to Automate</h5>
              <p className="text-slate-300">{priority.whatToAutomate}</p>
            </div>
          )}

          {priority.currentState && (
            <div>
              <h5 className="text-cyan-400 font-medium mb-1">Current State</h5>
              <p className="text-slate-300">{priority.currentState}</p>
            </div>
          )}

          {priority.whyItMatters && (
            <div>
              <h5 className="text-cyan-400 font-medium mb-1">Why It Matters</h5>
              <p className="text-slate-300">{priority.whyItMatters}</p>
            </div>
          )}

          {priority.estimatedTimeSavings && (
            <div>
              <h5 className="text-cyan-400 font-medium mb-1">Estimated Time Savings</h5>
              <p className="text-slate-300">{priority.estimatedTimeSavings}</p>
            </div>
          )}

          {priority.dependencies.length > 0 && (
            <div>
              <h5 className="text-cyan-400 font-medium mb-1">Dependencies</h5>
              <ul className="list-disc list-inside text-slate-300 space-y-1">
                {priority.dependencies.map((dep, idx) => (
                  <li key={idx}>{dep}</li>
                ))}
              </ul>
            </div>
          )}

          {priority.suggestedApproach && (
            <div>
              <h5 className="text-cyan-400 font-medium mb-1">Suggested Approach</h5>
              <p className="text-slate-300">{priority.suggestedApproach}</p>
            </div>
          )}

          {priority.successCriteria && (
            <div>
              <h5 className="text-cyan-400 font-medium mb-1">Success Criteria</h5>
              <p className="text-slate-300">{priority.successCriteria}</p>
            </div>
          )}

          <div className="pt-2">
            <Link
              href={`/plan/${priority.departmentSlug}/priority-${priority.rank}`}
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors"
            >
              View Implementation Plan &rarr;
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
