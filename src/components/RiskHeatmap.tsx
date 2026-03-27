'use client';

import { useState } from 'react';

interface ConsolidatedRisk {
  id: string;
  description: string;
  type: 'people' | 'process' | 'tool';
  severity: 'critical' | 'high' | 'medium';
  departmentSlug: string;
  departmentName: string;
  source: 'spof' | 'pain-point' | 'tribal-knowledge' | 'scaling-risk';
}

interface RiskHeatmapProps {
  risks: ConsolidatedRisk[];
}

const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: 'bg-red-50 border-red-200',
  high: 'bg-amber-50 border-amber-200',
  medium: 'bg-yellow-50 border-yellow-200',
};

const SEVERITY_BADGE: Record<string, string> = {
  critical: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-amber-100 text-amber-700 border-amber-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const TYPE_LABELS: Record<string, string> = {
  people: 'People',
  process: 'Process',
  tool: 'Tool',
};

const SOURCE_LABELS: Record<string, string> = {
  spof: 'Single Point of Failure',
  'pain-point': 'Pain Point',
  'tribal-knowledge': 'Tribal Knowledge',
  'scaling-risk': 'Scaling Risk',
};

export default function RiskHeatmap({ risks }: RiskHeatmapProps) {
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const departments = Array.from(new Set(risks.map((r) => r.departmentName))).sort();
  const types = ['people', 'process', 'tool'];

  const filtered = risks
    .filter((r) => filterDept === 'all' || r.departmentName === filterDept)
    .filter((r) => filterType === 'all' || r.type === filterType)
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">All Types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>

        <span className="px-3 py-2 text-sm text-slate-500">
          {filtered.length} risk{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((risk) => (
          <div
            key={risk.id}
            className={`rounded-lg border p-4 ${SEVERITY_COLORS[risk.severity]}`}
          >
            <p className="text-sm text-slate-800 mb-3 leading-relaxed">
              {risk.description}
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">
                {risk.departmentName}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {TYPE_LABELS[risk.type]}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {SOURCE_LABELS[risk.source]}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full font-medium border ${SEVERITY_BADGE[risk.severity]}`}
              >
                {risk.severity}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
