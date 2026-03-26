# Step 4: Data Aggregation Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build cross-department data aggregation functions that compute scored rankings, milestone distributions, and company-wide summaries from parsed department data.

**Architecture:** Single file `src/lib/aggregator.ts` with 3 exported functions that consume `parser.ts` output and produce `CompanyOverview`, `RankedOpportunity[]`, and milestone-grouped views. Scoring uses impact * effort numeric mapping.

**Tech Stack:** TypeScript, Vitest

---

### Task 1: Scoring helpers and getTopWins

**Files:**
- Create: `src/lib/aggregator.ts`
- Create: `src/lib/__tests__/aggregator.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/aggregator.test.ts`:

```typescript
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
    // Accounting Priority 1: Impact=High(3), Effort=Low(3) => score=9
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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — module `../aggregator` does not exist.

- [ ] **Step 3: Implement scoring helpers and getTopWins**

Create `src/lib/aggregator.ts`:

```typescript
import {
  getAllDepartments,
  getMilestones,
  getStatuses,
} from './parser';
import type {
  CompanyOverview,
  DepartmentSummary,
  RankedOpportunity,
  AutomationPriority,
} from './types';

const IMPACT_SCORES: Record<string, number> = {
  'Critical': 5,
  'Very High': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1,
};

const EFFORT_SCORES: Record<string, number> = {
  'Low': 3,
  'Medium': 2,
  'High': 1,
};

function scoreOpportunity(priority: AutomationPriority): number {
  const impactScore = IMPACT_SCORES[priority.impact] ?? 2;
  const effortScore = EFFORT_SCORES[priority.effort] ?? 2;
  return impactScore * effortScore;
}

function buildRankedOpportunity(
  priority: AutomationPriority,
  departmentName: string,
  milestoneStage: number,
  milestoneName: string
): RankedOpportunity {
  return {
    departmentSlug: priority.departmentSlug,
    departmentName,
    rank: priority.rank,
    name: priority.name,
    impact: priority.impact,
    complexity: priority.complexity,
    effort: priority.effort,
    estimatedTimeSavings: priority.estimatedTimeSavings,
    milestoneStage,
    milestoneName,
    score: scoreOpportunity(priority),
  };
}

function getAllRankedOpportunities(): RankedOpportunity[] {
  const departments = getAllDepartments();
  const statuses = getStatuses();
  const milestones = getMilestones();

  const opportunities: RankedOpportunity[] = [];

  for (const dept of departments) {
    for (const priority of dept.priorities) {
      const statusKey = `${priority.departmentSlug}/priority-${priority.rank}`;
      const status = statuses[statusKey];
      const milestoneStage = status?.milestone ?? 0;
      const milestone = milestones.find((m) => m.id === milestoneStage);
      const milestoneName = milestone?.name ?? 'Not Started';

      opportunities.push(
        buildRankedOpportunity(
          priority,
          dept.profile.name,
          milestoneStage,
          milestoneName
        )
      );
    }
  }

  return opportunities;
}

export function getTopWins(n: number): RankedOpportunity[] {
  const all = getAllRankedOpportunities();
  all.sort((a, b) => b.score - a.score);
  return all.slice(0, n);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All getTopWins tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/aggregator.ts src/lib/__tests__/aggregator.test.ts
git commit -m "Add scoring helpers and getTopWins aggregation function"
```

---

### Task 2: getOpportunitiesByMilestone

**Files:**
- Modify: `src/lib/aggregator.ts`
- Modify: `src/lib/__tests__/aggregator.test.ts`

- [ ] **Step 1: Write failing tests**

Append to `src/lib/__tests__/aggregator.test.ts`:

```typescript
import { getOpportunitiesByMilestone } from '../aggregator';

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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `getOpportunitiesByMilestone` is not exported.

- [ ] **Step 3: Implement getOpportunitiesByMilestone**

Add to `src/lib/aggregator.ts`:

```typescript
export function getOpportunitiesByMilestone(): Record<number, RankedOpportunity[]> {
  const milestones = getMilestones();
  const all = getAllRankedOpportunities();

  const grouped: Record<number, RankedOpportunity[]> = {};
  for (const milestone of milestones) {
    grouped[milestone.id] = [];
  }

  for (const opp of all) {
    if (!grouped[opp.milestoneStage]) {
      grouped[opp.milestoneStage] = [];
    }
    grouped[opp.milestoneStage].push(opp);
  }

  return grouped;
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/aggregator.ts src/lib/__tests__/aggregator.test.ts
git commit -m "Add getOpportunitiesByMilestone aggregation function"
```

---

### Task 3: getCompanyOverview

**Files:**
- Modify: `src/lib/aggregator.ts`
- Modify: `src/lib/__tests__/aggregator.test.ts`

- [ ] **Step 1: Write failing tests**

Append to `src/lib/__tests__/aggregator.test.ts`:

```typescript
import { getCompanyOverview } from '../aggregator';

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
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `getCompanyOverview` is not exported.

- [ ] **Step 3: Implement getCompanyOverview**

Add to `src/lib/aggregator.ts`:

```typescript
export function getCompanyOverview(): CompanyOverview {
  const departments = getAllDepartments();
  const statuses = getStatuses();
  const milestones = getMilestones();

  const byMilestoneStage: Record<number, number> = {};
  for (const milestone of milestones) {
    byMilestoneStage[milestone.id] = 0;
  }

  let totalOpportunities = 0;
  let totalCompleted = 0;
  const departmentSummaries: DepartmentSummary[] = [];

  for (const dept of departments) {
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    for (const priority of dept.priorities) {
      totalOpportunities++;
      const statusKey = `${priority.departmentSlug}/priority-${priority.rank}`;
      const status = statuses[statusKey];
      const milestoneStage = status?.milestone ?? 0;

      if (!byMilestoneStage[milestoneStage]) {
        byMilestoneStage[milestoneStage] = 0;
      }
      byMilestoneStage[milestoneStage]++;

      if (milestoneStage === 3) {
        completed++;
        totalCompleted++;
      } else if (milestoneStage > 0) {
        inProgress++;
      } else {
        notStarted++;
      }
    }

    departmentSummaries.push({
      slug: dept.profile.slug,
      name: dept.profile.name,
      totalPriorities: dept.priorities.length,
      completed,
      inProgress,
      notStarted,
      progressPercent:
        dept.priorities.length > 0
          ? Math.round((completed / dept.priorities.length) * 100)
          : 0,
    });
  }

  return {
    totalOpportunities,
    byMilestoneStage,
    totalCompleted,
    departments: departmentSummaries,
    topWins: getTopWins(10),
  };
}
```

- [ ] **Step 4: Run tests and verify build**

```bash
npm test
npm run build
```

Expected: All tests pass. Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/aggregator.ts src/lib/__tests__/aggregator.test.ts docs/superpowers/specs/2026-03-26-step4-aggregator-design.md docs/superpowers/plans/2026-03-26-step4-aggregator.md
git commit -m "Add getCompanyOverview aggregation function"
```
