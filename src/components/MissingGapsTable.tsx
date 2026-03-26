'use client';

import type { RankedOpportunity } from '@/lib/types';
import { usePriorityModal } from './PriorityModalContext';

interface MissingGapsTableProps {
  opportunities: RankedOpportunity[];
}

export default function MissingGapsTable({ opportunities }: MissingGapsTableProps) {
  const { openModal } = usePriorityModal();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Issue</th>
            <th className="px-4 py-3">Current Text</th>
          </tr>
        </thead>
        <tbody>
          {opportunities.map((opp) => (
            <tr
              key={`${opp.departmentSlug}-${opp.rank}`}
              className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => openModal(opp)}
            >
              <td className="px-4 py-3 text-slate-900 font-medium">
                #{opp.rank} — {opp.name}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {opp.departmentName}
              </td>
              <td className="px-4 py-3">
                <span className="inline-block px-2 py-0.5 rounded border text-xs font-medium bg-amber-100 text-amber-700 border-amber-200">
                  {!opp.parsedTimeSavings.valid ? opp.parsedTimeSavings.issue : ''}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-500 max-w-md truncate">
                {!opp.parsedTimeSavings.valid ? (opp.parsedTimeSavings.rawText || '(no time estimate provided)') : ''}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
