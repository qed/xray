import { describe, it, expect } from 'vitest';
import { getTopWins, getOpportunitiesByMilestone, getCompanyOverview, getUnfiledPriorities, getTimeSavingsRollup, getConsolidatedRisks, getStaffingOverview } from '../aggregator';

describe('getTopWins', () => {
  const wins = getTopWins(40);

  it('returns all 17 opportunities when n >= 17', () => {
    expect(wins).toHaveLength(35);
  });

  it('returns n opportunities when n < total', () => {
    const top10 = getTopWins(10);
    expect(top10).toHaveLength(10);
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
    expect(total).toBe(35);
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
    expect(overview.totalOpportunities).toBe(35);
  });

  it('has byMilestoneStage with counts summing to total', () => {
    const total = Object.values(overview.byMilestoneStage).reduce(
      (sum, count) => sum + count,
      0
    );
    expect(total).toBe(35);
  });

  it('has 4 department summaries', () => {
    expect(overview.departments).toHaveLength(4);
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

describe('parsedTimeSavings on RankedOpportunity', () => {
  const wins = getTopWins(40);

  it('every opportunity has parsedTimeSavings', () => {
    for (const win of wins) {
      expect(win.parsedTimeSavings).toBeDefined();
      expect(typeof win.parsedTimeSavings.valid).toBe('boolean');
    }
  });

  it('valid entries have min, max, midpoint, display', () => {
    const valid = wins.filter((w) => w.parsedTimeSavings.valid);
    for (const w of valid) {
      if (w.parsedTimeSavings.valid) {
        expect(typeof w.parsedTimeSavings.min).toBe('number');
        expect(typeof w.parsedTimeSavings.max).toBe('number');
        expect(typeof w.parsedTimeSavings.midpoint).toBe('number');
        expect(w.parsedTimeSavings.display.length).toBeGreaterThan(0);
      }
    }
  });

  it('invalid entries have rawText and issue', () => {
    const invalid = wins.filter((w) => !w.parsedTimeSavings.valid);
    for (const w of invalid) {
      if (!w.parsedTimeSavings.valid) {
        expect(typeof w.parsedTimeSavings.rawText).toBe('string');
        expect(['no numeric value found', 'non-standard unit', 'not quantified']).toContain(
          w.parsedTimeSavings.issue
        );
      }
    }
  });
});

describe('getTimeSavingsRollup', () => {
  it('returns rollup with totals and per-department breakdown', () => {
    const rollup = getTimeSavingsRollup();
    expect(rollup.totalPotentialHoursPerWeek).toBeGreaterThan(0);
    expect(rollup.realizedHoursPerWeek).toBeGreaterThanOrEqual(0);
    expect(rollup.remainingHoursPerWeek).toBe(
      rollup.totalPotentialHoursPerWeek - rollup.realizedHoursPerWeek
    );
    expect(rollup.byDepartment.length).toBeGreaterThan(0);
    for (const dept of rollup.byDepartment) {
      expect(dept.slug).toBeTruthy();
      expect(dept.name).toBeTruthy();
      expect(dept.potentialHoursPerWeek).toBeGreaterThanOrEqual(0);
    }
  });

  it('excludes priorities with invalid time estimates', () => {
    const rollup = getTimeSavingsRollup();
    const deptTotal = rollup.byDepartment.reduce(
      (sum, d) => sum + d.potentialHoursPerWeek, 0
    );
    expect(deptTotal).toBeCloseTo(rollup.totalPotentialHoursPerWeek, 1);
  });
});

describe('getConsolidatedRisks', () => {
  it('returns risks from all departments', () => {
    const risks = getConsolidatedRisks();
    expect(risks.length).toBeGreaterThan(0);
    for (const risk of risks) {
      expect(['people', 'process', 'tool']).toContain(risk.type);
      expect(['critical', 'high', 'medium']).toContain(risk.severity);
      expect(risk.departmentSlug).toBeTruthy();
      expect(risk.description).toBeTruthy();
    }
  });
});

describe('getStaffingOverview', () => {
  it('returns staffing data for all departments', () => {
    const staffing = getStaffingOverview();
    expect(staffing.length).toBeGreaterThan(0);
    for (const dept of staffing) {
      expect(dept.slug).toBeTruthy();
      expect(dept.teamSize).toBeGreaterThanOrEqual(0);
      expect(dept.priorityCount).toBeGreaterThan(0);
    }
  });
});

describe('getUnfiledPriorities', () => {
  const unfiled = getUnfiledPriorities();

  it('returns an array', () => {
    expect(Array.isArray(unfiled)).toBe(true);
  });

  it('each entry has required fields', () => {
    for (const item of unfiled) {
      expect(item.departmentSlug).toBeTruthy();
      expect(item.departmentName).toBeTruthy();
      expect(typeof item.rank).toBe('number');
      expect(item.name).toBeTruthy();
      expect(typeof item.rawText).toBe('string');
      expect(['no numeric value found', 'non-standard unit', 'not quantified']).toContain(
        item.issue
      );
    }
  });

  it('unfiled count + valid count equals 35', () => {
    const allWins = getTopWins(40);
    const validCount = allWins.filter((w) => w.parsedTimeSavings.valid).length;
    expect(unfiled.length + validCount).toBe(35);
  });
});
