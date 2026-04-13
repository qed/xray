'use client';

interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
  accentColor: string;
}

export default function StatCard({ label, value, subtitle, accentColor }: StatCardProps) {
  return (
    <div
      className="bg-white rounded-lg border border-slate-200 p-4"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-1">{label}</div>
      <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>
    </div>
  );
}
