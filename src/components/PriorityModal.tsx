'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import type { RankedOpportunity } from '@/lib/types';

interface PriorityModalProps {
  opportunity: RankedOpportunity | null;
  onClose: () => void;
}

const impactColors: Record<string, string> = {
  Critical: 'bg-red-100 text-red-700 border-red-200',
  'Very High': 'bg-orange-100 text-orange-700 border-orange-200',
  High: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Medium: 'bg-emerald-100 text-emerald-700 border-emerald-200',
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

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-emerald-600 font-medium text-sm mb-1">{title}</h4>
      <div className="text-slate-600 text-sm">{children}</div>
    </div>
  );
}

export default function PriorityModal({ opportunity, onClose }: PriorityModalProps) {
  useEffect(() => {
    if (!opportunity) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [opportunity, onClose]);

  if (!opportunity) return null;

  const opp = opportunity;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-start justify-between gap-4 rounded-t-xl">
          <div className="flex items-center gap-3 min-w-0">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 text-lg font-bold shrink-0">
              {opp.rank}
            </span>
            <div className="min-w-0">
              <h3 className="text-xl font-bold text-slate-900 leading-tight">{opp.name}</h3>
              <p className="text-slate-500 text-sm">{opp.departmentName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors text-2xl leading-none shrink-0 cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge label="Impact" value={opp.impact} colorMap={impactColors} />
            <Badge label="Effort" value={opp.effort} colorMap={effortColors} />
            <Badge label="Complexity" value={opp.complexity} colorMap={complexityColors} />
            <span className="inline-flex items-center text-xs px-2.5 py-1 rounded-md border bg-emerald-100 text-emerald-700 border-emerald-200">
              M{opp.milestoneStage}: {opp.milestoneName}
            </span>
          </div>

          {opp.whatToAutomate && (
            <Section title="What to Automate">
              <p>{opp.whatToAutomate}</p>
            </Section>
          )}

          {opp.currentState && (
            <Section title="Current State">
              <p>{opp.currentState}</p>
            </Section>
          )}

          {opp.whyItMatters && (
            <Section title="Why It Matters">
              <p>{opp.whyItMatters}</p>
            </Section>
          )}

          {opp.estimatedTimeSavings && (
            <Section title="Estimated Time Savings">
              <p>{opp.estimatedTimeSavings}</p>
            </Section>
          )}

          {opp.dependencies.length > 0 && (
            <Section title="Dependencies">
              <ul className="list-disc list-inside space-y-1">
                {opp.dependencies.map((dep, idx) => (
                  <li key={idx}>{dep}</li>
                ))}
              </ul>
            </Section>
          )}

          {opp.suggestedApproach && (
            <Section title="Suggested Approach">
              <p className="whitespace-pre-line">{opp.suggestedApproach}</p>
            </Section>
          )}

          {opp.successCriteria && (
            <Section title="Success Criteria">
              <p>{opp.successCriteria}</p>
            </Section>
          )}

          {/* Implementation Plan link */}
          <div className="pt-2 border-t border-slate-100">
            <Link
              href={`/plan/${opp.departmentSlug}/priority-${opp.rank}`}
              className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors"
              onClick={onClose}
            >
              View Implementation Plan &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
