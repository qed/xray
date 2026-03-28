export const MILESTONE_STAGES = [
  { stage: 0, name: 'Not Started' },
  { stage: 1, name: 'Implemented' },
  { stage: 2, name: '2 Weeks Stable' },
  { stage: 3, name: 'Dept Head Confirmed' },
] as const;

export const IMPACT_SCORES: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
  'Very High': 4,
  Critical: 5,
};

export const EFFORT_SCORES: Record<string, number> = {
  Low: 3,
  Medium: 2,
  High: 1,
};

export function computeScore(impact: string, effort: string): number {
  return (IMPACT_SCORES[impact] ?? 1) * (EFFORT_SCORES[effort] ?? 1);
}
