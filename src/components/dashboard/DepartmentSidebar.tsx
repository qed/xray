'use client';

import type { ColorPalette } from '@/lib/constants';

export interface DepartmentSidebarItem {
  slug: string;
  name: string;
  priorityCount: number;
  activeCount: number;
  palette: ColorPalette;
}

interface DepartmentSidebarProps {
  departments: DepartmentSidebarItem[];
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}

export default function DepartmentSidebar({ departments, selectedSlug, onSelect }: DepartmentSidebarProps) {
  if (departments.length === 0) {
    return (
      <div className="text-sm text-slate-400 p-4 text-center">
        No departments yet
      </div>
    );
  }

  return (
    <>
      {/* Mobile pill row */}
      <div className="flex md:hidden overflow-x-auto gap-2 px-4 py-3 -mx-4 scrollbar-hide">
        {departments.map((dept) => {
          const isSelected = dept.slug === selectedSlug;
          return (
            <button
              key={dept.slug}
              onClick={() => onSelect(dept.slug)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                isSelected
                  ? 'text-white border-transparent'
                  : 'text-slate-600 border-slate-200 bg-white hover:bg-slate-50'
              }`}
              style={isSelected ? { backgroundColor: dept.palette.primary, borderColor: dept.palette.primary } : { borderLeftColor: dept.palette.primary, borderLeftWidth: 3 }}
            >
              {dept.name}
            </button>
          );
        })}
      </div>

      {/* Desktop sidebar cards */}
      <div className="hidden md:flex flex-col gap-1">
        {departments.map((dept) => {
          const isSelected = dept.slug === selectedSlug;
          return (
            <button
              key={dept.slug}
              onClick={() => onSelect(dept.slug)}
              className={`text-left px-3 py-2.5 rounded-md border-l-[3px] transition-colors ${
                isSelected ? 'bg-opacity-100' : 'hover:bg-slate-50'
              }`}
              style={{
                borderLeftColor: dept.palette.primary,
                backgroundColor: isSelected ? dept.palette.light : undefined,
              }}
            >
              <div className="text-sm font-medium text-slate-800 truncate">{dept.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-slate-500">{dept.priorityCount} priorities</span>
                {dept.activeCount > 0 && (
                  <span className="text-xs font-medium" style={{ color: dept.palette.primary }}>
                    {dept.activeCount} active
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
