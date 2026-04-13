'use client';

import { useState, useEffect, useCallback } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type IntakeFeature = 'xray' | 'missing' | 'new-priorities' | 'file-import';

interface Department {
  id: string;
  name: string;
  slug: string;
}

interface IntakeSidebarProps {
  departments: Department[];
  orgSlug: string;
  orgId: string;
  activeFeature: IntakeFeature | null;
  onFeatureSelect: (feature: IntakeFeature) => void;
  onDepartmentChange: (deptId: string | null) => void;
  onDepartmentSwitch?: (outgoingDeptId: string, incomingDeptId: string) => void;
  onNewDepartment?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Feature definitions                                                */
/* ------------------------------------------------------------------ */

const FEATURES: { key: IntakeFeature; label: string; shortLabel: string; description: string }[] = [
  {
    key: 'xray',
    label: 'Initial Department X-Ray',
    shortLabel: 'X-Ray',
    description: 'Start or resume the 8-phase department interview',
  },
  {
    key: 'missing',
    label: 'Update Missing Data',
    shortLabel: 'Missing',
    description: 'Fill gaps in existing department data',
  },
  {
    key: 'new-priorities',
    label: 'Add New AI Priorities',
    shortLabel: 'New Priorities',
    description: 'Discover new automation priorities',
  },
  {
    key: 'file-import',
    label: 'Import Files',
    shortLabel: 'Import',
    description: 'Import departments or priorities from uploaded files',
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function IntakeSidebar({
  departments,
  orgSlug,
  orgId,
  activeFeature,
  onFeatureSelect,
  onDepartmentChange,
  onDepartmentSwitch,
  onNewDepartment,
}: IntakeSidebarProps) {
  const storageKey = `intake_dept_${orgId}`;
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Restore selected department from localStorage on mount
  useEffect(() => {
    if (departments.length === 0) {
      setInitialized(true);
      return;
    }
    const stored = localStorage.getItem(storageKey);
    const valid = departments.find((d) => d.id === stored);
    const initial = valid ? stored : departments[0]?.id ?? null;
    setSelectedDeptId(initial);
    onDepartmentChange(initial);
    setInitialized(true);
  }, [departments, storageKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDepartmentChange = useCallback(
    (newDeptId: string) => {
      if (newDeptId === '__new__') {
        onNewDepartment?.();
        return;
      }
      const previousDeptId = selectedDeptId;
      setSelectedDeptId(newDeptId);
      localStorage.setItem(storageKey, newDeptId);
      onDepartmentChange(newDeptId);

      if (previousDeptId && previousDeptId !== newDeptId && activeFeature) {
        onDepartmentSwitch?.(previousDeptId, newDeptId);
      }
    },
    [selectedDeptId, storageKey, activeFeature, onDepartmentChange, onDepartmentSwitch, onNewDepartment],
  );

  // Empty state: no departments
  if (initialized && departments.length === 0) {
    return (
      <>
        {/* Desktop sidebar empty state */}
        <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-slate-200 p-5">
          <div className="flex flex-col items-center justify-center flex-1 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-slate-900 mb-1">No departments yet</h3>
            <p className="text-xs text-slate-500 mb-4">
              Run your first department X-Ray to get started.
            </p>
            <button
              onClick={() => onFeatureSelect('xray')}
              className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              Start Your First Department X-Ray
            </button>
          </div>
        </aside>

        {/* Mobile empty state */}
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4">
          <button
            onClick={() => onFeatureSelect('xray')}
            className="w-full px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
          >
            Start Your First Department X-Ray
          </button>
        </div>
      </>
    );
  }

  const selectedDept = departments.find((d) => d.id === selectedDeptId);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col bg-white border-r border-slate-200">
        {/* Department dropdown */}
        <div className="p-4 border-b border-slate-200">
          <label htmlFor="dept-select" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
            Department
          </label>
          <select
            id="dept-select"
            value={selectedDeptId ?? ''}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
            <option value="__new__">+ New Department</option>
          </select>
        </div>

        {/* Feature buttons */}
        <div className="p-4 flex flex-col gap-2">
          {FEATURES.map((f) => {
            const isActive = activeFeature === f.key;
            return (
              <button
                key={f.key}
                onClick={() => onFeatureSelect(f.key)}
                className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <span className="block text-sm font-medium">{f.label}</span>
                <span className={`block text-xs mt-0.5 ${isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {f.description}
                </span>
              </button>
            );
          })}
        </div>
      </aside>

      {/* Mobile horizontal strip */}
      <div className="md:hidden bg-white border-b border-slate-200">
        {/* Department dropdown */}
        <div className="px-4 pt-3 pb-2">
          <select
            value={selectedDeptId ?? ''}
            onChange={(e) => handleDepartmentChange(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-colors"
          >
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name}
              </option>
            ))}
            <option value="__new__">+ New Department</option>
          </select>
        </div>

        {/* Tab strip */}
        <div className="flex gap-1 px-4 pb-3">
          {FEATURES.map((f) => {
            const isActive = activeFeature === f.key;
            return (
              <button
                key={f.key}
                onClick={() => onFeatureSelect(f.key)}
                className={`flex-1 rounded-lg border px-2 py-2 text-xs font-medium text-center transition-colors ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-white text-slate-600 border-slate-200'
                }`}
              >
                {f.shortLabel}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
