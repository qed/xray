'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface CompletionScreenProps {
  departmentId: string;
  orgSlug: string;
}

interface DeptData {
  id: string;
  name: string;
  mission: string;
  scope: string;
  tools: string[];
  single_points_of_failure: string[];
  pain_points: string[];
  tribal_knowledge_risks: string[];
}

interface TeamMemberData {
  id: string;
  name: string;
  title: string;
  responsibilities: string;
}

interface PriorityData {
  id: string;
  rank: number;
  name: string;
  estimated_time_savings: string;
  employees_affected?: string;
  frequency?: string;
  hands_on_time?: string;
  waiting_overhead?: string;
  hidden_costs?: string;
  automation_percentage?: string;
}

/* ------------------------------------------------------------------ */
/*  Inline editable field                                              */
/* ------------------------------------------------------------------ */

function InlineEdit({
  value,
  onSave,
  label,
  className = '',
}: {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  label: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editing]);

  const handleSave = useCallback(async () => {
    const trimmed = draft.trim();
    if (trimmed === value) {
      setEditing(false);
      return;
    }
    if (!trimmed) {
      setDraft(value);
      setEditing(false);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(trimmed);
      setEditing(false);
    } catch (err) {
      setError(String(err));
      setDraft(value);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }, [draft, value, onSave]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSave();
      } else if (e.key === 'Escape') {
        setDraft(value);
        setEditing(false);
      }
    },
    [handleSave, value]
  );

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1.5">
        <input
          ref={inputRef}
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          aria-label={label}
          className={`border border-blue-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
        />
        {saving && (
          <svg className="w-4 h-4 animate-spin text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {error && (
          <span role="alert" className="text-xs text-red-600">
            {error}
          </span>
        )}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title={`Click to edit ${label}`}
      className={`cursor-pointer hover:bg-slate-100 rounded px-1 -mx-1 transition-colors ${className}`}
    >
      {value || <span className="text-slate-400 italic">Click to edit</span>}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const HOURS_PATTERN =
  /(\d+(?:\.\d+)?)\s*(?:[–\-]\s*(\d+(?:\.\d+)?))?\s*(?:hours?|hrs?|h)\s*(?:\/|\s*per\s*)\s*(?:week|wk)\b/i;

function parseHoursPerWeek(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const match = raw.match(HOURS_PATTERN);
  if (!match) return null;
  const min = parseFloat(match[1]);
  const max = match[2] ? parseFloat(match[2]) : min;
  return (min + max) / 2;
}

function parseEmployeesAffected(raw: string | undefined | null): number {
  if (!raw) return 1;
  const match = raw.match(/(\d+)/);
  return match ? parseInt(match[1], 10) || 1 : 1;
}

/** Check whether a priority has incomplete time estimate fields */
function hasIncompleteEstimates(p: PriorityData): boolean {
  const estimateFields = [
    p.estimated_time_savings,
    p.frequency,
    p.hands_on_time,
    p.employees_affected,
  ];
  return estimateFields.some((f) => !f || f.trim() === '');
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CompletionScreen({ departmentId, orgSlug }: CompletionScreenProps) {
  const [dept, setDept] = useState<DeptData | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([]);
  const [priorities, setPriorities] = useState<PriorityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingProfile, setDownloadingProfile] = useState(false);
  const [downloadingPriorities, setDownloadingPriorities] = useState(false);

  // Fetch all data on mount
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const supabase = createClient();
      const [deptRes, teamRes, prioRes] = await Promise.all([
        supabase.from('departments').select('*').eq('id', departmentId).single(),
        supabase.from('team_members').select('*').eq('department_id', departmentId),
        supabase.from('priorities').select('*').eq('department_id', departmentId).order('rank'),
      ]);
      if (cancelled) return;
      setDept(deptRes.data);
      setTeamMembers(teamRes.data ?? []);
      setPriorities(prioRes.data ?? []);
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [departmentId]);

  // ── Inline save handlers ─────────────────────────────────────────

  const saveDeptField = useCallback(
    async (field: string, value: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('departments')
        .update({ [field]: value })
        .eq('id', departmentId);
      if (error) throw new Error(error.message);
      setDept((prev) => (prev ? { ...prev, [field]: value } : prev));
    },
    [departmentId]
  );

  const saveTeamMemberField = useCallback(
    async (memberId: string, field: string, value: string) => {
      const supabase = createClient();
      const { error } = await supabase
        .from('team_members')
        .update({ [field]: value })
        .eq('id', memberId);
      if (error) throw new Error(error.message);
      setTeamMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, [field]: value } : m))
      );
    },
    []
  );

  const savePriorityField = useCallback(
    async (priorityId: string, field: string, value: string) => {
      const res = await fetch(`/api/priorities/${priorityId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to save');
      }
      setPriorities((prev) =>
        prev.map((p) => (p.id === priorityId ? { ...p, [field]: value } : p))
      );
    },
    []
  );

  // ── Download handlers ────────────────────────────────────────────

  const downloadMarkdown = useCallback(
    async (type: 'profile' | 'priorities') => {
      const setter = type === 'profile' ? setDownloadingProfile : setDownloadingPriorities;
      setter(true);
      try {
        const res = await fetch(`/api/markdown/${departmentId}?type=${type}`);
        if (!res.ok) throw new Error('Download failed');
        const blob = await res.blob();
        const disposition = res.headers.get('Content-Disposition') ?? '';
        const filenameMatch = disposition.match(/filename="?([^"]+)"?/);
        const filename = filenameMatch?.[1] ?? `${type}.md`;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } finally {
        setter(false);
      }
    },
    [departmentId]
  );

  // ── Computed values ──────────────────────────────────────────────

  const totalEstimatedHours = priorities.reduce((sum, p) => {
    const hrs = parseHoursPerWeek(p.estimated_time_savings);
    if (hrs === null) return sum;
    const multiplier = parseEmployeesAffected(p.employees_affected);
    return sum + hrs * multiplier;
  }, 0);

  const incompleteCount = priorities.filter(hasIncompleteEstimates).length;

  // ── Render ───────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px]">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span className="text-sm">Loading summary...</span>
        </div>
      </div>
    );
  }

  if (!dept) {
    return (
      <div className="flex items-center justify-center h-full min-h-[300px] text-red-600">
        Department not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Header */}
      <div className="border-b border-slate-200 bg-emerald-50 px-6 py-5">
        <div className="flex items-center gap-3 mb-1">
          <svg className="w-6 h-6 text-emerald-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-xl font-semibold text-slate-900">Interview Complete</h1>
        </div>
        <p className="text-sm text-slate-600 ml-9">
          Review the summary below, edit any fields inline, and download your reports.
        </p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-8 max-w-3xl">
        {/* ── Summary Card ───────────────────────────────────────── */}
        <section className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800">Department Summary</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {/* Department name — editable */}
            <div>
              <span className="text-slate-500 block mb-0.5">Department Name</span>
              <InlineEdit
                value={dept.name}
                onSave={(v) => saveDeptField('name', v)}
                label="Department name"
                className="font-medium text-slate-900"
              />
            </div>

            {/* Team count */}
            <div>
              <span className="text-slate-500 block mb-0.5">Team Members</span>
              <span className="font-medium text-slate-900">{teamMembers.length}</span>
            </div>

            {/* Priority count */}
            <div>
              <span className="text-slate-500 block mb-0.5">Priorities Identified</span>
              <span className="font-medium text-slate-900">{priorities.length}</span>
            </div>

            {/* Total estimated time savings */}
            <div>
              <span className="text-slate-500 block mb-0.5">Total Estimated Time Savings</span>
              <span className="font-medium text-slate-900">
                {totalEstimatedHours > 0
                  ? `${totalEstimatedHours.toFixed(1)} hrs/wk (estimated)`
                  : 'Not yet quantified'}
              </span>
            </div>
          </div>

          {/* Incomplete estimates indicator */}
          {incompleteCount > 0 && (
            <div className="flex items-center gap-2 text-sm text-slate-500 pt-2 border-t border-slate-100">
              <svg className="w-4 h-4 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <rect x="3" y="3" width="18" height="18" rx="2" />
              </svg>
              <span>
                {incompleteCount} of {priorities.length} priorities have incomplete estimates
              </span>
            </div>
          )}
        </section>

        {/* ── Team Members ───────────────────────────────────────── */}
        {teamMembers.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800">Team Members</h2>
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
              {teamMembers.map((m) => (
                <div key={m.id} className="px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm">
                  <div className="sm:w-1/3">
                    <InlineEdit
                      value={m.name}
                      onSave={(v) => saveTeamMemberField(m.id, 'name', v)}
                      label={`Team member name for ${m.name}`}
                      className="font-medium text-slate-900"
                    />
                  </div>
                  <div className="sm:w-2/3">
                    <InlineEdit
                      value={m.title}
                      onSave={(v) => saveTeamMemberField(m.id, 'title', v)}
                      label={`Title for ${m.name}`}
                      className="text-slate-600"
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Priorities ─────────────────────────────────────────── */}
        {priorities.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-800">Automation Priorities</h2>
            <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
              {priorities.map((p) => {
                const incomplete = hasIncompleteEstimates(p);
                return (
                  <div key={p.id} className="px-4 py-3 space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-mono text-slate-400 mt-0.5 shrink-0">#{p.rank}</span>
                      <div className="flex-1 min-w-0">
                        <InlineEdit
                          value={p.name}
                          onSave={(v) => savePriorityField(p.id, 'name', v)}
                          label={`Priority name for #${p.rank}`}
                          className="font-medium text-slate-900 text-sm"
                        />
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <span className="text-slate-400">Time:</span>
                            <InlineEdit
                              value={p.estimated_time_savings || ''}
                              onSave={(v) => savePriorityField(p.id, 'estimated_time_savings', v)}
                              label={`Estimated time savings for ${p.name}`}
                            />
                          </span>
                          {p.employees_affected && (
                            <span className="text-slate-400">
                              x{parseEmployeesAffected(p.employees_affected)} employees
                            </span>
                          )}
                          {incomplete && (
                            <span className="inline-flex items-center gap-1 text-slate-400">
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                              </svg>
                              estimated
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Download Buttons ───────────────────────────────────── */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-slate-800">Download Reports</h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => downloadMarkdown('profile')}
              disabled={downloadingProfile}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {downloadingProfile ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
                </svg>
              )}
              Download Department Profile
            </button>

            <button
              type="button"
              onClick={() => downloadMarkdown('priorities')}
              disabled={downloadingPriorities}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {downloadingPriorities ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a2 2 0 002 2h14a2 2 0 002-2v-3" />
                </svg>
              )}
              Download Automation Priorities
            </button>
          </div>
        </section>

        {/* ── CTAs ───────────────────────────────────────────────── */}
        <section className="flex flex-col sm:flex-row gap-3 pb-8">
          {incompleteCount > 0 && (
            <a
              href={`/org/${orgSlug}/departments/${departmentId}?tab=update`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Update Missing Data ({incompleteCount} incomplete)
            </a>
          )}
          <a
            href={`/org/${orgSlug}/departments/${departmentId}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            View AI Priorities
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </section>
      </div>
    </div>
  );
}
