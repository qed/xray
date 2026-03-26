import { describe, it, expect } from 'vitest';
import { getTopWins, getOpportunitiesByMilestone, getCompanyOverview } from '../aggregator';

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

describe('getOpportunitiesByMilestone', () => {
  const grouped = getOpportunitiesByMilestone();

  it('has keys for all 4 milestone stages', () => {
    expect(grouped[0]).toBeDefined();
    expect(grouped[1]).toBeDefined();
    expect(grouped[2]).toBeDefined();
    expect(grouped[3]).toBeDefined();
  });

  it('total across all stages equals 17', () => {
    const total = Object.values(grouped).reduce(
      (sum, arr) => sum + arr.length,
      0
    );
    expect(total).toBe(17);
  });

  it('sales-ops priority-1 is in milestone 1', () => {
    const stage1 = grouped[1];
    const found = stage1.find(
      (o) => o.departmentSlug === 'sales-operations' && o.rank === 1
    );
    expect(found).toBeDefined();
  });

  it('each opportunity has a score', () => {
    for (const stage of Object.values(grouped)) {
      for (const opp of stage) {
        expect(typeof opp.score).toBe('number');
        expect(opp.score).toBeGreaterThan(0);
      }
    }
  });
});

describe('getCompanyOverview', () => {
  const overview = getCompanyOverview();

  it('has correct total opportunities', () => {
    expect(overview.totalOpportunities).toBe(17);
  });

  it('has byMilestoneStage with counts summing to total', () => {
    const total = Object.values(overview.byMilestoneStage).reduce(
      (sum, count) => sum + count,
      0
    );
    expect(total).toBe(17);
  });

  it('has 2 department summaries', () => {
    expect(overview.departments).toHaveLength(2);
  });

  it('department summaries have correct totals', () => {
    const acct = overview.departments.find((d) => d.slug === 'accounting');
    expect(acct).toBeDefined();
    expect(acct!.totalPriorities).toBe(9);

    const salesOps = overview.departments.find(
      (d) => d.slug === 'sales-operations'
    );
    expect(salesOps).toBeDefined();
    expect(salesOps!.totalPriorities).toBe(8);
  });

  it('department summaries have progress fields', () => {
    for (const dept of overview.departments) {
      expect(typeof dept.completed).toBe('number');
      expect(typeof dept.inProgress).toBe('number');
      expect(typeof dept.notStarted).toBe('number');
      expect(typeof dept.progressPercent).toBe('number');
      expect(dept.completed + dept.inProgress + dept.notStarted).toBe(
        dept.totalPriorities
      );
    }
  });

  it('has topWins array', () => {
    expect(overview.topWins.length).toBeGreaterThan(0);
    expect(overview.topWins.length).toBeLessThanOrEqual(10);
  });
});
