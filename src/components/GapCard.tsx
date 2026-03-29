'use client';

import { useState } from 'react';
import type { RankedOpportunity } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface GapCardProps {
  priority: RankedOpportunity;
  index: number;
  total: number;
  onSaved: () => void;
  onNext: () => void;
  onPrev: () => void;
}

type FieldType = 'text' | 'textarea' | 'select' | 'time-savings' | 'tags';

interface FieldConfig {
  label: string;
  type: FieldType;
  options?: string[];
}

/* ------------------------------------------------------------------ */
/*  Field configuration — keys are DB column names (snake_case)        */
/* ------------------------------------------------------------------ */

const FIELD_CONFIG: Record<string, FieldConfig> = {
  name:                    { label: 'Name',                  type: 'text' },
  what_to_automate:        { label: 'What to Automate',      type: 'textarea' },
  current_state:           { label: 'Current State',         type: 'textarea' },
  why_it_matters:          { label: 'Why It Matters',        type: 'textarea' },
  suggested_approach:      { label: 'Suggested Approach',    type: 'textarea' },
  success_criteria:        { label: 'Success Criteria',      type: 'textarea' },
  complexity:              { label: 'Complexity',            type: 'select', options: ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High'] },
  impact:                  { label: 'Impact',                type: 'select', options: ['Low', 'Medium', 'High', 'Very High', 'Critical'] },
  estimated_time_savings:  { label: 'Estimated Time Savings', type: 'time-savings' },
  dependencies:            { label: 'Dependencies',          type: 'tags' },
};

/** Map DB column names to the RankedOpportunity property names for reading current values. */
const DB_TO_PROP: Record<string, keyof RankedOpportunity> = {
  name:                   'name',
  what_to_automate:       'whatToAutomate',
  current_state:          'currentState',
  why_it_matters:         'whyItMatters',
  suggested_approach:     'suggestedApproach',
  success_criteria:       'successCriteria',
  complexity:             'complexity',
  impact:                 'impact',
  estimated_time_savings: 'estimatedTimeSavings',
  dependencies:           'dependencies',
};

/* ------------------------------------------------------------------ */
/*  TagInput sub-component                                             */
/* ------------------------------------------------------------------ */

function TagInput({
  tags,
  onChange,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState('');

  function addTag() {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  }

  function removeTag(idx: number) {
    onChange(tags.filter((_, i) => i !== idx));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map((tag, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs px-2 py-1 rounded-full"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-emerald-400 hover:text-emerald-600 ml-0.5"
              aria-label={`Remove ${tag}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addTag();
            }
          }}
          placeholder="Type a dependency and press Enter"
          className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TimeSavingsInput sub-component                                     */
/* ------------------------------------------------------------------ */

function TimeSavingsInput({
  min,
  max,
  rangeMode,
  onMinChange,
  onMaxChange,
  onToggleRange,
}: {
  min: string;
  max: string;
  rangeMode: boolean;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
  onToggleRange: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          step="0.5"
          value={min}
          onChange={(e) => onMinChange(e.target.value)}
          placeholder={rangeMode ? 'Min' : 'Hours'}
          className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
        {rangeMode && (
          <>
            <span className="text-slate-400 text-sm">&ndash;</span>
            <input
              type="number"
              min="0"
              step="0.5"
              value={max}
              onChange={(e) => onMaxChange(e.target.value)}
              placeholder="Max"
              className="w-24 rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </>
        )}
        <span className="text-slate-500 text-sm">/week</span>
      </div>
      <label className="inline-flex items-center gap-2 text-xs text-slate-500 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={rangeMode}
          onChange={onToggleRange}
          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
        />
        Range (min&ndash;max)
      </label>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Completeness dots                                                  */
/* ------------------------------------------------------------------ */

function CompletenessDots({ score, total }: { score: number; total: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${score} of ${total} fields complete`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full ${i < score ? 'bg-emerald-500' : 'bg-slate-300'}`}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  GapCard                                                            */
/* ------------------------------------------------------------------ */

export default function GapCard({
  priority,
  index,
  total,
  onSaved,
  onNext,
  onPrev,
}: GapCardProps) {
  const { completeness } = priority;
  const missingFields = completeness.missing;

  // All known DB column names for the completeness system
  const allFields = Object.keys(FIELD_CONFIG);
  const filledFields = allFields.filter((f) => !missingFields.includes(f));

  // Form state — only tracks values the user edits (missing fields)
  const [formValues, setFormValues] = useState<Record<string, string | string[]>>({});
  const [timeSavingsMin, setTimeSavingsMin] = useState('');
  const [timeSavingsMax, setTimeSavingsMax] = useState('');
  const [rangeMode, setRangeMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField(key: string, value: string | string[]) {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  }

  /** Build the PATCH body from form state. */
  function buildBody(): Record<string, string | string[]> {
    const body: Record<string, string | string[]> = {};

    for (const field of missingFields) {
      if (field === 'estimated_time_savings') {
        const minVal = timeSavingsMin.trim();
        const maxVal = timeSavingsMax.trim();
        if (minVal) {
          body.estimated_time_savings =
            rangeMode && maxVal
              ? `${minVal}-${maxVal} hrs/week`
              : `${minVal} hrs/week`;
        }
      } else if (field === 'dependencies') {
        const tags = formValues[field];
        if (Array.isArray(tags) && tags.length > 0) {
          body.dependencies = tags;
        }
      } else {
        const val = formValues[field];
        if (typeof val === 'string' && val.trim()) {
          body[field] = val.trim();
        }
      }
    }
    return body;
  }

  async function save(andNext: boolean) {
    const body = buildBody();
    if (Object.keys(body).length === 0) {
      if (andNext) onNext();
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/priorities/${priority.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Save failed (${res.status})`);
      }

      onSaved();
      if (andNext) onNext();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  /** Read a filled field's current value from the priority object. */
  function readFilledValue(dbCol: string): string {
    const prop = DB_TO_PROP[dbCol];
    if (!prop) return '';
    const val = priority[prop];
    if (Array.isArray(val)) return val.join(', ');
    if (typeof val === 'string') return val;
    return String(val ?? '');
  }

  /* ---------------------------------------------------------------- */
  /*  Render helpers                                                   */
  /* ---------------------------------------------------------------- */

  /** Render just the input control for a field (no wrapper/label). */
  function renderFieldInput(field: string) {
    const config = FIELD_CONFIG[field];
    if (!config) return null;

    const { label, type, options } = config;

    return (
      <>
        {type === 'text' && (
          <input
            type="text"
            value={(formValues[field] as string) ?? ''}
            onChange={(e) => setField(field, e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        )}

        {type === 'textarea' && (
          <textarea
            rows={3}
            value={(formValues[field] as string) ?? ''}
            onChange={(e) => setField(field, e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
          />
        )}

        {type === 'select' && options && (
          <select
            value={(formValues[field] as string) ?? ''}
            onChange={(e) => setField(field, e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
          >
            <option value="">Select {label}...</option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        )}

        {type === 'time-savings' && (
          <TimeSavingsInput
            min={timeSavingsMin}
            max={timeSavingsMax}
            rangeMode={rangeMode}
            onMinChange={setTimeSavingsMin}
            onMaxChange={setTimeSavingsMax}
            onToggleRange={() => setRangeMode((v) => !v)}
          />
        )}

        {type === 'tags' && (
          <TagInput
            tags={(formValues[field] as string[]) ?? []}
            onChange={(tags) => setField(field, tags)}
          />
        )}
      </>
    );
  }

  /** Render a filled field as a read-only section matching PriorityModal style. */
  function renderFilledSection(field: string) {
    const config = FIELD_CONFIG[field];
    if (!config) return null;
    const value = readFilledValue(field);
    if (!value) return null;

    if (field === 'dependencies') {
      const deps = Array.isArray(priority.dependencies) ? priority.dependencies : [];
      if (deps.length === 0) return null;
      return (
        <div key={field}>
          <h4 className="text-emerald-600 font-medium text-sm mb-1">{config.label}</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm">
            {deps.map((dep, idx) => (
              <li key={idx}>{dep}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div key={field}>
        <h4 className="text-emerald-600 font-medium text-sm mb-1">{config.label}</h4>
        <p className="text-slate-600 text-sm whitespace-pre-line">{value}</p>
      </div>
    );
  }

  /** Render a missing field as an editable input with a highlight border. */
  function renderMissingField(field: string) {
    const config = FIELD_CONFIG[field];
    if (!config) return null;
    return (
      <div key={field} className="bg-amber-50/50 border border-amber-200 rounded-lg p-4 space-y-1.5">
        <label className="block text-sm font-medium text-amber-700">{config.label} <span className="text-amber-400 text-xs">(missing)</span></label>
        {renderFieldInput(field)}
      </div>
    );
  }

  /* ---------------------------------------------------------------- */
  /*  Field display order — show all fields in consistent order        */
  /* ---------------------------------------------------------------- */

  /** Ordered list of all fields to display, matching PriorityModal section order. */
  const DISPLAY_ORDER = [
    'what_to_automate',
    'current_state',
    'why_it_matters',
    'estimated_time_savings',
    'complexity',
    'impact',
    'dependencies',
    'suggested_approach',
    'success_criteria',
  ];

  /* ---------------------------------------------------------------- */
  /*  Main render                                                      */
  /* ---------------------------------------------------------------- */

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 text-lg font-bold shrink-0">
              {priority.rank}
            </span>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 truncate">{priority.name}</h3>
              <p className="text-sm text-slate-500">{priority.departmentName}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-slate-500">
            {completeness.score}/{completeness.total}
          </span>
          <CompletenessDots score={completeness.score} total={completeness.total} />
        </div>
      </div>

      {/* Body — all fields in consistent order, filled = read-only, missing = editable */}
      <div className="px-6 py-5 space-y-5">
        {missingFields.length > 0 && (
          <p className="text-sm text-amber-600">
            {missingFields.length} field{missingFields.length === 1 ? '' : 's'} still needed — fill in the highlighted sections below.
          </p>
        )}

        {DISPLAY_ORDER.map((field) =>
          missingFields.includes(field)
            ? renderMissingField(field)
            : renderFilledSection(field)
        )}

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        <span className="text-sm text-slate-400">
          {index + 1} of {total}
        </span>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNext}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Skip
          </button>
          <button
            type="button"
            onClick={() => save(false)}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => save(true)}
            disabled={saving}
            className="px-4 py-2 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save & Next'}
          </button>
        </div>
      </div>
    </div>
  );
}
