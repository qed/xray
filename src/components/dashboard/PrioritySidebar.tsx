'use client';

import type { ColorPalette } from '@/lib/constants';
import type { Completeness, ReportingData } from '@/lib/types';

export interface PrioritySidebarItem {
  slug: string;
  rank: number;
  name: string;
  status: string;
  effort: string;
  complexity: string;
  completeness: Completeness;
  isPlaceholder: boolean;
}

interface PrioritySidebarProps {
  priorities: PrioritySidebarItem[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
  palette: ColorPalette;
}

function statusBadgeColor(status: string): string {
  const s = status.toLowerCase();
  if (s === 'completed' || s === 'done') return 'bg-emerald-100 text-emerald-700';
  if (s === 'in progress') return 'bg-blue-100 text-blue-700';
  return 'bg-slate-100 text-slate-600';
}

export default function PrioritySidebar({ priorities, selectedSlug, onSelect, palette }: PrioritySidebarProps) {
  if (priorities.length === 0) {
    return (
      <div className="text-sm text-slate-400 p-4 text-center">
        No priorities yet
      </div>
    );
  }

  return (
    <>
      {/* Mobile pill row */}
      <div className="flex md:hidden overflow-x-auto gap-2 px-4 py-3 -mx-4 scrollbar-hide">
        {priorities.map((pri) => {
          const isSelected = pri.slug === selectedSlug;
          return (
            <button
              key={pri.slug}
              onClick={() => onSelect(pri.slug)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isSelected
                  ? 'text-white border-transparent'
                  : 'text-slate-600 border-slate-200 bg-white hover:bg-slate-50'
              }`}
              style={isSelected ? { backgroundColor: palette.primary } : undefined}
            >
              #{pri.rank} {pri.name.length > 30 ? pri.name.slice(0, 30) + '...' : pri.name}
            </button>
          );
        })}
      </div>

      {/* Desktop sidebar cards */}
      <div className="hidden md:flex flex-col gap-1">
        {priorities.map((pri) => {
          const isSelected = pri.slug === selectedSlug;
          const hasMissingData = pri.completeness.score < pri.completeness.total;

          return (
            <button
              key={pri.slug}
              onClick={() => onSelect(pri.slug)}
              className={`text-left px-3 py-2.5 rounded-md border-l-[3px] transition-colors ${
                isSelected ? '' : 'hover:bg-slate-50'
              }`}
              style={{
                borderLeftColor: palette.primary,
                backgroundColor: isSelected ? palette.light : undefined,
              }}
            >
              <div className="flex items-start gap-1.5">
                <span className="text-xs text-slate-400 font-mono mt-0.5">#{pri.rank}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-800 truncate" title={pri.name}>{pri.name}</div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${statusBadgeColor(pri.status)}`}>
                      {pri.status || 'Not Started'}
                    </span>
                    <span className="text-[10px] text-slate-400">{pri.complexity}</span>
                    {hasMissingData && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-700" title="Missing X-Ray data">
                        Incomplete
                      </span>
                    )}
                    {pri.isPlaceholder && (
                      <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium bg-violet-100 text-violet-700" title="Using placeholder data">
                        Sample
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
