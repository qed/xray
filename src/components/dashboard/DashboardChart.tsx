'use client';

import {
  ResponsiveContainer,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import type { ReportingChart } from '@/lib/types';
import type { ColorPalette } from '@/lib/constants';

interface DashboardChartProps {
  chart: ReportingChart;
  palette: ColorPalette;
  height?: number;
  /** Per-bar colors for horizontal-bar charts (one color per data point) */
  barColors?: string[];
}

const DOUGHNUT_COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1', '#06b6d4', '#8b5cf6'];

export default function DashboardChart({ chart, palette, height = 280, barColors }: DashboardChartProps) {
  const { type, data, title } = chart;

  // Transform chart data into recharts format
  const rechartsData = data.labels.map((label, i) => {
    const point: Record<string, string | number> = { name: label };
    data.datasets.forEach((ds) => {
      point[ds.label] = ds.data[i];
    });
    return point;
  });

  const datasetColors = [palette.primary, palette.secondary, palette.tertiary, '#6366f1', '#06b6d4'];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">{title}</h3>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart(type, rechartsData, data.datasets, datasetColors, barColors)}
      </ResponsiveContainer>
    </div>
  );
}

function renderChart(
  type: ReportingChart['type'],
  data: Record<string, string | number>[],
  datasets: { label: string; data: number[] }[],
  colors: string[],
  barColors?: string[],
) {
  switch (type) {
    case 'bar':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          {datasets.map((ds, i) => (
            <Bar key={ds.label} dataKey={ds.label} fill={colors[i % colors.length]} radius={[2, 2, 0, 0]} />
          ))}
        </BarChart>
      );

    case 'line':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          {datasets.map((ds, i) => (
            <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      );

    case 'multi-line':
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {datasets.map((ds, i) => (
            <Line key={ds.label} type="monotone" dataKey={ds.label} stroke={colors[i % colors.length]} strokeWidth={2} dot={false} />
          ))}
        </LineChart>
      );

    case 'doughnut': {
      const pieData = datasets[0]?.data.map((value, i) => ({
        name: data[i]?.name as string || `Item ${i}`,
        value,
      })) ?? [];
      return (
        <PieChart>
          <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" nameKey="name" stroke="none">
            {pieData.map((_, i) => (
              <Cell key={i} fill={DOUGHNUT_COLORS[i % DOUGHNUT_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      );
    }

    case 'stacked-bar':
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          {datasets.map((ds, i) => (
            <Bar key={ds.label} dataKey={ds.label} stackId="a" fill={colors[i % colors.length]} />
          ))}
        </BarChart>
      );

    case 'horizontal-bar':
      return (
        <BarChart data={data} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={120} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          {datasets.map((ds, i) => (
            <Bar key={ds.label} dataKey={ds.label} fill={colors[i % colors.length]} radius={[0, 2, 2, 0]}>
              {barColors && data.map((_, j) => (
                <Cell key={j} fill={barColors[j % barColors.length]} />
              ))}
            </Bar>
          ))}
        </BarChart>
      );

    default:
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          {datasets.map((ds, i) => (
            <Bar key={ds.label} dataKey={ds.label} fill={colors[i % colors.length]} />
          ))}
        </BarChart>
      );
  }
}
