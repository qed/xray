'use client';

import { useState } from 'react';
import type { RankedOpportunity } from '@/lib/types';
import { usePriorityModal } from './PriorityModalContext';

interface PrioritiesTableProps {
  opportunities: RankedOpportunity[];
}

const EFFORT_SORT_VALUES: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

type SortColumn = 'hoursSaved' | 'effort';
type SortDirection = 'asc' | 'desc';

function getHoursMidpoint(opp: RankedOpportunity): number | null {
  if (opp.parsedTimeSavings.valid) {
    return opp.parsedTimeSavings.midpoint;
  }
  return null;
}

function sortOpportunities(
  opps: RankedOpportunity[],
  column: SortColumn,
  direction: SortDirection
): RankedOpportunity[] {
  const sorted = [...opps];
  sorted.sort((a, b) => {
    let comparison: number;

    if (column === 'hoursSaved') {
      const aVal = getHoursMidpoint(a);
      const bVal = getHoursMidpoint(b);
      // Unfiled (null) always sorts to bottom regardless of direction
      if (aVal === null && bVal === null) comparison = 0;
      else if (aVal === null) return 1;
      else if (bVal === null) return -1;
      else comparison = aVal - bVal;
    } else {
      // effort
      const aVal = EFFORT_SORT_VALUES[a.effort] ?? 2;
      const bVal = EFFORT_SORT_VALUES[b.effort] ?? 2;
      comparison = aVal - bVal;
    }

    return direction === 'desc' ? -comparison : comparison;
  });
  return sorted;
}

export default function PrioritiesTable({
  opportunities,
}: PrioritiesTableProps) {
  const { openModal } = usePriorityModal();
  const [sortColumn, setSortColumn] = useState<SortColumn>('hoursSaved');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sorted = sortOpportunities(opportunities, sortColumn, sortDirection);

  const arrow = (column: SortColumn) => {
    if (sortColumn !== column) return ' ↕';
    return sortDirection === 'desc' ? ' ↓' : ' ↑';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Opportunity</th>
            <th className="px-4 py-3">Department</th>
            <th
              className="px-4 py-3 cursor-pointer hover:text-emerald-600 transition-colors select-none"
              onClick={() => handleSort('effort')}
            >
              Effort{arrow('effort')}
            </th>
            <th
              className="px-4 py-3 cursor-pointer hover:text-emerald-600 transition-colors select-none"
              onClick={() => handleSort('hoursSaved')}
            >
              Hours Saved/Week{arrow('hoursSaved')}
            </th>
            <th className="px-4 py-3">Stage</th>
            <th className="px-4 py-3">Complete</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((opp, i) => (
            <tr
              key={`${opp.departmentSlug}-${opp.rank}`}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => openModal(opp)}
            >
              <td className="px-4 py-3 text-slate-400 font-mono">{i + 1}</td>
              <td className="px-4 py-3 text-slate-900 font-medium">{opp.name}</td>
              <td className="px-4 py-3 text-slate-600">
                {opp.departmentName}
              </td>
              <td className="px-4 py-3 text-slate-600">{opp.effort}</td>
              <td className="px-4 py-3 text-slate-600">
                {opp.parsedTimeSavings.valid
                  ? opp.parsedTimeSavings.display
                  : '—'}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {opp.milestoneName}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    opp.completeness.score === opp.completeness.total
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {opp.completeness.score}/{opp.completeness.total}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
