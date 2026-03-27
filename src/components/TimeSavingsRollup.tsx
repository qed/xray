'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface DepartmentTimeSavingsProps {
  slug: string;
  name: string;
  potentialHoursPerWeek: number;
  realizedHoursPerWeek: number;
}

interface TimeSavingsRollupProps {
  totalPotentialHoursPerWeek: number;
  realizedHoursPerWeek: number;
  remainingHoursPerWeek: number;
  byDepartment: DepartmentTimeSavingsProps[];
}

export default function TimeSavingsRollup({
  totalPotentialHoursPerWeek,
  realizedHoursPerWeek,
  remainingHoursPerWeek,
  byDepartment,
}: TimeSavingsRollupProps) {
  const chartData = byDepartment.map((dept) => ({
    name: dept.name,
    Realized: dept.realizedHoursPerWeek,
    Remaining: Math.round((dept.potentialHoursPerWeek - dept.realizedHoursPerWeek) * 10) / 10,
  }));

  return (
    <div className="space-y-6">
      {/* Summary stats row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-slate-900">
            {totalPotentialHoursPerWeek}
          </p>
          <p className="text-sm text-slate-500">Potential hrs/wk</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-emerald-600">
            {realizedHoursPerWeek}
          </p>
          <p className="text-sm text-slate-500">Realized hrs/wk</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-amber-600">
            {remainingHoursPerWeek}
          </p>
          <p className="text-sm text-slate-500">Remaining hrs/wk</p>
        </div>
      </div>

      {/* Horizontal stacked bar chart */}
      <ResponsiveContainer width="100%" height={byDepartment.length * 60 + 40}>
        <BarChart layout="vertical" data={chartData}>
          <XAxis type="number" tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis
            dataKey="name"
            type="category"
            width={140}
            tick={{ fill: '#334155', fontSize: 13 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              color: '#334155',
            }}
          />
          <Legend wrapperStyle={{ color: '#64748b', fontSize: '13px' }} />
          <Bar dataKey="Realized" stackId="a" fill="#059669" />
          <Bar dataKey="Remaining" stackId="a" fill="#d97706" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
