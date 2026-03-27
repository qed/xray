'use client';

import { useState } from 'react';
import type { ToolOverlap } from '@/lib/types';

interface Props {
  tools: ToolOverlap[];
  allDepartments: string[];
}

export default function ToolMatrix({ tools, allDepartments }: Props) {
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const selected = tools.find((t) => t.tool === selectedTool);

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wide">
              <th className="py-3 px-4 font-medium">Tool</th>
              {allDepartments.map((dept) => (
                <th key={dept} className="py-3 px-4 font-medium text-center">
                  {dept}
                </th>
              ))}
              <th className="py-3 px-4 font-medium text-center">Depts</th>
            </tr>
          </thead>
          <tbody>
            {tools.map((tool) => {
              const isSelected = selectedTool === tool.tool;
              const isShared = tool.departments.length >= 2;

              return (
                <tr
                  key={tool.tool}
                  onClick={() =>
                    setSelectedTool(isSelected ? null : tool.tool)
                  }
                  className={`border-b border-slate-100 cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <td className="py-3 px-4 font-medium text-slate-700">
                    {tool.tool}
                  </td>
                  {allDepartments.map((dept) => {
                    const used = tool.departments.includes(dept);
                    return (
                      <td key={dept} className="py-3 px-4 text-center">
                        <span
                          className={`inline-block w-3 h-3 rounded-full ${
                            used
                              ? 'bg-emerald-500'
                              : 'bg-slate-200'
                          }`}
                        />
                      </td>
                    );
                  })}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        isShared
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}
                    >
                      {tool.departments.length}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Related priorities panel */}
      {selected && selected.relatedPriorities.length > 0 && (
        <div className="bg-white border border-emerald-200 rounded-xl p-6">
          <h3 className="text-base font-semibold text-slate-900 mb-3">
            Priorities related to{' '}
            <span className="text-emerald-600">{selected.tool}</span>
          </h3>
          <ul className="space-y-2">
            {selected.relatedPriorities.map((p, i) => (
              <li
                key={`${p.departmentName}-${p.priorityName}-${i}`}
                className="flex items-start gap-2 text-sm"
              >
                <span className="inline-block mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>
                  <span className="font-medium text-slate-700">
                    {p.departmentName}
                  </span>
                  <span className="text-slate-400 mx-1">&mdash;</span>
                  <span className="text-slate-600">{p.priorityName}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selected && selected.relatedPriorities.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <p className="text-sm text-slate-500">
            No priorities directly reference{' '}
            <span className="font-medium">{selected.tool}</span> in their
            dependencies or suggested approach.
          </p>
        </div>
      )}
    </div>
  );
}
