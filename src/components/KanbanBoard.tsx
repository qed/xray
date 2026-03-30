'use client';

import { useState, useMemo } from 'react';
import type { MilestoneConfig, RankedOpportunity } from '@/lib/types';
import KanbanColumn from './KanbanColumn';

interface Filters {
  department: string;
  complexity: string;
}

interface KanbanBoardProps {
  columns: { milestone: MilestoneConfig; opportunities: RankedOpportunity[] }[];
}

const ALL = 'all';

export default function KanbanBoard({ columns }: KanbanBoardProps) {
  const [filters, setFilters] = useState<Filters>({
    department: ALL,
    complexity: ALL,
  });

  // Derive unique filter options from data
  const departments = useMemo(() => {
    const set = new Set<string>();
    for (const col of columns) {
      for (const opp of col.opportunities) {
        set.add(opp.departmentSlug);
      }
    }
    return Array.from(set).sort();
  }, [columns]);

  const departmentNames = useMemo(() => {
    const map: Record<string, string> = {};
    for (const col of columns) {
      for (const opp of col.opportunities) {
        map[opp.departmentSlug] = opp.departmentName;
      }
    }
    return map;
  }, [columns]);

  const complexities = ['Low', 'Medium', 'Medium-High', 'High'];

  // Apply filters
  const filteredColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      opportunities: col.opportunities.filter((opp) => {
        if (filters.department !== ALL && opp.departmentSlug !== filters.department) return false;
        if (filters.complexity !== ALL && opp.complexity !== filters.complexity) return false;
        return true;
      }),
    }));
  }, [columns, filters]);

  const handleChange = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
        <span className="text-sm font-medium text-slate-500">Filters:</span>

        <select
          value={filters.department}
          onChange={(e) => handleChange('department', e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        >
          <option value={ALL}>All Departments</option>
          {departments.map((slug) => (
            <option key={slug} value={slug}>
              {departmentNames[slug]}
            </option>
          ))}
        </select>

        <select
          value={filters.complexity}
          onChange={(e) => handleChange('complexity', e.target.value)}
          className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-600"
        >
          <option value={ALL}>All Complexity</option>
          {complexities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {(filters.department !== ALL || filters.complexity !== ALL) && (
          <button
            onClick={() => setFilters({ department: ALL, complexity: ALL })}
            className="text-xs text-emerald-600 hover:text-emerald-700 transition-colors ml-1"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Kanban Columns */}
      <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
        {filteredColumns.map((col) => (
          <KanbanColumn
            key={col.milestone.id}
            milestone={col.milestone}
            opportunities={col.opportunities}
          />
        ))}
      </div>
    </div>
  );
}
