'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
// Inlined to avoid importing db.ts (which pulls in server-only next/headers)
const PHASE8_FIELDS = [
  'frequency', 'hands_on_time', 'waiting_overhead',
  'hidden_costs', 'automation_percentage', 'employees_affected',
] as const;
import { buildGapFillContext } from '@/lib/prompts';
import ChatInterface from '@/components/ChatInterface';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const REQUIRED_PRIORITY_FIELDS = [
  'name', 'what_to_automate', 'current_state', 'why_it_matters',
  'estimated_time_savings', 'complexity',
  'suggested_approach', 'success_criteria', 'dependencies',
] as const;

const STANDARD_FIELD_LABELS: Record<string, string> = {
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

const PHASE8_FIELD_LABELS: Record<string, string> = {
  frequency: 'Frequency',
  hands_on_time: 'Hands-On Time',
  waiting_overhead: 'Waiting / Overhead',
  hidden_costs: 'Hidden Costs',
  automation_percentage: 'Automation %',
  employees_affected: 'Employees Affected',
};

const ALL_FIELD_LABELS: Record<string, string> = {
  ...STANDARD_FIELD_LABELS,
  ...PHASE8_FIELD_LABELS,
};

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface PriorityRow {
  id: string;
  rank: number;
  name: string;
  department_id: string;
  /* raw DB record for field access */
  raw: Record<string, unknown>;
  missingStandard: string[];
  missingPhase8: string[];
  totalFields: number;
  filledFields: number;
}

interface Props {
  departmentId: string;
  orgSlug: string;
  orgId: string;
  onSwitchFeature?: (feature: string) => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function computeMissing(record: Record<string, unknown>) {
  const missingStandard: string[] = [];
  for (const field of REQUIRED_PRIORITY_FIELDS) {
    const value = record[field];
    if (Array.isArray(value) ? value.length === 0 : !value) {
      missingStandard.push(field);
    }
  }

  const missingPhase8: string[] = [];
  const hasAnyPhase8 = PHASE8_FIELDS.some((f) => {
    const v = record[f];
    return typeof v === 'string' && v.trim() !== '';
  });
  if (hasAnyPhase8) {
    for (const field of PHASE8_FIELDS) {
      const value = record[field];
      if (typeof value !== 'string' || value.trim() === '') {
        missingPhase8.push(field);
      }
    }
  }

  const total = REQUIRED_PRIORITY_FIELDS.length + (hasAnyPhase8 ? PHASE8_FIELDS.length : 0);
  const filled = total - missingStandard.length - missingPhase8.length;
  return { missingStandard, missingPhase8, totalFields: total, filledFields: filled };
}

function buildExistingData(raw: Record<string, unknown>): Record<string, string> {
  const data: Record<string, string> = {};
  const allFields = [...REQUIRED_PRIORITY_FIELDS, ...PHASE8_FIELDS];
  for (const field of allFields) {
    const val = raw[field];
    if (Array.isArray(val) && val.length > 0) {
      data[field] = val.join(', ');
    } else if (typeof val === 'string' && val.trim()) {
      data[field] = val;
    }
  }
  return data;
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function CompletionBadge({ filled, total }: { filled: number; total: number }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 100;
  let color = 'bg-amber-50 text-amber-700 border-amber-200';
  if (pct === 100) color = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  else if (pct >= 75) color = 'bg-lime-50 text-lime-700 border-lime-200';

  return (
    <span className={`text-[11px] px-2 py-0.5 rounded-full border font-medium ${color}`}>
      {filled}/{total}
    </span>
  );
}

function MissingFieldTag({ field }: { field: string }) {
  return (
    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap">
      {ALL_FIELD_LABELS[field] ?? field}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export default function UpdateMissingData({ departmentId, orgSlug, orgId, onSwitchFeature }: Props) {
  const [priorities, setPriorities] = useState<PriorityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [activeChatPriority, setActiveChatPriority] = useState<PriorityRow | null>(null);
  const [departmentName, setDepartmentName] = useState('');

  /* ---- Fetch priorities ---- */
  const fetchPriorities = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    // Get department name
    const { data: dept } = await supabase
      .from('departments')
      .select('name')
      .eq('id', departmentId)
      .single();
    if (dept) setDepartmentName(dept.name);

    // Fetch all priorities for this department
    const { data: rawPriorities } = await supabase
      .from('priorities')
      .select('*')
      .eq('department_id', departmentId)
      .order('rank', { ascending: true });

    if (!rawPriorities) {
      setPriorities([]);
      setLoading(false);
      return;
    }

    const rows: PriorityRow[] = rawPriorities
      .map((p) => {
        const raw = p as Record<string, unknown>;
        const { missingStandard, missingPhase8, totalFields, filledFields } = computeMissing(raw);
        return {
          id: p.id as string,
          rank: p.rank as number,
          name: p.name as string,
          department_id: p.department_id as string,
          raw,
          missingStandard,
          missingPhase8,
          totalFields,
          filledFields,
        };
      })
      .filter((r) => r.missingStandard.length > 0 || r.missingPhase8.length > 0);

    setPriorities(rows);
    setLoading(false);
  }, [departmentId]);

  useEffect(() => {
    fetchPriorities();
  }, [fetchPriorities]);

  /* ---- Toggle expand ---- */
  function toggleRow(id: string) {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  /* ---- Launch gap-fill chat ---- */
  function launchGapFill(priority: PriorityRow) {
    setActiveChatPriority(priority);
  }

  /* ---- Handle extraction complete ---- */
  function handleExtraction() {
    setActiveChatPriority(null);
    fetchPriorities(); // Refresh after gap-fill
  }

  /* ---- Active chat view ---- */
  if (activeChatPriority) {
    const allMissing = [...activeChatPriority.missingStandard, ...activeChatPriority.missingPhase8];
    const existingData = buildExistingData(activeChatPriority.raw);
    const contextSummary = buildGapFillContext(
      departmentName,
      activeChatPriority.name,
      activeChatPriority.id,
      existingData,
      allMissing,
    );

    const fieldLabelsForGreeting: Record<string, string> = {
      what_to_automate: 'what to automate',
      current_state: 'current state',
      why_it_matters: 'why it matters',
      estimated_time_savings: 'time savings',
      effort: 'effort level',
      complexity: 'complexity',
      dependencies: 'dependencies',
      suggested_approach: 'approach',
      success_criteria: 'success criteria',
      frequency: 'frequency',
      hands_on_time: 'hands-on time',
      waiting_overhead: 'waiting/overhead time',
      hidden_costs: 'hidden costs',
      automation_percentage: 'automation percentage',
      employees_affected: 'employees affected',
    };
    const missingLabels = allMissing.map((f) => fieldLabelsForGreeting[f] || f).join(', ');

    return (
      <div className="flex flex-col h-full">
        {/* Back bar */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setActiveChatPriority(null)}
            className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
          >
            <span className="text-lg leading-none">&larr;</span> Back to Missing Data
          </button>
          <span className="text-sm text-slate-400">|</span>
          <span className="text-sm font-medium text-slate-700">
            Filling gaps for: {activeChatPriority.name}
          </span>
        </div>

        <div className="flex-1 min-h-0">
          <ChatInterface
            orgId={orgId}
            mode="gap-fill"
            context={{ summary: contextSummary }}
            greeting={`I need to fill in some details about "${activeChatPriority.name}" in ${departmentName}. Specifically: ${missingLabels}. Just tell me what you know and I'll capture it.`}
            onExtraction={handleExtraction}
          />
        </div>
      </div>
    );
  }

  /* ---- Loading state ---- */
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-3 text-sm text-slate-500">Loading priorities...</span>
      </div>
    );
  }

  /* ---- Empty state (R27): all complete ---- */
  if (priorities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Everything looks complete!</h3>
        <p className="text-sm text-slate-500 mb-5 max-w-sm">
          All priorities for this department have their data filled in. You can discover new automation opportunities instead.
        </p>
        {onSwitchFeature && (
          <button
            onClick={() => onSwitchFeature('new-priorities')}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Add New AI Priorities
          </button>
        )}
      </div>
    );
  }

  /* ---- Priority list ---- */
  return (
    <div>
      {/* Summary bar */}
      <div className="bg-white border border-slate-200 rounded-xl px-5 py-4 mb-4 flex items-center justify-between">
        <div>
          <span className="text-sm font-semibold text-slate-900">{departmentName}</span>
          <span className="text-sm text-slate-500 ml-2">
            {priorities.length} priorit{priorities.length !== 1 ? 'ies' : 'y'} with missing data
          </span>
        </div>
      </div>

      {/* Priority rows */}
      <div>
        {priorities.map((p) => {
          const expanded = expandedRows.has(p.id);
          const allMissing = [...p.missingStandard, ...p.missingPhase8];

          return (
            <div
              key={p.id}
              className={`bg-white border rounded-lg mb-2 overflow-hidden transition-colors ${
                expanded ? 'border-emerald-200' : 'border-slate-200'
              }`}
            >
              {/* Collapsed header */}
              <div
                onClick={() => toggleRow(p.id)}
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <span
                  className={`text-xs transition-transform ${expanded ? 'rotate-90 text-emerald-600' : 'text-slate-400'}`}
                >
                  &#9654;
                </span>
                <span className="w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-xs font-bold shrink-0">
                  {p.rank}
                </span>
                <span className="text-sm font-semibold text-slate-900 flex-1 truncate">{p.name}</span>
                <div className="flex gap-1.5 flex-wrap justify-end max-w-[50%]">
                  {allMissing.filter((f) => f !== 'name').slice(0, 4).map((field) => (
                    <MissingFieldTag key={field} field={field} />
                  ))}
                  {allMissing.filter((f) => f !== 'name').length > 4 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200 whitespace-nowrap">
                      +{allMissing.filter((f) => f !== 'name').length - 4} more
                    </span>
                  )}
                </div>
                <CompletionBadge filled={p.filledFields} total={p.totalFields} />
              </div>

              {/* Expanded content */}
              {expanded && (
                <div className="px-4 py-4 border-t border-slate-100 bg-slate-50/50">
                  {/* Standard fields */}
                  {p.missingStandard.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Standard Fields
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {p.missingStandard.map((field) => (
                          <div
                            key={field}
                            className="bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-1.5"
                          >
                            <span className="text-xs font-medium text-yellow-700">
                              &#9888; {STANDARD_FIELD_LABELS[field] ?? field}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Phase 8 fields */}
                  {p.missingPhase8.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Phase 8 Time-Savings Fields
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {p.missingPhase8.map((field) => (
                          <div
                            key={field}
                            className="bg-purple-50 border border-purple-300 rounded-lg px-3 py-1.5"
                          >
                            <span className="text-xs font-medium text-purple-700">
                              &#9888; {PHASE8_FIELD_LABELS[field] ?? field}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fill button */}
                  <button
                    onClick={() => launchGapFill(p)}
                    className="mt-1 px-5 py-2 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                  >
                    Fill Missing Data
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
