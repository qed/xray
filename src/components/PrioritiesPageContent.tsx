'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { RankedOpportunity } from '@/lib/types';
import PrioritiesTable from './PrioritiesTable';

interface Department {
  slug: string;
  name: string;
}

interface Props {
  opportunities: RankedOpportunity[];
  allOpportunities: RankedOpportunity[];
  departments: Department[];
  orgSlug: string;
}

export default function PrioritiesPageContent({
  opportunities,
  allOpportunities,
  departments,
  orgSlug,
}: Props) {
  const [selectedDept, setSelectedDept] = useState('__all__');

  const filtered = useMemo(() => {
    if (selectedDept === '__all__') return opportunities;
    return opportunities.filter((o) => o.departmentSlug === selectedDept);
  }, [selectedDept, opportunities]);

  const incompleteCount = useMemo(() => {
    const opps = selectedDept === '__all__'
      ? allOpportunities
      : allOpportunities.filter((o) => o.departmentSlug === selectedDept);
    return opps.filter((o) => o.completeness.score < o.completeness.total).length;
  }, [selectedDept, allOpportunities]);

  const deptName = selectedDept === '__all__'
    ? null
    : departments.find((d) => d.slug === selectedDept)?.name ?? null;

  const unfiledHref = selectedDept === '__all__'
    ? `/org/${orgSlug}/unfiled`
    : `/org/${orgSlug}/unfiled?dept=${selectedDept}`;

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Priorities</h1>
          <p className="text-slate-500 mt-1">Automation opportunities ranked by potential time savings</p>
        </div>
        <select
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
          className="text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
        >
          <option value="__all__">All Departments</option>
          {departments.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {incompleteCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-amber-800 text-sm">
            {deptName ? `${deptName} has` : ''} {incompleteCount} {incompleteCount === 1 ? 'priority' : 'priorities'} with incomplete data.{' '}
            <Link href={unfiledHref} className="font-medium underline hover:text-amber-900">
              Fill Missing Gaps
            </Link>{' '}
            to improve your analysis.
          </p>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          {selectedDept === '__all__' ? 'All Priorities' : deptName ?? 'Priorities'}
        </h2>
        <PrioritiesTable opportunities={filtered} />
      </div>
    </div>
  );
}
