'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MilestoneChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#64748b', '#06b6d4', '#f59e0b', '#10b981', '#8b5cf6'];

export default function MilestoneChart({ data }: MilestoneChartProps) {
  // Filter out zero-value entries for cleaner chart
  const filtered = data.filter((d) => d.value > 0);

  if (filtered.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={filtered}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
          nameKey="name"
          stroke="none"
        >
          {filtered.map((entry, index) => (
            <Cell
              key={entry.name}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#334155',
          }}
        />
        <Legend
          wrapperStyle={{ color: '#64748b', fontSize: '13px' }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
