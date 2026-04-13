import type { DbPriority, ReportingData, ReportingChart, ReportingStatCard } from '@/lib/types';

// ---------- Deterministic seeded random ----------
// Uses a simple hash of the priority ID to seed a PRNG so
// the same priority always produces the same placeholder data.

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

function createSeededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

// ---------- Helpers ----------

function generateDateLabels(count: number): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const month = d.toLocaleString('en-US', { month: 'short' });
    labels.push(`${month} ${d.getDate()}`);
  }
  return labels;
}

function generateMonthLabels(count: number): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${d.toLocaleString('en-US', { month: 'short' })} ${d.getFullYear()}`);
  }
  return labels;
}

function generateDataPoints(rand: () => number, count: number, min: number, max: number): number[] {
  return Array.from({ length: count }, () => Math.round(min + rand() * (max - min)));
}

function generateTrendData(rand: () => number, count: number, start: number, variance: number): number[] {
  const data: number[] = [];
  let current = start;
  for (let i = 0; i < count; i++) {
    current += (rand() - 0.45) * variance; // slight downward trend
    data.push(Math.round(Math.max(0, current) * 10) / 10);
  }
  return data;
}

// ---------- Complexity / Impact / Effort mappings ----------

const COMPLEXITY_MULTIPLIER: Record<string, number> = {
  'Low': 1, 'Medium': 1.5, 'Medium-High': 2, 'High': 2.5,
};

const IMPACT_LABELS: Record<string, string> = {
  'Low': 'Incremental', 'Medium': 'Moderate', 'High': 'Significant',
};

// ---------- Main generator ----------

export function generatePlaceholderReporting(priority: DbPriority): ReportingData {
  const seed = hashString(priority.id);
  const rand = createSeededRandom(seed);

  const complexity = priority.complexity || 'Medium';
  const effort = priority.effort || 'Medium';
  const complexityMult = COMPLEXITY_MULTIPLIER[complexity] ?? 1.5;
  // Derive impact from effort+complexity: low effort + low complexity = high impact opportunity
  const effortScore = effort === 'Low' ? 3 : effort === 'Medium' ? 2 : 1;
  const complexityScore = complexity === 'Low' ? 3 : complexity === 'Medium' ? 2 : 1;
  const impactLabel = effortScore + complexityScore >= 5 ? 'Significant' : effortScore + complexityScore >= 3 ? 'Moderate' : 'Incremental';

  // Parse time savings for stat cards
  const timeSavingsText = priority.estimated_time_savings || 'TBD';

  // Stat cards — contextual to the priority
  const weeklyVolume = Math.round(5 + rand() * 40);
  const avgTime = Math.round(5 + rand() * 25);
  const errorRate = (1 + rand() * 5).toFixed(1);
  const statCards: ReportingStatCard[] = [
    { label: 'Weekly Volume', value: `${weeklyVolume}`, subtitle: `~${weeklyVolume * 48} annually` },
    { label: 'Avg Processing Time', value: `${avgTime} min`, subtitle: 'Per occurrence' },
    { label: 'Time Savings Potential', value: timeSavingsText, subtitle: `${impactLabel} impact` },
    { label: 'Error/Rework Rate', value: `${errorRate}%`, subtitle: `Complexity: ${complexity}` },
  ];

  // Charts — generate 2-3 based on complexity
  const chartCount = complexity === 'High' || complexity === 'Medium-High' ? 3 : 2;
  const dailyLabels = generateDateLabels(20);
  const monthLabels = generateMonthLabels(6);

  const charts: ReportingChart[] = [];

  // Chart 1: Volume/activity bar chart
  charts.push({
    id: `${priority.id}-volume`,
    title: 'Daily Activity Volume',
    type: 'bar',
    data: {
      labels: dailyLabels,
      datasets: [{ label: 'Tasks Processed', data: generateDataPoints(rand, 20, 1, weeklyVolume / 3) }],
    },
  });

  // Chart 2: Processing time trend line
  charts.push({
    id: `${priority.id}-trend`,
    title: 'Processing Time Trend (min)',
    type: 'line',
    data: {
      labels: dailyLabels,
      datasets: [{ label: 'Avg Time (min)', data: generateTrendData(rand, 20, avgTime, avgTime * 0.3) }],
    },
  });

  // Chart 3: Error/status breakdown (for higher complexity)
  if (chartCount >= 3) {
    const completed = Math.round(40 + rand() * 30);
    const inProgress = Math.round(10 + rand() * 20);
    const errors = 100 - completed - inProgress;
    charts.push({
      id: `${priority.id}-status`,
      title: 'Monthly Status Breakdown',
      type: 'stacked-bar',
      data: {
        labels: monthLabels,
        datasets: [
          { label: 'Completed', data: generateDataPoints(rand, 6, completed - 10, completed + 10) },
          { label: 'In Progress', data: generateDataPoints(rand, 6, inProgress - 5, inProgress + 5) },
          { label: 'Errors/Rework', data: generateDataPoints(rand, 6, Math.max(0, errors - 5), errors + 5) },
        ],
      },
    });
  }

  // Summary paragraph
  const summary = `This priority currently handles approximately ${weeklyVolume} occurrences per week with an average processing time of ${avgTime} minutes each. ` +
    `The ${errorRate}% error/rework rate reflects ${complexity.toLowerCase()} complexity operations. ` +
    `Estimated time savings of ${timeSavingsText} represent a ${impactLabel.toLowerCase()} automation opportunity. ` +
    `The data shown is placeholder — replace with actual metrics once tracking is established.`;

  // Table — sample recent activity
  const statuses = ['Completed', 'In Progress', 'Pending', 'Error'];
  const statusWeights = [0.5, 0.25, 0.15, 0.1];
  const tableRows: string[][] = [];
  for (let i = 0; i < 8; i++) {
    const daysAgo = Math.floor(rand() * 14);
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dateStr = `${d.toLocaleString('en-US', { month: 'short' })} ${d.getDate()}`;
    const ref = `REF-${String(Math.round(1000 + rand() * 9000))}`;
    const timeMin = String(Math.round(avgTime * (0.5 + rand())));

    // Weighted status pick
    let r = rand();
    let statusIdx = 0;
    for (let s = 0; s < statusWeights.length; s++) {
      r -= statusWeights[s];
      if (r <= 0) { statusIdx = s; break; }
    }

    tableRows.push([ref, dateStr, `${timeMin} min`, `${(complexityMult * (0.5 + rand())).toFixed(1)}`, statuses[statusIdx]]);
  }

  const table = {
    columns: ['Reference', 'Date', 'Duration', 'Complexity Score', 'Status'],
    rows: tableRows,
    badges: {
      4: { 'Completed': 'success' as const, 'In Progress': 'warning' as const, 'Pending': 'warning' as const, 'Error': 'danger' as const },
    },
  };

  // Layout selection based on chart count and data density
  let layout: ReportingData['layout'] = 'standard';
  if (chartCount >= 3) layout = 'chart-heavy';
  if (effort === 'Low' && complexity === 'Low') layout = 'table-first';

  return {
    layout,
    is_placeholder: true,
    stat_cards: statCards,
    summary,
    charts,
    table,
  };
}
