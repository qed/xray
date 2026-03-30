export const MILESTONE_STAGES = [
  { stage: 0, name: 'Not Started' },
  { stage: 1, name: 'Implemented' },
  { stage: 2, name: '2 Weeks Stable' },
  { stage: 3, name: 'Dept Head Confirmed' },
] as const;

export const EFFORT_SCORES: Record<string, number> = {
  Low: 3,
  Medium: 2,
  High: 1,
};

export function computeScore(timeSavingsMidpoint: number, effort: string): number {
  return timeSavingsMidpoint * (EFFORT_SCORES[effort] ?? 1);
}
