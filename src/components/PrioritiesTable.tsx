'use client';

import { useState } from 'react';
import type { RankedOpportunity } from '@/lib/types';

interface PrioritiesTableProps {
  opportunities: RankedOpportunity[];
}

const impactColors: Record<string, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  'Very High': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  High: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Medium: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

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
          <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Opportunity</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Impact</th>
            <th
              className="px-4 py-3 cursor-pointer hover:text-cyan-400 transition-colors select-none"
              onClick={() => handleSort('effort')}
            >
              Effort{arrow('effort')}
            </th>
            <th
              className="px-4 py-3 cursor-pointer hover:text-cyan-400 transition-colors select-none"
              onClick={() => handleSort('hoursSaved')}
            >
              Hours Saved/Week{arrow('hoursSaved')}
            </th>
            <th className="px-4 py-3">Stage</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((opp, i) => (
            <tr
              key={`${opp.departmentSlug}-${opp.rank}`}
              className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-4 py-3 text-slate-500 font-mono">{i + 1}</td>
              <td className="px-4 py-3 text-white font-medium">{opp.name}</td>
              <td className="px-4 py-3 text-slate-300">
                {opp.departmentName}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded border text-xs font-medium ${impactColors[opp.impact] ?? impactColors.Low}`}
                >
                  {opp.impact}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300">{opp.effort}</td>
              <td className="px-4 py-3 text-slate-300">
                {opp.parsedTimeSavings.valid
                  ? opp.parsedTimeSavings.display
                  : '—'}
              </td>
              <td className="px-4 py-3 text-slate-400">
                {opp.milestoneName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
