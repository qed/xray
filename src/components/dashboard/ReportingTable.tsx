'use client';

import type { ReportingTable as ReportingTableType } from '@/lib/types';

interface ReportingTableProps {
  table: ReportingTableType;
}

const BADGE_STYLES: Record<string, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
};

export default function ReportingTable({ table }: ReportingTableProps) {
  const { columns, rows, badges = {} } = table;

  if (!columns.length || !rows.length) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-8 text-center text-sm text-slate-400">
        No data available
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      <h3 className="text-sm font-semibold text-slate-700 px-4 pt-4 pb-2">Details</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {columns.map((col) => (
                <th key={col} className="px-4 py-2 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                {row.map((cell, colIdx) => {
                  const badgeMap = badges[colIdx];
                  const badgeType = badgeMap?.[cell];
                  return (
                    <td key={colIdx} className="px-4 py-2 text-slate-700 whitespace-nowrap">
                      {badgeType ? (
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${BADGE_STYLES[badgeType] ?? ''}`}>
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
