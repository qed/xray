# Parsing Overhaul & Missing Gaps Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unify markdown parsing into a single robust module, add completeness scoring, and redesign Missing Gaps as a step-by-step card flow with guided input.

**Architecture:** Shared parser module (`src/lib/parse-markdown.ts`) replaces both `seed.ts` inline parsing and `parse-upload.ts`. Completeness scoring added to `db.ts`. Missing Gaps page redesigned as card-based guided editor. New PATCH API for inline priority updates.

**Tech Stack:** Next.js 16, TypeScript, Supabase, Tailwind CSS

---

## File Structure

| File | Action | Responsibility |
|------|--------|----------------|
| `src/lib/parse-markdown.ts` | Create | Unified markdown parser for profiles and priorities |
| `src/lib/__tests__/parse-markdown.test.ts` | Create | Unit tests for the parser |
| `src/lib/db.ts` | Modify | Add `getCompletenessScore()`, update `getTopWins()` and `getUnfiledRankedOpportunities()` |
| `src/lib/types.ts` | Modify | Add `Completeness` type, update `RankedOpportunity` |
| `src/components/GapCard.tsx` | Create | Card component for editing one incomplete priority |
| `src/components/GapCardList.tsx` | Create | Client wrapper managing card navigation state |
| `src/components/MissingGapsTable.tsx` | Delete | Replaced by GapCard flow |
| `src/app/org/[orgSlug]/unfiled/page.tsx` | Modify | Redesign to use card flow |
| `src/app/org/[orgSlug]/priorities/page.tsx` | Modify | Add completeness badges and updated banner |
| `src/components/PrioritiesTable.tsx` | Modify | Add completeness column |
| `src/app/api/priorities/[id]/route.ts` | Create | PATCH endpoint for inline priority edits |
| `src/app/api/upload/route.ts` | Modify | Use shared parser |
| `scripts/seed.ts` | Modify | Use shared parser |
| `src/lib/parse-upload.ts` | Delete | Replaced by parse-markdown.ts |

---

### Task 1: Create the unified parser module with tests

**Files:**
- Create: `src/lib/parse-markdown.ts`
- Create: `src/lib/__tests__/parse-markdown.test.ts`

- [ ] **Step 1: Write failing tests for `parsePriorities`**

Create `src/lib/__tests__/parse-markdown.test.ts`:

```typescript
import { parsePriorities, parseProfile } from '../parse-markdown';

// Minimal test fixtures representing the 4 department formats

const ACCOUNTING_MD = `# Accounting — Automation Priorities

## Priority Summary

| Rank | Opportunity | Est. Time Saved (weekly) | Complexity | Impact |
|---|---|---|---|---|
| 1 | Invoice Automation | ~2–3 hrs/week | Low | High |
| 2 | Credit Card Access | 1–2 week prep drag/month | Low | High |

---

### Priority 1: Invoice Automation

**What to automate/improve:**
Build system-generated POs that are QBO-ready.

**Current state:**
Accounting sets up customer in both QBO and Clover separately.

**Why it matters:**
Duplicate entry multiplies with deal volume.

**Complexity:** Low

**Dependencies:**
- Sales Directors to mandate rep review
- IT to complete PO solution

**Suggested approach:**
1. Use existing Excel template
2. IT builds system-generated PO

**Success criteria:**
Zero duplicate entry for new deals.

**Net time saved:** ~2–3 hrs/week for Nancy

---

### Priority 2: Credit Card Access

**What to automate/improve:**
Get daily VISA transaction visibility.

**Current state:**
Transactions are 5-6 weeks old before Accounting sees them.

**Why it matters:**
Late visibility causes reconciliation delays.

**Complexity:** Low

**Dependencies:**
- RBC Express access

**Suggested approach:**
Set up RBC Express daily access.

**Success criteria:**
Transactions visible within 1-2 business days.

**Net time saved:** 1–2 weeks of monthly prep drag collapsed
`;

const SALES_OPS_MD = `# Sales Operations — Automation Priorities

## Bottom Line

Fix data flow first.

---

## Priority 1 — Eliminate Duplicate Data Entry

**Status:** In Progress

**What to Automate:**
The same merchant data is keyed three to four times.

**Why It Matters:**
This is the single largest fixed labor cost.

**Estimated Time Savings:**
~65-70 minutes per merchant

**Complexity:** Medium-High

**Dependencies:**
- Dev team availability
- Fiserv Co-Pilot API access

**Suggested approach:**
1. Phase A: WeCenter intake form
2. Phase B: WeTrack to Co-Pilot API

**Success criteria:**
Under 20 minutes per merchant onboarding.

---

## Priority 2 — Automate Partner Onboarding

**Status:** Not started

**What to Automate:**
Five downstream steps are all done manually.

**Why It Matters:**
Clear trigger, predictable output, strong automation candidate.

**Estimated Time Savings:** 3-5 hours per new partner onboarded

**Complexity:** Medium

**Dependencies:**
- WeTrack API access

**Suggested approach:**
Automate the five steps end-to-end.

**Success criteria:**
Partner onboarding under 1 hour.
`;

const OPERATIONS_MD = `# Operations — Automation Priorities

## Priority Summary

| Rank | Opportunity | Who Saves Time | Weekly Time Saved | Monthly Time Saved | Complexity | Impact |
|---|---|---|---|---|---|---|
| 1 | Daily Digest | Scott, Robin | ~12.5 hrs | ~50 hrs | Low-Med | High |
| 2 | Form Validation | Laurie, Suzy | ~5 hrs | ~20 hrs | Medium | High |

---

### Priority 1: Daily Operational Digest

**What to automate/improve:**
AI agent compiles daily briefing covering Zendesk, deployments, RMAs.

**Current state:**
Scott has no real-time visibility. Information lives across multiple systems.

**Why it matters:**
Without visibility, Scott cannot manage proactively.

**Verified time savings:**

| Person | Weekly |
|---|---|
| Scott | ~5 hrs |
| Robin | ~5 hrs |
| Brian | ~2.5 hrs |

**Complexity:** Low-Medium

**Dependencies:**
- Zendesk API access
- MOTRS data access

**Suggested approach:**
1. Complete Zendesk daily digest
2. Add deployment metrics
3. Add RMA metrics

**Success criteria:**
Scott receives daily briefing with zero manual effort.

---

### Priority 2: Form Validation & Auto-Chase

**What to automate/improve:**
Automated validation of deployment forms.

**Current state:**
Manual checking of every field.

**Why it matters:**
Errors cause deployment delays.

**Complexity:** Medium

**Dependencies:**
- Form API access

**Suggested approach:**
Build validation layer that checks all required fields.

**Success criteria:**
Zero invalid forms reaching deployment team.
`;

const INFRA_MD = `# Infrastructure & Compliance — Priorities

## Priority Summary

| Rank | Opportunity | Current Time (weekly) | Automation Savings % | Net Time Saved (weekly) | Complexity | Impact |
|---|---|---|---|---|---|---|
| 1 | Alert Noise Reduction | 2.0 hrs | 50% | 1.0 hr | Low | High |
| 2 | Dev Team Coordination | 2.0 hrs | 50% | 1.0 hr | Low-Med | High |

---

### Priority 1: Alert Noise Reduction

**What to automate/improve:**
Reduce false-positive alerts from monitoring systems.

**Current state:**
Reza spends ~2 hrs/week triaging alerts, ~50% are noise.

**Why it matters:**
Alert fatigue causes real issues to be missed.

**Complexity:** Low

**Dependencies:**
- Access to alerting platform config

**Suggested approach:**
1. Audit current alert rules
2. Suppress known false positives
3. Create escalation tiers

**Success criteria:**
False-positive alerts reduced by 50%.

---

### Priority 2: Dev Team Coordination

**What to automate/improve:**
Streamline dev request intake and status tracking.

**Current state:**
Requests come via Slack, email, and verbal. No single queue.

**Why it matters:**
Work gets lost or duplicated without a single intake.

**Complexity:** Low-Medium

**Dependencies:**
- Agreement on intake tool

**Suggested approach:**
Implement a single request queue with SLA tracking.

**Success criteria:**
All dev requests tracked in one system with status visibility.
`;

describe('parsePriorities', () => {
  it('parses ### Priority N: format (accounting)', () => {
    const result = parsePriorities(ACCOUNTING_MD);
    expect(result).toHaveLength(2);
    expect(result[0].rank).toBe(1);
    expect(result[0].name).toBe('Invoice Automation');
    expect(result[0].whatToAutomate).toContain('system-generated POs');
    expect(result[0].currentState).toContain('QBO and Clover');
    expect(result[0].whyItMatters).toContain('Duplicate entry');
    expect(result[0].complexity).toBe('Low');
    expect(result[0].dependencies).toEqual(expect.arrayContaining([
      expect.stringContaining('Sales Directors'),
    ]));
    expect(result[0].suggestedApproach).toContain('Excel template');
    expect(result[0].successCriteria).toContain('Zero duplicate');
    // Time savings: summary table preferred, then "Net time saved" fallback
    expect(result[0].estimatedTimeSavings).toContain('2');
    expect(result[0].estimatedTimeSavings).toContain('3');
  });

  it('parses ## Priority N — format (sales-ops)', () => {
    const result = parsePriorities(SALES_OPS_MD);
    expect(result).toHaveLength(2);
    expect(result[0].rank).toBe(1);
    expect(result[0].name).toBe('Eliminate Duplicate Data Entry');
    expect(result[0].status).toBe('In Progress');
    expect(result[0].estimatedTimeSavings).toContain('65-70 minutes');
    expect(result[1].status).toBe('Not started');
  });

  it('parses operations format with "Weekly Time Saved" summary table', () => {
    const result = parsePriorities(OPERATIONS_MD);
    expect(result).toHaveLength(2);
    expect(result[0].rank).toBe(1);
    expect(result[0].name).toBe('Daily Operational Digest');
    // Summary table "Weekly Time Saved" column should provide time savings + /week
    expect(result[0].estimatedTimeSavings).toMatch(/12\.5.*hrs.*\/week/i);
    expect(result[1].estimatedTimeSavings).toMatch(/5.*hrs.*\/week/i);
  });

  it('parses infrastructure format with "Net Time Saved (weekly)" table', () => {
    const result = parsePriorities(INFRA_MD);
    expect(result).toHaveLength(2);
    expect(result[0].estimatedTimeSavings).toMatch(/1\.0.*hr.*\/week/i);
  });

  it('reports missing fields correctly', () => {
    const result = parsePriorities(SALES_OPS_MD);
    // Priority 1 has no currentState (uses "What to Automate" not "Current state")
    expect(result[0].missingFields).toContain('currentState');
    // Priority 1 has impact missing (no **Impact:** line)
    expect(result[0].missingFields).toContain('impact');
  });

  it('strips bold markdown from field values', () => {
    const result = parsePriorities(INFRA_MD);
    expect(result[0].complexity).not.toContain('**');
    expect(result[0].estimatedTimeSavings).not.toContain('**');
  });

  it('handles empty input', () => {
    expect(parsePriorities('')).toEqual([]);
    expect(parsePriorities('# Just a title\nNo priorities here.')).toEqual([]);
  });
});

describe('parseProfile', () => {
  const PROFILE_MD = `# Accounting Department Profile

## Mission
Support WeVend and MONEX financial operations.

## Scope
All bookkeeping, payroll, AP/AR, and tax compliance.

## People & Roles

### Team Roster

| Name | Title | Key Responsibilities |
|---|---|---|
| Nancy ShuPan | Accounting Coordinator | Bookkeeping, AP/AR, payroll |
| Kylie Nguyen | Accounting Clerk | Invoice processing, PO entry |

## Tools & Systems

### Tool Stack
- QuickBooks Online (QBO)
- Clover POS
- Excel

## Pain Points & Bottlenecks

### Pain Points
- Duplicate data entry across QBO and Clover
- Manual commission calculations

### Single Points of Failure
- Nancy is the only person who knows the full payroll process
- Kylie handles all Phorge deal closings solo

### Tribal Knowledge Risks
- Payroll process is undocumented
- Commission logic lives in Nancy's head
`;

  it('extracts profile fields', () => {
    const result = parseProfile(PROFILE_MD);
    expect(result.name).toContain('Accounting');
    expect(result.mission).toContain('financial operations');
    expect(result.scope).toContain('bookkeeping');
    expect(result.teamMembers).toHaveLength(2);
    expect(result.teamMembers[0].name).toBe('Nancy ShuPan');
    expect(result.teamMembers[0].title).toBe('Accounting Coordinator');
    expect(result.tools).toContain('QuickBooks Online (QBO)');
    expect(result.painPoints).toHaveLength(2);
    expect(result.singlePointsOfFailure).toHaveLength(2);
    expect(result.tribalKnowledgeRisks).toHaveLength(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx jest src/lib/__tests__/parse-markdown.test.ts --no-cache 2>&1 | head -20`
Expected: FAIL — `Cannot find module '../parse-markdown'`

- [ ] **Step 3: Implement `src/lib/parse-markdown.ts`**

```typescript
import type { TeamMember } from '@/lib/types';

// ───── Types ─────

export interface ParsedProfile {
  name: string;
  mission: string;
  scope: string;
  teamMembers: TeamMember[];
  tools: string[];
  singlePointsOfFailure: string[];
  painPoints: string[];
  tribalKnowledgeRisks: string[];
}

export interface ParsedPriority {
  rank: number;
  name: string;
  effort: string;
  complexity: string;
  impact: string;
  whatToAutomate: string;
  currentState: string;
  whyItMatters: string;
  estimatedTimeSavings: string;
  suggestedApproach: string;
  successCriteria: string;
  dependencies: string[];
  status: string;
  missingFields: string[];
}

const REQUIRED_FIELDS = [
  'name', 'whatToAutomate', 'currentState', 'whyItMatters',
  'estimatedTimeSavings', 'complexity', 'impact',
  'suggestedApproach', 'successCriteria', 'dependencies',
] as const;

// ───── Helpers ─────

function stripBold(s: string): string {
  return s.replace(/\*\*/g, '').replace(/^\|+|\|+$/g, '').trim();
}

/** Try multiple heading/label variants for a single-line field value. */
function findField(lines: string[], variants: string[]): string {
  for (const variant of variants) {
    const pattern = new RegExp(`\\*?\\*?${variant}\\*?\\*?[:\\s]+(.+)`, 'i');
    for (const line of lines) {
      const match = line.match(pattern);
      if (match) return stripBold(match[1]);
    }
  }
  return '';
}

/** Extract multi-line section content under a heading matching one of the variants. */
function findSection(lines: string[], variants: string[], headingLevel: number): string {
  const headingPattern = new RegExp(`^#{${headingLevel},${headingLevel + 1}}\\s`, '');
  for (const variant of variants) {
    const sectionPattern = new RegExp(`^#{${headingLevel},${headingLevel + 1}}\\s.*${variant}`, 'i');
    let inSection = false;
    const parts: string[] = [];
    for (const line of lines) {
      if (sectionPattern.test(line)) { inSection = true; continue; }
      if (inSection && headingPattern.test(line)) break;
      if (inSection && line.trim()) parts.push(line.trim());
    }
    if (parts.length > 0) return parts.join('\n');
  }
  return '';
}

/** Extract bullet list items from a section. */
function findList(lines: string[], variants: string[], headingLevel: number): string[] {
  const headingPattern = new RegExp(`^#{${headingLevel},${headingLevel + 1}}\\s`, '');
  for (const variant of variants) {
    const sectionPattern = new RegExp(`^#{${headingLevel},${headingLevel + 1}}\\s.*${variant}`, 'i');
    let inSection = false;
    const items: string[] = [];
    for (const line of lines) {
      if (sectionPattern.test(line)) { inSection = true; continue; }
      if (inSection && headingPattern.test(line)) break;
      if (inSection && /^[-*]\s/.test(line.trim())) {
        items.push(line.trim().replace(/^[-*]\s*/, ''));
      }
    }
    if (items.length > 0) return items;
  }
  return [];
}

// ───── Summary Table Parser ─────

function parseSummaryTable(lines: string[]): Map<number, string> {
  const timeSavings = new Map<number, string>();
  let timeColIndex = -1;
  let isWeeklyCol = false;
  let inTable = false;

  for (const line of lines) {
    // Detect header row: must have rank + a time-related column
    if (line.includes('|') && /rank/i.test(line) && /(time\s*sav|est\.\s*time|net\s*time)/i.test(line)) {
      const headers = line.split('|').map((c) => c.trim());
      // Prefer "weekly time saved" or "net time saved (weekly)" column
      timeColIndex = headers.findIndex((h) =>
        /(weekly\s*time\s*sav|est\.\s*time\s*sav|net\s*time\s*sav)/i.test(h)
      );
      if (timeColIndex < 0) {
        timeColIndex = headers.findIndex((h) => /(time\s*sav|est\.\s*time)/i.test(h));
      }
      isWeeklyCol = timeColIndex > 0 && /weekly/i.test(headers[timeColIndex]);
      inTable = true;
      continue;
    }
    if (inTable && /^[|\s-]+$/.test(line)) continue; // separator row
    if (inTable && timeColIndex > 0 && line.includes('|')) {
      const cols = line.split('|').map((c) => c.trim());
      const rankMatch = cols[1]?.match(/^\d+/);
      if (rankMatch && cols[timeColIndex]) {
        let val = stripBold(cols[timeColIndex]);
        if (isWeeklyCol && val && /^~?\d/.test(val) && !/(week|wk|month|day|year)/i.test(val)) {
          val = val + '/week';
        }
        if (val) timeSavings.set(parseInt(rankMatch[0], 10), val);
      }
    }
    if (inTable && !line.includes('|') && line.trim()) {
      timeColIndex = -1;
      inTable = false;
    }
  }
  return timeSavings;
}

// ───── Heading Detection ─────

/** Detect the heading pattern used for priorities and return a splitting regex. */
function detectPriorityPattern(text: string): RegExp | null {
  // Try patterns in order of specificity
  const patterns: { test: RegExp; split: RegExp }[] = [
    { test: /^###\s+Priority\s+\d+/m, split: /^###\s+Priority\s+(\d+)/mi },
    { test: /^##\s+Priority\s+\d+/m, split: /^##\s+Priority\s+(\d+)/mi },
    { test: /^##\s+\d+[.:)\s]/m, split: /^##\s+(\d+)[.:)\s]/mi },
  ];
  for (const { test, split } of patterns) {
    if (test.test(text)) return split;
  }
  return null;
}

// ───── Public API ─────

export function parsePriorities(text: string): ParsedPriority[] {
  if (!text.trim()) return [];

  const allLines = text.split('\n');
  const summaryTimeSavings = parseSummaryTable(allLines);
  const splitPattern = detectPriorityPattern(text);
  if (!splitPattern) return [];

  // Determine heading level for subsections within a priority
  const isH3Priority = splitPattern.source.includes('###');
  const subHeadingLevel = isH3Priority ? 4 : 3; // ### priorities use #### subsections, ## uses ###

  const sections = text.split(splitPattern);
  const priorities: ParsedPriority[] = [];

  for (let i = 1; i < sections.length; i += 2) {
    const rank = parseInt(sections[i], 10);
    const content = sections[i + 1] ?? '';
    const contentLines = content.split('\n');

    // Extract name from the first non-empty content line (after the heading split)
    const nameMatch = contentLines[0]?.match(/^[:\s\u2014\u2013\-—]*(.+)/);
    const name = nameMatch?.[1]?.trim() ?? `Priority ${rank}`;

    const whatToAutomate = findSection(contentLines, ['what to automate', 'what to improve', 'what to build', 'what to automate/improve'], subHeadingLevel);
    const currentState = findSection(contentLines, ['current state', 'current process', 'current status', 'target state'], subHeadingLevel);
    const whyItMatters = findSection(contentLines, ['why it matters', 'why'], subHeadingLevel);
    const suggestedApproach = findSection(contentLines, ['suggested approach', 'approach', 'recommendation'], subHeadingLevel);
    const successCriteria = findSection(contentLines, ['success criteria', 'success'], subHeadingLevel);
    const dependencies = findList(contentLines, ['dependencies', 'depends on'], subHeadingLevel);

    const effort = findField(contentLines, ['effort']);
    const complexity = findField(contentLines, ['complexity']);
    const impact = findField(contentLines, ['impact']);
    const status = findField(contentLines, ['status']);

    // Time savings: prefer summary table, then try inline fields
    const estimatedTimeSavings =
      summaryTimeSavings.get(rank) ||
      findField(contentLines, ['estimated time savings', 'estimated time saving']) ||
      findField(contentLines, ['net time saved']) ||
      findField(contentLines, ['time savings', 'time saving']) ||
      findField(contentLines, ['verified time savings']) ||
      '';

    // Check which required fields are missing
    const priority: ParsedPriority = {
      rank, name, effort, complexity, impact,
      whatToAutomate, currentState, whyItMatters,
      estimatedTimeSavings, suggestedApproach, successCriteria,
      dependencies, status, missingFields: [],
    };

    const missingFields: string[] = [];
    for (const field of REQUIRED_FIELDS) {
      const value = field === 'dependencies'
        ? priority.dependencies
        : priority[field as keyof ParsedPriority];
      if (Array.isArray(value) ? value.length === 0 : !value) {
        missingFields.push(field);
      }
    }
    priority.missingFields = missingFields;

    priorities.push(priority);
  }

  return priorities;
}

export function parseProfile(text: string): ParsedProfile {
  const lines = text.split('\n');

  function extractSection(heading: string): string[] {
    const items: string[] = [];
    let inSection = false;
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) { inSection = true; continue; }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.startsWith('- ')) items.push(line.replace(/^-\s*/, '').trim());
    }
    return items;
  }

  function extractText(heading: string): string {
    let inSection = false;
    const parts: string[] = [];
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) { inSection = true; continue; }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.trim()) parts.push(line.trim());
    }
    return parts.join(' ');
  }

  const teamMembers: TeamMember[] = [];
  let inTeamSection = false;
  let pastHeader = false;
  for (const line of lines) {
    if (line.match(/^#{1,3}\s.*team/i)) { inTeamSection = true; continue; }
    if (inTeamSection && /^#{1,3}\s/.test(line) && !line.match(/team/i)) break;
    if (inTeamSection && line.includes('|') && line.includes('---')) { pastHeader = true; continue; }
    if (inTeamSection && pastHeader && line.includes('|')) {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        teamMembers.push({ name: cols[0], title: cols[1] ?? '', responsibilities: cols[2] ?? '' });
      }
    }
  }

  const name = (lines.find((l) => /^#\s/.test(l)) ?? '')
    .replace(/^#\s*/, '')
    .replace(/department\s*profile/i, '')
    .trim();

  return {
    name,
    mission: extractText('mission') || extractText('purpose'),
    scope: extractText('scope'),
    teamMembers,
    tools: extractSection('tools') || extractSection('software'),
    singlePointsOfFailure: extractSection('single point'),
    painPoints: extractSection('pain point'),
    tribalKnowledgeRisks: extractSection('tribal knowledge'),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx jest src/lib/__tests__/parse-markdown.test.ts --no-cache 2>&1`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/parse-markdown.ts src/lib/__tests__/parse-markdown.test.ts
git commit -m "feat: add unified markdown parser with format detection and completeness tracking"
```

---

### Task 2: Add completeness scoring to types and db

**Files:**
- Modify: `src/lib/types.ts`
- Modify: `src/lib/db.ts`

- [ ] **Step 1: Add Completeness type to types.ts**

Add after the `ParsedTimeSavings` type (after line 104):

```typescript
export interface Completeness {
  score: number;   // 0-10
  total: number;   // always 10
  missing: string[]; // field names that are empty
}
```

Add `completeness` to `RankedOpportunity` (after line 99, before the closing `}`):

```typescript
  completeness: Completeness;
```

Also add `id` to `RankedOpportunity` (after line 82, for the PATCH API to work):

```typescript
  id: string;
```

- [ ] **Step 2: Add `getCompletenessScore` to db.ts and update `getTopWins`**

Add after the `parseTimeSavings` function (after line 238):

```typescript
const REQUIRED_PRIORITY_FIELDS = [
  'name', 'what_to_automate', 'current_state', 'why_it_matters',
  'estimated_time_savings', 'complexity', 'impact',
  'suggested_approach', 'success_criteria', 'dependencies',
] as const;

export function getCompletenessScore(p: { [key: string]: unknown; dependencies?: string[] | unknown }): { score: number; total: number; missing: string[] } {
  const missing: string[] = [];
  for (const field of REQUIRED_PRIORITY_FIELDS) {
    const value = p[field];
    if (Array.isArray(value) ? value.length === 0 : !value) {
      missing.push(field);
    }
  }
  return { score: 10 - missing.length, total: 10, missing };
}
```

Update the `getTopWins` function to include `id` and `completeness` in the mapped result. In the `return { ... }` block inside `allPriorities.map(...)`, add:

```typescript
      id: p.id,
      completeness: getCompletenessScore(p),
```

- [ ] **Step 3: Update `getUnfiledRankedOpportunities` to use completeness scoring**

Replace the current function:

```typescript
export async function getUnfiledRankedOpportunities(orgId: string): Promise<RankedOpportunity[]> {
  const all = await getTopWins(orgId, 1000);
  return all
    .filter((opp) => opp.completeness.score < 10)
    .sort((a, b) => a.completeness.score - b.completeness.score);
}
```

- [ ] **Step 4: Build to verify no type errors**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/lib/types.ts src/lib/db.ts
git commit -m "feat: add completeness scoring to priorities (10-field schema)"
```

---

### Task 3: Create the PATCH API for inline priority edits

**Files:**
- Create: `src/app/api/priorities/[id]/route.ts`

- [ ] **Step 1: Create the PATCH endpoint**

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const ALLOWED_FIELDS = new Set([
  'name', 'effort', 'complexity', 'impact',
  'what_to_automate', 'current_state', 'why_it_matters',
  'estimated_time_savings', 'suggested_approach', 'success_criteria',
  'dependencies', 'status',
]);

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Verify priority exists and user has access to the org
  const { data: priority } = await supabase
    .from('priorities')
    .select('id, department:departments(org_id)')
    .eq('id', id)
    .single();

  if (!priority) {
    return NextResponse.json({ error: 'Priority not found' }, { status: 404 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const orgId = (priority as any).department?.org_id;
  const { data: membership } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', user.id)
    .single();

  if (!membership) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Parse and validate update body
  const body = await request.json();
  const updates: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body)) {
    if (ALLOWED_FIELDS.has(key)) {
      updates[key] = value;
    }
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
  }

  const { error } = await supabase
    .from('priorities')
    .update(updates)
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: Build to verify route compiles**

Run: `npx next build 2>&1 | tail -10`
Expected: Build succeeds, shows `/api/priorities/[id]` in route list

- [ ] **Step 3: Commit**

```bash
git add src/app/api/priorities/[id]/route.ts
git commit -m "feat: add PATCH /api/priorities/:id endpoint for inline edits"
```

---

### Task 4: Build GapCard component

**Files:**
- Create: `src/components/GapCard.tsx`

- [ ] **Step 1: Create the GapCard client component**

```typescript
'use client';

import { useState } from 'react';
import type { RankedOpportunity } from '@/lib/types';

// Map camelCase field names to display labels and DB column names
const FIELD_CONFIG: Record<string, { label: string; dbColumn: string; type: 'text' | 'textarea' | 'select' | 'time' | 'tags' }> = {
  name: { label: 'Priority Name', dbColumn: 'name', type: 'text' },
  whatToAutomate: { label: 'What to Automate', dbColumn: 'what_to_automate', type: 'textarea' },
  currentState: { label: 'Current State', dbColumn: 'current_state', type: 'textarea' },
  whyItMatters: { label: 'Why It Matters', dbColumn: 'why_it_matters', type: 'textarea' },
  estimatedTimeSavings: { label: 'Time Savings (hrs/week)', dbColumn: 'estimated_time_savings', type: 'time' },
  complexity: { label: 'Complexity', dbColumn: 'complexity', type: 'select' },
  impact: { label: 'Impact', dbColumn: 'impact', type: 'select' },
  suggestedApproach: { label: 'Suggested Approach', dbColumn: 'suggested_approach', type: 'textarea' },
  successCriteria: { label: 'Success Criteria', dbColumn: 'success_criteria', type: 'textarea' },
  dependencies: { label: 'Dependencies', dbColumn: 'dependencies', type: 'tags' },
};

const COMPLEXITY_OPTIONS = ['Low', 'Low-Medium', 'Medium', 'Medium-High', 'High'];
const IMPACT_OPTIONS = ['Low', 'Medium', 'High', 'Very High', 'Critical'];

interface GapCardProps {
  priority: RankedOpportunity;
  index: number;
  total: number;
  onSaved: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export default function GapCard({ priority, index, total, onSaved, onNext, onPrev }: GapCardProps) {
  const missing = priority.completeness.missing;
  const [values, setValues] = useState<Record<string, string | string[]>>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showFilled, setShowFilled] = useState(false);

  // Time savings structured input
  const [timeMin, setTimeMin] = useState('');
  const [timeMax, setTimeMax] = useState('');
  const [isRange, setIsRange] = useState(false);

  function getValue(field: string): string | string[] {
    if (field in values) return values[field];
    // Get current value from priority
    const v = priority[field as keyof RankedOpportunity];
    if (Array.isArray(v)) return v as string[];
    return (v as string) ?? '';
  }

  function setValue(field: string, val: string | string[]) {
    setValues((prev) => ({ ...prev, [field]: val }));
  }

  async function handleSave(andNext: boolean) {
    setSaving(true);
    setError('');

    const updates: Record<string, unknown> = {};
    for (const [field, val] of Object.entries(values)) {
      const config = FIELD_CONFIG[field];
      if (config) updates[config.dbColumn] = val;
    }

    // Handle structured time savings
    if (timeMin) {
      const timeSavings = isRange && timeMax
        ? `${timeMin}-${timeMax} hrs/week`
        : `${timeMin} hrs/week`;
      updates['estimated_time_savings'] = timeSavings;
    }

    if (Object.keys(updates).length === 0) {
      if (andNext) onNext();
      setSaving(false);
      return;
    }

    try {
      const res = await fetch(`/api/priorities/${priority.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Save failed');
        setSaving(false);
        return;
      }
      onSaved();
      if (andNext) onNext();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  // Map DB column names in missing[] to camelCase field names
  const dbToField: Record<string, string> = {};
  for (const [field, config] of Object.entries(FIELD_CONFIG)) {
    dbToField[config.dbColumn] = field;
  }
  const missingFieldNames = missing.map((m) => dbToField[m] || m);

  // Fields that are already filled (not in missing)
  const allFields = Object.keys(FIELD_CONFIG);
  const filledFields = allFields.filter((f) => !missingFieldNames.includes(f));

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              #{priority.rank} — {priority.name}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">{priority.departmentName}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-600">
              {priority.completeness.score}/{priority.completeness.total}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i < priority.completeness.score ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body — missing fields */}
      <div className="px-6 py-4 space-y-4">
        {missingFieldNames.length === 0 ? (
          <p className="text-emerald-600 text-sm font-medium">All fields complete!</p>
        ) : (
          <>
            <p className="text-sm text-amber-700">
              {missingFieldNames.length} {missingFieldNames.length === 1 ? 'field needs' : 'fields need'} data:
            </p>
            {missingFieldNames.map((field) => {
              const config = FIELD_CONFIG[field];
              if (!config) return null;
              return (
                <div key={field}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    {config.label}
                  </label>
                  {config.type === 'textarea' && (
                    <textarea
                      rows={3}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={(getValue(field) as string)}
                      onChange={(e) => setValue(field, e.target.value)}
                      placeholder={`Enter ${config.label.toLowerCase()}...`}
                    />
                  )}
                  {config.type === 'text' && (
                    <input
                      type="text"
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={(getValue(field) as string)}
                      onChange={(e) => setValue(field, e.target.value)}
                      placeholder={`Enter ${config.label.toLowerCase()}...`}
                    />
                  )}
                  {config.type === 'select' && (
                    <select
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={(getValue(field) as string)}
                      onChange={(e) => setValue(field, e.target.value)}
                    >
                      <option value="">Select {config.label.toLowerCase()}...</option>
                      {(field === 'complexity' ? COMPLEXITY_OPTIONS : IMPACT_OPTIONS).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {config.type === 'time' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                        value={timeMin}
                        onChange={(e) => setTimeMin(e.target.value)}
                        placeholder="Min"
                      />
                      {isRange && (
                        <>
                          <span className="text-slate-400">–</span>
                          <input
                            type="number"
                            step="0.5"
                            min="0"
                            className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            value={timeMax}
                            onChange={(e) => setTimeMax(e.target.value)}
                            placeholder="Max"
                          />
                        </>
                      )}
                      <span className="text-sm text-slate-500">hrs/week</span>
                      <button
                        type="button"
                        onClick={() => setIsRange(!isRange)}
                        className="text-xs text-emerald-600 underline"
                      >
                        {isRange ? 'Single value' : 'Range'}
                      </button>
                    </div>
                  )}
                  {config.type === 'tags' && (
                    <TagInput
                      value={(getValue(field) as string[]) || []}
                      onChange={(tags) => setValue(field, tags)}
                    />
                  )}
                </div>
              );
            })}
          </>
        )}

        {/* Filled fields (collapsed) */}
        {filledFields.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setShowFilled(!showFilled)}
              className="text-sm text-slate-500 flex items-center gap-1"
            >
              <span className={`transition-transform ${showFilled ? 'rotate-90' : ''}`}>▶</span>
              {filledFields.length} completed {filledFields.length === 1 ? 'field' : 'fields'}
            </button>
            {showFilled && (
              <div className="mt-2 space-y-2">
                {filledFields.map((field) => {
                  const config = FIELD_CONFIG[field];
                  if (!config) return null;
                  const val = getValue(field);
                  const display = Array.isArray(val) ? val.join(', ') : val;
                  return (
                    <div key={field} className="text-sm">
                      <span className="font-medium text-slate-600">{config.label}:</span>{' '}
                      <span className="text-slate-500">{display || '—'}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onPrev}
            disabled={index === 0}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="px-2 py-1.5 text-sm text-slate-400">
            {index + 1} of {total}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={index === total - 1}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            Skip
          </button>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-4 py-1.5 text-sm rounded-lg border border-emerald-300 text-emerald-700 hover:bg-emerald-50 disabled:opacity-40 transition-colors"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-4 py-1.5 text-sm rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-40 transition-colors"
          >
            {saving ? 'Saving...' : 'Save & Next'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ───── Tag Input sub-component ─────

function TagInput({ value, onChange }: { value: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('');

  function addTag() {
    const tag = input.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setInput('');
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-2">
        {value.map((tag, i) => (
          <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-sm text-slate-700">
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="text-slate-400 hover:text-red-500"
            >
              x
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
          placeholder="Type dependency and press Enter..."
        />
        <button
          type="button"
          onClick={addTag}
          className="px-3 py-2 text-sm rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build to verify component compiles**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/components/GapCard.tsx
git commit -m "feat: add GapCard component with guided input for missing fields"
```

---

### Task 5: Build GapCardList wrapper and redesign unfiled page

**Files:**
- Create: `src/components/GapCardList.tsx`
- Modify: `src/app/org/[orgSlug]/unfiled/page.tsx`
- Delete: `src/components/MissingGapsTable.tsx`

- [ ] **Step 1: Create GapCardList client wrapper**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { RankedOpportunity } from '@/lib/types';
import GapCard from './GapCard';

interface GapCardListProps {
  priorities: RankedOpportunity[];
  totalPriorities: number;
}

export default function GapCardList({ priorities, totalPriorities }: GapCardListProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = priorities.length;

  if (total === 0) return null;

  const current = priorities[currentIndex];

  function handleSaved() {
    router.refresh(); // Re-fetch server data
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }

  const overallComplete = totalPriorities - total;
  const percent = Math.round((overallComplete / totalPriorities) * 100);

  return (
    <div className="space-y-6">
      {/* Progress summary */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-slate-600">
            {overallComplete} of {totalPriorities} priorities are complete
          </span>
          <span className="text-sm font-medium text-slate-700">{percent}%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-emerald-500 h-2 rounded-full transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Current card */}
      <GapCard
        key={current.id}
        priority={current}
        index={currentIndex}
        total={total}
        onSaved={handleSaved}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}
```

- [ ] **Step 2: Rewrite the unfiled page**

Replace the entire contents of `src/app/org/[orgSlug]/unfiled/page.tsx`:

```typescript
import { notFound } from 'next/navigation';
import { getOrgBySlug, getUnfiledRankedOpportunities, getTopWins } from '@/lib/db';
import GapCardList from '@/components/GapCardList';

export default async function UnfiledPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const unfiled = await getUnfiledRankedOpportunities(org.id);
  const all = await getTopWins(org.id, 1000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Missing Gaps</h1>
        <p className="text-slate-500 mt-1">Fill in missing data to complete your priorities</p>
      </div>

      {unfiled.length === 0 ? (
        <div className="bg-slate-50 border border-emerald-200 rounded-xl p-8 text-center">
          <p className="text-emerald-600 text-lg font-medium">All priorities are complete</p>
          <p className="text-slate-500 mt-2 text-sm">Every priority has all 10 required fields filled in.</p>
        </div>
      ) : (
        <GapCardList priorities={unfiled} totalPriorities={all.length} />
      )}
    </div>
  );
}
```

- [ ] **Step 3: Delete MissingGapsTable.tsx**

Run: `git rm src/components/MissingGapsTable.tsx`

- [ ] **Step 4: Build to verify**

Run: `npx next build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/GapCardList.tsx src/app/org/\[orgSlug\]/unfiled/page.tsx
git add -u  # picks up deleted MissingGapsTable.tsx
git commit -m "feat: redesign Missing Gaps as step-by-step card flow with guided input"
```

---

### Task 6: Add completeness badges to AI Priorities page

**Files:**
- Modify: `src/components/PrioritiesTable.tsx`
- Modify: `src/app/org/[orgSlug]/priorities/page.tsx`

- [ ] **Step 1: Add completeness column to PrioritiesTable**

In `src/components/PrioritiesTable.tsx`, add a new column after the "Stage" column.

Add to the `<thead>` row (after the Stage `<th>`):

```tsx
            <th className="px-4 py-3">Complete</th>
```

Add to each `<tr>` in the `<tbody>` (after the Stage `<td>`):

```tsx
              <td className="px-4 py-3">
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                    opp.completeness.score === 10
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {opp.completeness.score}/{opp.completeness.total}
                </span>
              </td>
```

- [ ] **Step 2: Update the priorities page banner to show completeness info**

Replace the amber banner in `src/app/org/[orgSlug]/priorities/page.tsx`:

```typescript
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrgBySlug, getTopWins } from '@/lib/db';
import PrioritiesTable from '@/components/PrioritiesTable';

export default async function PrioritiesPage({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  const org = await getOrgBySlug(orgSlug);
  if (!org) notFound();

  const allOpportunities = await getTopWins(org.id, 100);
  const valid = allOpportunities.filter((o) => o.parsedTimeSavings.valid);
  const incompleteCount = allOpportunities.filter((o) => o.completeness.score < 10).length;

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">AI Priorities</h1>
        <p className="text-slate-500 mt-1">Automation opportunities ranked by impact</p>
      </div>

      {incompleteCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
          <p className="text-amber-800 text-sm">
            {incompleteCount} {incompleteCount === 1 ? 'priority has' : 'priorities have'} incomplete data.{' '}
            <Link href={`/org/${orgSlug}/unfiled`} className="font-medium underline hover:text-amber-900">
              Fill Missing Gaps
            </Link>{' '}
            to improve your analysis.
          </p>
        </div>
      )}

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">All Priorities</h2>
        <PrioritiesTable opportunities={valid} />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Build to verify**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/PrioritiesTable.tsx src/app/org/\[orgSlug\]/priorities/page.tsx
git commit -m "feat: add completeness badges to AI Priorities page"
```

---

### Task 7: Wire up shared parser to seed.ts and upload route

**Files:**
- Modify: `scripts/seed.ts`
- Modify: `src/app/api/upload/route.ts`
- Delete: `src/lib/parse-upload.ts`

- [ ] **Step 1: Rewrite seed.ts to use shared parser**

Replace the inline profile and priority parsing in `scripts/seed.ts` with imports from the shared module. The seed script runs via `tsx` outside Next.js, so it needs a direct relative import. Create a thin re-export at `scripts/parse-helper.ts`:

Actually, `tsx` resolves `@/` paths via `tsconfig.json` paths, so the import works directly. Replace the `parseDepartmentProfile` function and the entire priority parsing block in seed.ts.

The key changes in `seed.ts`:
1. Remove the `parseDepartmentProfile` function (lines 30-82)
2. Remove all inline priority parsing (lines 165-224 area)
3. Import from shared parser
4. Use `parseProfile()` and `parsePriorities()` instead

Replace the imports at the top of seed.ts and the entire `parseDepartmentProfile` function with:

```typescript
// At top of file, add:
import { parseProfile, parsePriorities } from '../src/lib/parse-markdown';
```

Replace `profile = parseDepartmentProfile(readFile(profilePath))` with:

```typescript
        if (fs.existsSync(profilePath)) {
          profile = parseProfile(readFile(profilePath));
          deptName = profile.name || deptName;
        }
```

(The `profile` variable type changes from the inline return type to `ParsedProfile`.)

Replace the entire priority import block (from `if (fs.existsSync(prioritiesPath))` to the closing `}`) with:

```typescript
        if (fs.existsSync(prioritiesPath)) {
          const priorityText = readFile(prioritiesPath);
          const priorities = parsePriorities(priorityText);

          await supabase.from('priorities').delete().eq('department_id', dept.id);

          if (priorities.length > 0) {
            const { data: inserted } = await supabase
              .from('priorities')
              .insert(priorities.map((p) => ({
                department_id: dept.id,
                rank: p.rank,
                name: p.name,
                effort: p.effort,
                complexity: p.complexity,
                impact: p.impact,
                what_to_automate: p.whatToAutomate,
                current_state: p.currentState,
                why_it_matters: p.whyItMatters,
                estimated_time_savings: p.estimatedTimeSavings,
                suggested_approach: p.suggestedApproach,
                success_criteria: p.successCriteria,
                dependencies: p.dependencies,
                status: p.status,
              })))
              .select();

            if (inserted) {
              await supabase.from('milestones').insert(
                inserted.map((p) => ({ priority_id: p.id, stage: 0 }))
              );
            }
            console.log(`    ${priorities.length} priorities`);
          }
        }
```

- [ ] **Step 2: Update upload route to use shared parser**

Replace the import in `src/app/api/upload/route.ts`:

```typescript
// Replace:
import { parsePrioritiesFromText, parseProfileFromText } from '@/lib/parse-upload';
// With:
import { parsePriorities, parseProfile } from '@/lib/parse-markdown';
```

Replace `parseProfileFromText(text)` with `parseProfile(text)` and `parsePrioritiesFromText(text)` with `parsePriorities(text)`.

Also fix the rank handling — use parsed rank instead of array index:

```typescript
              rank: p.rank,  // was: i + 1
```

- [ ] **Step 3: Delete parse-upload.ts**

Run: `git rm src/lib/parse-upload.ts`

- [ ] **Step 4: Run seed to verify parsing still works**

Run: `npx tsx scripts/seed.ts 2>&1`
Expected: Same output as before — 9 + 7 + 11 + 8 = 35 priorities

- [ ] **Step 5: Build to verify upload route compiles**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 6: Commit**

```bash
git add scripts/seed.ts src/app/api/upload/route.ts
git add -u  # picks up deleted parse-upload.ts
git commit -m "refactor: unify parsing — seed.ts and upload route use shared parse-markdown module"
```

---

### Task 8: Run parseTimeSavings tests and full build, deploy

**Files:**
- Modify: `src/lib/__tests__/parseTimeSavings.test.ts` (if import path changed)

- [ ] **Step 1: Run all tests**

Run: `npx jest --no-cache 2>&1`
Expected: All tests pass

- [ ] **Step 2: Re-seed WeVend data with the unified parser**

Run: `npx tsx scripts/seed.ts 2>&1`
Expected: 35 priorities imported (9+7+11+8)

- [ ] **Step 3: Full build**

Run: `npx next build 2>&1 | tail -10`
Expected: Build succeeds with all routes

- [ ] **Step 4: Commit any remaining changes**

```bash
git add -A
git commit -m "chore: final build verification for parsing overhaul"
```

- [ ] **Step 5: Push and deploy**

```bash
git push origin main
```

Expected: Vercel auto-deploys from main. Verify at the live URL:
1. `/org/wevend/priorities` — shows priorities with completeness badges
2. `/org/wevend/unfiled` — shows card flow for incomplete priorities
3. Fill in a missing field on a gap card, verify it saves

---

## Self-Review Checklist

1. **Spec coverage:**
   - Unified parser module: Task 1
   - Completeness scoring: Task 2
   - PATCH API: Task 3
   - GapCard component: Task 4
   - Missing Gaps card flow: Task 5
   - Completeness badges: Task 6
   - Consumer updates (seed + upload): Task 7
   - Delete parse-upload.ts: Task 7
   - Testing & deploy: Task 8

2. **Placeholder scan:** No TBDs, TODOs, or "fill in later" found.

3. **Type consistency:**
   - `ParsedPriority` type matches between parse-markdown.ts (Task 1) and consumers (Task 7)
   - `Completeness` type defined in Task 2, used in GapCard (Task 4) and PrioritiesTable (Task 6)
   - `RankedOpportunity.id` added in Task 2, used by GapCard PATCH call (Task 4)
   - `RankedOpportunity.completeness` added in Task 2, used everywhere
