'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import type { DbDepartment, DbTeamMember, RankedOpportunity } from '@/lib/types';
import { generateDepartmentPrompt } from '@/lib/generate-prompt';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface DepartmentGaps {
  department: DbDepartment;
  teamMembers: DbTeamMember[];
  priorities: RankedOpportunity[];
}

interface Props {
  departments: DepartmentGaps[];
}

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STEPS = [
  { label: 'See Gaps', short: '1' },
  { label: 'Copy Prompt', short: '2' },
  { label: 'Run in Cowork', short: '3' },
  { label: 'Get Output', short: '4' },
  { label: 'Upload to X-Ray', short: '5' },
  { label: 'Review', short: '6' },
];

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  what_to_automate: 'What to Automate',
  current_state: 'Current State',
  why_it_matters: 'Why It Matters',
  estimated_time_savings: 'Estimated Time Savings',
  complexity: 'Complexity',
  dependencies: 'Dependencies',
  suggested_approach: 'Suggested Approach',
  success_criteria: 'Success Criteria',
};

const DB_TO_PROP: Record<string, keyof RankedOpportunity> = {
  name: 'name',
  what_to_automate: 'whatToAutomate',
  current_state: 'currentState',
  why_it_matters: 'whyItMatters',
  estimated_time_savings: 'estimatedTimeSavings',
  complexity: 'complexity',
  dependencies: 'dependencies',
  suggested_approach: 'suggestedApproach',
  success_criteria: 'successCriteria',
};

const DISPLAY_ORDER = [
  'what_to_automate',
  'current_state',
  'why_it_matters',
  'estimated_time_savings',
  'complexity',
  'dependencies',
  'suggested_approach',
  'success_criteria',
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function readField(p: RankedOpportunity, dbCol: string): string {
  const prop = DB_TO_PROP[dbCol];
  if (!prop) return '';
  const val = p[prop];
  if (Array.isArray(val)) return val.join(', ');
  if (typeof val === 'string') return val;
  return String(val ?? '');
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function WorkflowBar({ step, orgSlug }: { step: number; orgSlug: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-slate-900">Workflow Progress</span>
      </div>
      <div className="flex items-center">
        {STEPS.map((s, i) => {
          const isActive = i === step;
          const isCompleted = i < step;
          const isUpload = i === 4;
          return (
            <div key={i} className="flex items-center flex-1 last:flex-initial">
              <div className="flex flex-col items-center">
                {isUpload ? (
                  <Link href={`/org/${orgSlug}/upload`}>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-600'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      {isCompleted ? '✓' : s.short}
                    </div>
                  </Link>
                ) : (
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : s.short}
                  </div>
                )}
                <span
                  className={`text-[10px] mt-1 whitespace-nowrap ${
                    isActive ? 'text-emerald-600 font-semibold' : isCompleted ? 'text-emerald-500' : 'text-slate-400'
                  }`}
                >
                  {s.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-1 ${i < step ? 'bg-emerald-300' : 'bg-slate-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PriorityRow({ priority, expanded, onToggle }: { priority: RankedOpportunity; expanded: boolean; onToggle: () => void }) {
  const missing = priority.completeness.missing;

  return (
    <div className={`bg-white border rounded-lg mb-2 overflow-hidden transition-colors ${expanded ? 'border-emerald-200' : 'border-slate-200'}`}>
      {/* Collapsed header */}
      <div
        onClick={onToggle}
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <span className={`text-xs transition-transform ${expanded ? 'rotate-90 text-emerald-600' : 'text-slate-400'}`}>
          &#9654;
        </span>
        <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
          {priority.rank}
        </span>
        <span className="text-sm font-semibold text-slate-900 flex-1 truncate">{priority.name}</span>
        <div className="flex gap-1.5 flex-wrap justify-end">
          {missing.filter((f) => f !== 'name').map((field) => (
            <span key={field} className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
              {FIELD_LABELS[field] ?? field}
            </span>
          ))}
        </div>
        <span className="text-xs text-slate-400 shrink-0 ml-2">
          {priority.completeness.score}/{priority.completeness.total}
        </span>
      </div>

      {/* Expanded content */}
      {expanded && (
        <div className="px-4 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DISPLAY_ORDER.map((field) => {
              const isMissing = missing.includes(field);
              const value = readField(priority, field);
              const label = FIELD_LABELS[field] ?? field;

              if (isMissing) {
                return (
                  <div key={field} className={`bg-yellow-50 border-2 border-yellow-300 rounded-lg p-3 ${field === 'dependencies' ? 'md:col-span-2' : ''}`}>
                    <div className="text-xs font-bold text-yellow-700 mb-1">&#9888; {label} — MISSING</div>
                    <div className="text-xs text-yellow-600 italic">
                      Will be included in the generated prompt.
                    </div>
                  </div>
                );
              }

              if (!value) return null;

              if (field === 'dependencies') {
                const deps = Array.isArray(priority.dependencies) ? priority.dependencies : [];
                return (
                  <div key={field} className="md:col-span-2">
                    <div className="text-[11px] font-semibold text-emerald-600 mb-1">{label}</div>
                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-0.5">
                      {deps.map((dep, i) => <li key={i}>{dep}</li>)}
                    </ul>
                  </div>
                );
              }

              return (
                <div key={field}>
                  <div className="text-[11px] font-semibold text-emerald-600 mb-1">{label}</div>
                  <div className="text-sm text-slate-600">{value}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function MissingGapsWorkflow({ departments }: Props) {
  const params = useParams();
  const searchParams = useSearchParams();
  const orgSlug = params?.orgSlug as string;

  const [activeDept, setActiveDept] = useState(0);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [workflowStep, setWorkflowStep] = useState(0);
  const [copied, setCopied] = useState(false);

  // Pre-select department tab from query param
  useEffect(() => {
    const deptParam = searchParams.get('dept');
    if (deptParam) {
      const idx = departments.findIndex((d) => d.department.slug === deptParam);
      if (idx >= 0) setActiveDept(idx);
    }
  }, [searchParams, departments]);

  const current = departments[activeDept];

  function toggleRow(id: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleCopyPrompt() {
    if (!current) return;
    const prompt = generateDepartmentPrompt(current.department, current.teamMembers, current.priorities);
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setWorkflowStep(2); // Advance to "Run in Cowork"
    setTimeout(() => setCopied(false), 2000);
  }

  function handleTabChange(idx: number) {
    setActiveDept(idx);
    setExpandedRows(new Set());
    setWorkflowStep(0);
    setCopied(false);
  }

  return (
    <div>
      {/* Workflow progress bar */}
      <WorkflowBar step={workflowStep} orgSlug={orgSlug} />

      {/* Department tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {departments.map((dg, idx) => (
          <button
            key={dg.department.slug}
            onClick={() => handleTabChange(idx)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              idx === activeDept
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-emerald-300'
            }`}
          >
            {dg.department.name}
            <span
              className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] ${
                idx === activeDept ? 'bg-white/30' : 'bg-slate-100'
              }`}
            >
              {dg.priorities.length}
            </span>
          </button>
        ))}
      </div>

      {current && (
        <>
          {/* Copy prompt bar */}
          <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 mb-4 flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-slate-900">{current.department.name}</span>
              <span className="text-sm text-slate-500 ml-2">
                {current.priorities.length} priorit{current.priorities.length !== 1 ? 'ies' : 'y'} with missing data
              </span>
            </div>
            <button
              onClick={handleCopyPrompt}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                copied
                  ? 'bg-emerald-700 text-white'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {copied ? 'Copied!' : 'Copy Prompt for Claude Cowork'}
            </button>
          </div>

          {/* Priority rows */}
          <div>
            {current.priorities.map((p) => (
              <PriorityRow
                key={p.id}
                priority={p}
                expanded={expandedRows.has(p.id)}
                onToggle={() => toggleRow(p.id)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
