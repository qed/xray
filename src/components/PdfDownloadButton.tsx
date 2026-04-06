'use client';

import { useState } from 'react';
import { pdf } from '@react-pdf/renderer';
import PdfReport from './PdfReport';
import type {
  DepartmentSummary,
  TimeSavingsRollup,
  RankedOpportunity,
  StaffingOverview,
} from '@/lib/types';

interface Props {
  orgName: string;
  departments: DepartmentSummary[];
  timeSavings: TimeSavingsRollup;
  allOpportunities: RankedOpportunity[];
  staffing: StaffingOverview[];
}

export default function PdfDownloadButton({
  orgName,
  departments,
  timeSavings,
  allOpportunities,
  staffing,
}: Props) {
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    try {
      const blob = await pdf(
        <PdfReport
          orgName={orgName}
          departments={departments}
          timeSavings={timeSavings}
          allOpportunities={allOpportunities}
          staffing={staffing}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${orgName.replace(/\s+/g, '-')}-AI-Readiness-Report.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors"
    >
      {generating ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Generating...
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export PDF
        </>
      )}
    </button>
  );
}
