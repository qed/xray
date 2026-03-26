import { describe, it, expect } from 'vitest';
import { getTopWins } from '../aggregator';

describe('getTopWins', () => {
  const wins = getTopWins(20);

  it('returns all 17 opportunities when n >= 17', () => {
    expect(wins).toHaveLength(17);
  });

  it('returns n opportunities when n < total', () => {
    const top5 = getTopWins(5);
    expect(top5).toHaveLength(5);
  });

  it('is sorted by score descending', () => {
    for (let i = 0; i < wins.length - 1; i++) {
      expect(wins[i].score).toBeGreaterThanOrEqual(wins[i + 1].score);
    }
  });

  it('scores are computed correctly (impact * effort)', () => {
    const acctP1 = wins.find(
      (w) => w.departmentSlug === 'accounting' && w.rank === 1
    );
    expect(acctP1).toBeDefined();
    expect(acctP1!.score).toBe(9);
  });

  it('has milestone data populated', () => {
    for (const win of wins) {
      expect(typeof win.milestoneStage).toBe('number');
      expect(win.milestoneName.length).toBeGreaterThan(0);
    }
  });

  it('has department name populated', () => {
    for (const win of wins) {
      expect(win.departmentName.length).toBeGreaterThan(0);
    }
  });

  it('has all required fields', () => {
    const win = wins[0];
    expect(win.departmentSlug).toBeTruthy();
    expect(win.departmentName).toBeTruthy();
    expect(typeof win.rank).toBe('number');
    expect(win.name).toBeTruthy();
    expect(win.impact).toBeTruthy();
    expect(win.complexity).toBeTruthy();
    expect(win.effort).toBeTruthy();
    expect(typeof win.score).toBe('number');
  });
});
