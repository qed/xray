# Sortable Priorities Table & Unfiled Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Top Wins table with a sortable priorities table showing hours saved/week, and add an Unfiled page that flags priorities with missing or non-standard time estimates.

**Architecture:** Add a `parseTimeSavings()` function to the parser that extracts hours/week from free-form text. Wire it through the aggregator into `RankedOpportunity`. Replace `TopWinsTable` with a client-side `PrioritiesTable` that supports column sorting. Add `/unfiled` route and nav link with count badge.

**Tech Stack:** TypeScript, Next.js 16, React, Vitest, Tailwind CSS

---

### Task 1: Add ParsedTimeSavings and UnfiledPriority types

**Files:**
- Modify: `src/lib/types.ts`

- [ ] **Step 1: Add new types to types.ts**

Add the following to the end of `src/lib/types.ts`:

```typescript
export type ParsedTimeSavings =
  | { valid: true; min: number; max: number; midpoint: number; display: string }
  | { valid: false; rawText: string; issue: string };

export interface UnfiledPriority {
  departmentSlug: string;
  departmentName: string;
  rank: number;
  name: string;
  rawText: string;
  issue: string;
}
```

Also add `parsedTimeSavings: ParsedTimeSavings;` to the `RankedOpportunity` interface, after the `estimatedTimeSavings` field (line 89).

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build may fail because `aggregator.ts` doesn't yet populate `parsedTimeSavings`. That's OK — we'll fix it in Task 3. If it fails, just verify the types themselves have no syntax errors by checking the error message references `aggregator.ts`, not `types.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/lib/types.ts
git commit -m "Add ParsedTimeSavings and UnfiledPriority types"
```

---

### Task 2: Implement parseTimeSavings with tests

**Files:**
- Modify: `src/lib/parser.ts`
- Create: `src/lib/__tests__/parseTimeSavings.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/parseTimeSavings.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { parseTimeSavings } from '../parser';

describe('parseTimeSavings', () => {
  describe('valid hours/week patterns', () => {
    it('parses single value: "10 hours/week"', () => {
      const result = parseTimeSavings('10 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(10);
        expect(result.max).toBe(10);
        expect(result.midpoint).toBe(10);
      }
    });

    it('parses range: "5-15 hours/week"', () => {
      const result = parseTimeSavings('5-15 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(5);
        expect(result.max).toBe(15);
        expect(result.midpoint).toBe(10);
      }
    });

    it('parses en-dash range: "5–15 hrs/wk"', () => {
      const result = parseTimeSavings('5–15 hrs/wk');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(5);
        expect(result.max).toBe(15);
        expect(result.midpoint).toBe(10);
      }
    });

    it('parses "hours per week" variant', () => {
      const result = parseTimeSavings('About 8 hours per week recovered');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(8);
        expect(result.max).toBe(8);
        expect(result.midpoint).toBe(8);
      }
    });

    it('parses "hrs/wk" variant', () => {
      const result = parseTimeSavings('Saves 3-5 hrs/wk');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(3);
        expect(result.max).toBe(5);
        expect(result.midpoint).toBe(4);
      }
    });

    it('parses "h/week" variant', () => {
      const result = parseTimeSavings('12h/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(12);
        expect(result.max).toBe(12);
        expect(result.midpoint).toBe(12);
      }
    });

    it('parses decimal values', () => {
      const result = parseTimeSavings('1.5-2.5 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(1.5);
        expect(result.max).toBe(2.5);
        expect(result.midpoint).toBe(2);
      }
    });

    it('handles hours/week embedded in longer text', () => {
      const result = parseTimeSavings(
        'Various improvements estimated at 4-8 hours/week in total savings across the team'
      );
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.min).toBe(4);
        expect(result.max).toBe(8);
        expect(result.midpoint).toBe(6);
      }
    });

    it('produces display string for single value', () => {
      const result = parseTimeSavings('10 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.display).toBe('10 hrs/wk');
      }
    });

    it('produces display string for range', () => {
      const result = parseTimeSavings('5-15 hours/week');
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.display).toBe('5–15 hrs/wk');
      }
    });
  });

  describe('non-standard unit detection', () => {
    it('flags days: "1-3 days off the reconciliation"', () => {
      const result = parseTimeSavings(
        'Estimated to shave 1–3 days off the reconciliation start date monthly'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });

    it('flags minutes/day: "30-60 minutes/day"', () => {
      const result = parseTimeSavings(
        'Spreadsheet maintenance: estimated 30-60 minutes/day across the team'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });

    it('flags hours/month: "167 hours/month"', () => {
      const result = parseTimeSavings('167 hours/month recovered');
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });

    it('flags minutes per merchant', () => {
      const result = parseTimeSavings(
        '~20 minutes per merchant'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });

    it('flags hours/daily: "1-2 hours of daily time"', () => {
      const result = parseTimeSavings(
        'Estimated to represent 1–2 hours of Kylies daily time'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('non-standard unit');
      }
    });
  });

  describe('not quantified detection', () => {
    it('flags "Not quantified" text', () => {
      const result = parseTimeSavings(
        'Not quantified — but impacts every deal processed.'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('not quantified');
      }
    });

    it('flags "to be quantified" text', () => {
      const result = parseTimeSavings(
        'Depends on current audit time (to be quantified).'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('not quantified');
      }
    });
  });

  describe('no numeric value detection', () => {
    it('flags vague text with no numbers', () => {
      const result = parseTimeSavings(
        'Material reduction in payout error risk and compliance exposure'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('no numeric value found');
      }
    });

    it('flags empty string', () => {
      const result = parseTimeSavings('');
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('no numeric value found');
      }
    });

    it('flags text like "several hours per week" (no specific number)', () => {
      const result = parseTimeSavings(
        'Follow-up and tracking time is estimated at several hours per week across the team.'
      );
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.issue).toBe('no numeric value found');
      }
    });
  });

  describe('rawText preserved on invalid', () => {
    it('includes the original text in rawText', () => {
      const input = 'Material reduction in risk';
      const result = parseTimeSavings(input);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.rawText).toBe(input);
      }
    });
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `parseTimeSavings` is not exported from `../parser`.

- [ ] **Step 3: Implement parseTimeSavings**

Add the following to `src/lib/parser.ts`, after the existing imports. Add `ParsedTimeSavings` to the import from `./types`:

Update the import at the top of `src/lib/parser.ts` to include `ParsedTimeSavings`:

```typescript
import type {
  AutomationPriority,
  Department,
  DepartmentProfile,
  MilestoneConfig,
  MilestoneStatus,
  ParsedTimeSavings,
  ScalingRisk,
  TeamMember,
} from './types';
```

Then add this function before the `parseSummaryTable` function (around line 44):

```typescript
// ---------------------------------------------------------------------------
// Time savings parsing
// ---------------------------------------------------------------------------

const HOURS_PER_WEEK_PATTERN =
  /(\d+(?:\.\d+)?)\s*(?:[–\-]\s*(\d+(?:\.\d+)?))?\s*(?:hours?|hrs?|h)\s*(?:\/|\s*per\s*)\s*(?:week|wk)\b/i;

const NON_STANDARD_UNIT_PATTERNS = [
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:minutes?|mins?)\s*(?:\/|\s*per\s*)\s*(?:week|wk|day|merchant|partner|request)/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:hours?|hrs?|h)\s*(?:\/|\s*per\s*)\s*(?:month|day|merchant|partner|request)/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:days?)\b/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:hours?|hrs?)\s+(?:of\s+)?(?:\w+\s+)?daily/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:minutes?|mins?)\s*(?:\/|\s*per\s*)\s*(?:day)/i,
];

const NOT_QUANTIFIED_PATTERNS = [
  /not quantified/i,
  /to be quantified/i,
];

export function parseTimeSavings(raw: string): ParsedTimeSavings {
  const trimmed = raw.trim();

  // Empty string
  if (!trimmed) {
    return { valid: false, rawText: raw, issue: 'no numeric value found' };
  }

  // Check "not quantified" first
  for (const pattern of NOT_QUANTIFIED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, rawText: raw, issue: 'not quantified' };
    }
  }

  // Try valid hours/week pattern
  const hoursMatch = trimmed.match(HOURS_PER_WEEK_PATTERN);
  if (hoursMatch) {
    const min = parseFloat(hoursMatch[1]);
    const max = hoursMatch[2] ? parseFloat(hoursMatch[2]) : min;
    const midpoint = (min + max) / 2;
    const display =
      min === max ? `${min} hrs/wk` : `${min}–${max} hrs/wk`;
    return { valid: true, min, max, midpoint, display };
  }

  // Check for non-standard units (has numbers but wrong unit)
  for (const pattern of NON_STANDARD_UNIT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, rawText: raw, issue: 'non-standard unit' };
    }
  }

  // Has any number at all? If yes but didn't match above, it's non-standard
  if (/\d/.test(trimmed)) {
    return { valid: false, rawText: raw, issue: 'non-standard unit' };
  }

  // No numbers found at all
  return { valid: false, rawText: raw, issue: 'no numeric value found' };
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All `parseTimeSavings` tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/parser.ts src/lib/__tests__/parseTimeSavings.test.ts
git commit -m "Add parseTimeSavings function with hours/week extraction"
```

---

### Task 3: Wire parsedTimeSavings into aggregator and add getUnfiledPriorities

**Files:**
- Modify: `src/lib/aggregator.ts`
- Modify: `src/lib/__tests__/aggregator.test.ts`

- [ ] **Step 1: Write failing tests**

Add the following to `src/lib/__tests__/aggregator.test.ts`. First update the import at the top:

```typescript
import { getTopWins, getOpportunitiesByMilestone, getCompanyOverview, getUnfiledPriorities } from '../aggregator';
```

Then add these new describe blocks at the end of the file:

```typescript
describe('parsedTimeSavings on RankedOpportunity', () => {
  const wins = getTopWins(20);

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

  it('unfiled count + valid count equals 17', () => {
    const allWins = getTopWins(20);
    const validCount = allWins.filter((w) => w.parsedTimeSavings.valid).length;
    expect(unfiled.length + validCount).toBe(17);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `getUnfiledPriorities` is not exported; `parsedTimeSavings` is not on `RankedOpportunity` objects.

- [ ] **Step 3: Implement aggregator changes**

Update `src/lib/aggregator.ts`:

First, update the imports at the top:

```typescript
import {
  getAllDepartments,
  getMilestones,
  getStatuses,
  parseTimeSavings,
} from './parser';
import type {
  CompanyOverview,
  DepartmentSummary,
  RankedOpportunity,
  AutomationPriority,
  UnfiledPriority,
} from './types';
```

Then update `buildRankedOpportunity` to include `parsedTimeSavings`:

```typescript
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
    parsedTimeSavings: parseTimeSavings(priority.estimatedTimeSavings),
    milestoneStage,
    milestoneName,
    score: scoreOpportunity(priority),
  };
}
```

Then add `getUnfiledPriorities` export at the end of the file:

```typescript
export function getUnfiledPriorities(): UnfiledPriority[] {
  const all = getAllRankedOpportunities();
  return all
    .filter((opp) => !opp.parsedTimeSavings.valid)
    .map((opp) => {
      const parsed = opp.parsedTimeSavings;
      return {
        departmentSlug: opp.departmentSlug,
        departmentName: opp.departmentName,
        rank: opp.rank,
        name: opp.name,
        rawText: !parsed.valid ? parsed.rawText : '',
        issue: !parsed.valid ? parsed.issue : '',
      };
    });
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All tests pass, including the new `parsedTimeSavings` and `getUnfiledPriorities` tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/aggregator.ts src/lib/__tests__/aggregator.test.ts
git commit -m "Wire parsedTimeSavings into aggregator, add getUnfiledPriorities"
```

---

### Task 4: Create PrioritiesTable component

**Files:**
- Create: `src/components/PrioritiesTable.tsx`

- [ ] **Step 1: Create PrioritiesTable component**

Create `src/components/PrioritiesTable.tsx`:

```typescript
'use client';

import { useState } from 'react';
import type { RankedOpportunity } from '@/lib/types';

interface PrioritiesTableProps {
  opportunities: RankedOpportunity[];
}

const impactColors: Record<string, string> = {
  Critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  'Very High': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  High: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Medium: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Low: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const EFFORT_SORT_VALUES: Record<string, number> = {
  Low: 1,
  Medium: 2,
  High: 3,
};

type SortColumn = 'hoursSaved' | 'effort';
type SortDirection = 'asc' | 'desc';

function getHoursMidpoint(opp: RankedOpportunity): number | null {
  if (opp.parsedTimeSavings.valid) {
    return opp.parsedTimeSavings.midpoint;
  }
  return null;
}

function sortOpportunities(
  opps: RankedOpportunity[],
  column: SortColumn,
  direction: SortDirection
): RankedOpportunity[] {
  const sorted = [...opps];
  sorted.sort((a, b) => {
    let comparison: number;

    if (column === 'hoursSaved') {
      const aVal = getHoursMidpoint(a);
      const bVal = getHoursMidpoint(b);
      // Unfiled (null) always sorts to bottom regardless of direction
      if (aVal === null && bVal === null) comparison = 0;
      else if (aVal === null) return 1;
      else if (bVal === null) return -1;
      else comparison = aVal - bVal;
    } else {
      // effort
      const aVal = EFFORT_SORT_VALUES[a.effort] ?? 2;
      const bVal = EFFORT_SORT_VALUES[b.effort] ?? 2;
      comparison = aVal - bVal;
    }

    return direction === 'desc' ? -comparison : comparison;
  });
  return sorted;
}

export default function PrioritiesTable({
  opportunities,
}: PrioritiesTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('hoursSaved');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sorted = sortOpportunities(opportunities, sortColumn, sortDirection);

  const arrow = (column: SortColumn) => {
    if (sortColumn !== column) return ' ↕';
    return sortDirection === 'desc' ? ' ↓' : ' ↑';
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
            <th className="px-4 py-3">Rank</th>
            <th className="px-4 py-3">Opportunity</th>
            <th className="px-4 py-3">Department</th>
            <th className="px-4 py-3">Impact</th>
            <th
              className="px-4 py-3 cursor-pointer hover:text-cyan-400 transition-colors select-none"
              onClick={() => handleSort('effort')}
            >
              Effort{arrow('effort')}
            </th>
            <th
              className="px-4 py-3 cursor-pointer hover:text-cyan-400 transition-colors select-none"
              onClick={() => handleSort('hoursSaved')}
            >
              Hours Saved/Week{arrow('hoursSaved')}
            </th>
            <th className="px-4 py-3">Stage</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((opp, i) => (
            <tr
              key={`${opp.departmentSlug}-${opp.rank}`}
              className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
            >
              <td className="px-4 py-3 text-slate-500 font-mono">{i + 1}</td>
              <td className="px-4 py-3 text-white font-medium">{opp.name}</td>
              <td className="px-4 py-3 text-slate-300">
                {opp.departmentName}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded border text-xs font-medium ${impactColors[opp.impact] ?? impactColors.Low}`}
                >
                  {opp.impact}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-300">{opp.effort}</td>
              <td className="px-4 py-3 text-slate-300">
                {opp.parsedTimeSavings.valid
                  ? opp.parsedTimeSavings.display
                  : '—'}
              </td>
              <td className="px-4 py-3 text-slate-400">
                {opp.milestoneName}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 2: Verify no syntax errors**

```bash
npx tsc --noEmit
```

Expected: No errors in `PrioritiesTable.tsx` (there may be build errors from other pending changes, but the component itself should be clean).

- [ ] **Step 3: Commit**

```bash
git add src/components/PrioritiesTable.tsx
git commit -m "Add sortable PrioritiesTable component"
```

---

### Task 5: Replace TopWinsTable with PrioritiesTable on homepage

**Files:**
- Modify: `src/app/page.tsx`
- Delete: `src/components/TopWinsTable.tsx`

- [ ] **Step 1: Update homepage to use PrioritiesTable**

Replace the entire contents of `src/app/page.tsx` with:

```typescript
import { getCompanyOverview, getTopWins } from '@/lib/aggregator';
import { getMilestones } from '@/lib/parser';
import ScoreCard from '@/components/ScoreCard';
import DepartmentCard from '@/components/DepartmentCard';
import PrioritiesTable from '@/components/PrioritiesTable';
import MilestoneChart from '@/components/MilestoneChart';

export default function Home() {
  const overview = getCompanyOverview();
  const milestones = getMilestones();
  const allOpportunities = getTopWins(100);

  const chartData = milestones.map((m) => ({
    name: m.name,
    value: overview.byMilestoneStage[m.id] ?? 0,
  }));

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Company Overview
        </h1>
        <p className="text-slate-400 mt-1">
          Automation opportunities across all departments
        </p>
      </div>

      {/* Priorities Table — at the top */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          All Priorities
        </h2>
        <PrioritiesTable opportunities={allOpportunities} />
      </div>

      {/* Score Cards */}
      <ScoreCard
        totalOpportunities={overview.totalOpportunities}
        byMilestoneStage={overview.byMilestoneStage}
        totalCompleted={overview.totalCompleted}
        milestones={milestones}
      />

      {/* Milestone Chart + Department Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">
            Milestone Distribution
          </h2>
          <MilestoneChart data={chartData} />
        </div>

        {/* Department Cards */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">
            Departments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {overview.departments.map((dept) => (
              <DepartmentCard key={dept.slug} department={dept} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Delete TopWinsTable**

```bash
rm src/components/TopWinsTable.tsx
```

- [ ] **Step 3: Search for any remaining TopWinsTable references**

```bash
grep -r "TopWinsTable" src/
```

Expected: No results. If any references remain, remove them.

- [ ] **Step 4: Verify build**

```bash
npm run build
```

Expected: Build succeeds with 24 static pages.

- [ ] **Step 5: Commit**

```bash
git add src/app/page.tsx
git rm src/components/TopWinsTable.tsx
git commit -m "Replace TopWinsTable with sortable PrioritiesTable on homepage"
```

---

### Task 6: Create Unfiled page

**Files:**
- Create: `src/app/unfiled/page.tsx`

- [ ] **Step 1: Create the unfiled page**

Create `src/app/unfiled/page.tsx`:

```typescript
import { getUnfiledPriorities } from '@/lib/aggregator';

export default function UnfiledPage() {
  const unfiled = getUnfiledPriorities();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Unfiled Priorities
        </h1>
        <p className="text-slate-400 mt-1">
          Priorities missing valid time estimates in hours/week
        </p>
      </div>

      {unfiled.length === 0 ? (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-8 text-center">
          <p className="text-emerald-400 text-lg font-medium">
            All priorities have valid time estimates
          </p>
          <p className="text-slate-400 mt-2 text-sm">
            Every priority has a valid hours/week value.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <p className="text-amber-400 text-sm mb-4">
            {unfiled.length} {unfiled.length === 1 ? 'priority needs' : 'priorities need'} a valid hours/week estimate.
            Update the markdown files and reload.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="px-4 py-3">Priority</th>
                  <th className="px-4 py-3">Department</th>
                  <th className="px-4 py-3">Issue</th>
                  <th className="px-4 py-3">Current Text</th>
                </tr>
              </thead>
              <tbody>
                {unfiled.map((item) => (
                  <tr
                    key={`${item.departmentSlug}-${item.rank}`}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-white font-medium">
                      #{item.rank} — {item.name}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.departmentName}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded border text-xs font-medium bg-amber-500/20 text-amber-400 border-amber-500/30">
                        {item.issue}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 max-w-md truncate">
                      {item.rawText || '(no time estimate provided)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds. The `/unfiled` page should appear in the route list (now 25 static pages).

- [ ] **Step 3: Commit**

```bash
git add src/app/unfiled/page.tsx
git commit -m "Add Unfiled page listing priorities with invalid time estimates"
```

---

### Task 7: Add Unfiled nav link with count badge

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Update layout with Unfiled nav link**

Update `src/app/layout.tsx`. Add the import at the top:

```typescript
import { getUnfiledPriorities } from '@/lib/aggregator';
```

Then add the unfiled count and nav link. Replace the `<div className="flex items-center gap-1">` nav section with:

```typescript
              <div className="flex items-center gap-1">
                <Link
                  href="/"
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
                >
                  Overview
                </Link>
                <Link
                  href="/tracker"
                  className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
                >
                  Tracker
                </Link>
                <UnfiledNavLink />
              </div>
```

Then add the `UnfiledNavLink` component inside the same file, before the `RootLayout` function:

```typescript
function UnfiledNavLink() {
  const unfiledCount = getUnfiledPriorities().length;
  return (
    <Link
      href="/unfiled"
      className="px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
    >
      Unfiled
      {unfiledCount > 0 && (
        <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30">
          {unfiledCount}
        </span>
      )}
    </Link>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds with 25 static pages.

- [ ] **Step 3: Run all tests**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx
git commit -m "Add Unfiled nav link with count badge"
```
