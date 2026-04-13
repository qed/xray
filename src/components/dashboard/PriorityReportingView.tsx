'use client';

import Link from 'next/link';
import StatCard from './StatCard';
import DashboardChart from './DashboardChart';
import ReportingTable from './ReportingTable';
import type { ReportingData } from '@/lib/types';
import type { ColorPalette } from '@/lib/constants';

interface PriorityReportingViewProps {
  orgSlug: string;
  deptSlug: string;
  deptName: string;
  priorityName: string;
  priorityRank: number;
  reportingData: ReportingData;
  palette: ColorPalette;
}

export default function PriorityReportingView({
  orgSlug,
  deptSlug,
  deptName,
  priorityName,
  priorityRank,
  reportingData,
  palette,
}: PriorityReportingViewProps) {
  const { layout, is_placeholder, stat_cards, charts, summary, table } = reportingData;

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
        <Link href={`/org/${orgSlug}/dashboard`} className="hover:text-slate-600 transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <Link href={`/org/${orgSlug}/dashboard/${deptSlug}`} className="hover:text-slate-600 transition-colors">
          {deptName}
        </Link>
        <span>/</span>
        <span className="text-slate-600">#{priorityRank}</span>
      </div>

      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          {priorityName}
          {is_placeholder && (
            <span className="ml-3 inline-block px-2.5 py-1 rounded text-xs font-medium bg-amber-100 text-amber-700 align-middle">
              Sample Data — Replace with actuals
            </span>
          )}
        </h1>
      </div>

      {/* Layout-driven content */}
      {layout === 'table-first' ? (
        <>
          <StatCards cards={stat_cards} accentColor={palette.primary} />
          <Summary text={summary} />
          <Table data={table} />
          <Charts charts={charts} palette={palette} layout={layout} />
        </>
      ) : layout === 'chart-heavy' ? (
        <>
          <StatCards cards={stat_cards} accentColor={palette.primary} />
          <Charts charts={charts} palette={palette} layout={layout} />
          <Summary text={summary} />
          <Table data={table} />
        </>
      ) : layout === 'full-width' ? (
        <>
          <StatCards cards={stat_cards} accentColor={palette.primary} />
          <FullWidthCharts charts={charts} palette={palette} />
          <Summary text={summary} />
          <Table data={table} />
        </>
      ) : (
        // standard layout (default)
        <>
          <StatCards cards={stat_cards} accentColor={palette.primary} />
          <Charts charts={charts} palette={palette} layout={layout} />
          <Summary text={summary} />
          <Table data={table} />
        </>
      )}
    </div>
  );
}

// ---------- Sub-components ----------

function StatCards({ cards, accentColor }: { cards: ReportingData['stat_cards']; accentColor: string }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {cards.map((sc) => (
        <StatCard key={sc.label} label={sc.label} value={sc.value} subtitle={sc.subtitle} accentColor={accentColor} />
      ))}
    </div>
  );
}

function Charts({ charts, palette, layout }: { charts: ReportingData['charts']; palette: ColorPalette; layout: string }) {
  if (charts.length === 0) return null;

  const gridCols = layout === 'chart-heavy' && charts.length >= 4
    ? 'grid-cols-1 lg:grid-cols-2'
    : charts.length === 1
      ? 'grid-cols-1'
      : 'grid-cols-1 lg:grid-cols-2';

  return (
    <div className={`grid ${gridCols} gap-4 mb-6`}>
      {charts.map((chart) => (
        <DashboardChart key={chart.id} chart={chart} palette={palette} />
      ))}
    </div>
  );
}

function FullWidthCharts({ charts, palette }: { charts: ReportingData['charts']; palette: ColorPalette }) {
  if (charts.length === 0) return null;

  return (
    <div className="space-y-4 mb-6">
      {charts.map((chart, i) => (
        <DashboardChart key={chart.id} chart={chart} palette={palette} height={i === 0 ? 320 : 280} />
      ))}
    </div>
  );
}

function Summary({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 mb-6">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">AI Summary</h3>
      <p className="text-sm text-slate-600 leading-relaxed">{text}</p>
    </div>
  );
}

function Table({ data }: { data: ReportingData['table'] }) {
  if (!data?.columns?.length) return null;
  return (
    <div className="mb-6">
      <ReportingTable table={data} />
    </div>
  );
}
