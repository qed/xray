'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import type { RankedOpportunity } from '@/lib/types';
import { STATUS_TRANSITIONS, type PriorityStatus } from '@/lib/constants';

interface PriorityModalProps {
  opportunity: RankedOpportunity | null;
  onClose: () => void;
}

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

const STATUS_LABELS: Record<string, string> = {
  complete: 'Completed',
  in_progress: 'In Progress',
  proposed: 'Proposed',
  not_started: 'Not Started',
  rejected: 'Rejected',
  approved: 'Approved',
};

const ADVANCE_LABELS: Record<string, string> = {
  approved: 'Approve',
  rejected: 'Reject',
  in_progress: 'Start',
  complete: 'Complete',
  not_started: 'Begin',
};

export default function PriorityModal({ opportunity, onClose }: PriorityModalProps) {
  const params = useParams();
  const router = useRouter();
  const orgSlug = params?.orgSlug as string | undefined;
  const prefix = orgSlug ? `/org/${orgSlug}` : '';

  const [localStatus, setLocalStatus] = useState<string>(opportunity?.status ?? 'not_started');
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');

  // Reset local state when a different priority is opened (keyed on id, not object ref)
  useEffect(() => {
    if (opportunity) {
      setLocalStatus(opportunity.status);
      setError('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opportunity?.id]);

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
  const nextStatuses = STATUS_TRANSITIONS[localStatus as PriorityStatus] ?? [];

  async function handleAdvance(nextStatus: string) {
    setUpdating(true);
    setError('');
    const prevStatus = localStatus;
    // Optimistic update — approved auto-transitions to not_started at API layer
    const effectiveStatus = nextStatus === 'approved' ? 'not_started' : nextStatus;
    setLocalStatus(effectiveStatus);
    try {
      const res = await fetch(`/api/priorities/${opp.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) {
        const data = await res.json();
        setLocalStatus(prevStatus);
        setError(data.error || 'Failed to update status');
      } else {
        router.refresh();
      }
    } catch {
      setLocalStatus(prevStatus);
      setError('Network error — please try again');
    } finally {
      setUpdating(false);
    }
  }

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
            <Badge label="Effort" value={opp.effort} colorMap={effortColors} />
            <Badge label="Complexity" value={opp.complexity} colorMap={complexityColors} />
            <span className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border ${
              localStatus === 'complete' ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
              : localStatus === 'in_progress' ? 'bg-amber-100 text-amber-700 border-amber-200'
              : localStatus === 'proposed' ? 'bg-purple-100 text-purple-700 border-purple-200'
              : localStatus === 'rejected' ? 'bg-red-100 text-red-700 border-red-200'
              : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}>
              {STATUS_LABELS[localStatus] ?? localStatus}
            </span>
            {nextStatuses.length > 0 && nextStatuses.map((next) => (
              <button
                key={next}
                onClick={() => handleAdvance(next)}
                disabled={updating}
                className={`inline-flex items-center text-xs px-2.5 py-1 rounded-md border font-medium transition-colors disabled:opacity-40 ${
                  next === 'rejected'
                    ? 'border-red-200 text-red-600 hover:bg-red-50'
                    : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {updating ? 'Updating...' : (ADVANCE_LABELS[next] ?? next)} →
              </button>
            ))}
          </div>
          {error && (
            <p className="text-xs text-red-600 mt-1">{error}</p>
          )}

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
              href={`${prefix}/plan/${opp.departmentSlug}/priority-${opp.rank}`}
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
