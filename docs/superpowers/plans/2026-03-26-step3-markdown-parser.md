# Step 3: Markdown Parser Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a markdown parser that reads department data files from `artifacts/` and returns typed structures for the dashboard.

**Architecture:** Line-by-line section splitter using regex to discover priorities and extract fields. Handles both Accounting format (`### Priority N: Name`) and Sales Ops format (`## Priority N — Name`). All `fs` reads use `path.join(process.cwd(), 'artifacts', ...)` for build-time execution.

**Tech Stack:** TypeScript, Node.js `fs`, Vitest (new — needs setup)

---

### Task 1: Set up Vitest

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`

- [ ] **Step 1: Install vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

- [ ] **Step 3: Add test script to `package.json`**

Add to the `"scripts"` section:
```json
"test": "vitest run"
```

- [ ] **Step 4: Verify vitest runs (no tests yet)**

```bash
npm test
```

Expected: Vitest runs, reports "no test files found" or similar, exits cleanly.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts package.json package-lock.json
git commit -m "Add vitest test framework"
```

---

### Task 2: Fix status.json (add sales-ops priority-8)

**Files:**
- Modify: `artifacts/status.json`

- [ ] **Step 1: Add the missing entry**

Add `"sales-operations/priority-8"` to `artifacts/status.json`. The entry should be:

```json
"sales-operations/priority-8": { "milestone": 0, "updated": "2026-03-26", "notes": "" }
```

Add it after the `"sales-operations/priority-7"` entry.

- [ ] **Step 2: Verify JSON parses and has 17 entries**

```bash
node -e "const d = require('./artifacts/status.json'); console.log(Object.keys(d).length, 'entries')"
```

Expected: `17 entries`

- [ ] **Step 3: Commit**

```bash
git add artifacts/status.json
git commit -m "Add sales-operations/priority-8 to status.json"
```

---

### Task 3: Build the parser — JSON readers and department discovery

**Files:**
- Create: `src/lib/parser.ts`
- Create: `src/lib/__tests__/parser.test.ts`

- [ ] **Step 1: Write failing tests for JSON readers and department discovery**

Create `src/lib/__tests__/parser.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { getMilestones, getStatuses, getDepartmentSlugs } from '../parser';

describe('getMilestones', () => {
  it('returns 4 milestone configs', () => {
    const milestones = getMilestones();
    expect(milestones).toHaveLength(4);
    expect(milestones[0].name).toBe('Not Started');
    expect(milestones[3].name).toBe('Dept Head Confirmed');
  });
});

describe('getStatuses', () => {
  it('returns 17 status entries', () => {
    const statuses = getStatuses();
    expect(Object.keys(statuses)).toHaveLength(17);
  });

  it('sales-ops priority-1 is at milestone 1', () => {
    const statuses = getStatuses();
    expect(statuses['sales-operations/priority-1'].milestone).toBe(1);
  });
});

describe('getDepartmentSlugs', () => {
  it('discovers accounting and sales-operations', () => {
    const slugs = getDepartmentSlugs();
    expect(slugs).toContain('accounting');
    expect(slugs).toContain('sales-operations');
    expect(slugs.length).toBeGreaterThanOrEqual(2);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — module `../parser` does not exist.

- [ ] **Step 3: Implement JSON readers and department discovery**

Create `src/lib/parser.ts`:

```typescript
import fs from 'fs';
import path from 'path';
import type {
  MilestoneConfig,
  MilestoneStatus,
  DepartmentProfile,
  TeamMember,
  AutomationPriority,
  Department,
  ScalingRisk,
} from './types';

const ARTIFACTS_DIR = path.join(process.cwd(), 'artifacts');

export function getMilestones(): MilestoneConfig[] {
  const raw = fs.readFileSync(path.join(ARTIFACTS_DIR, 'milestones.json'), 'utf-8');
  const data = JSON.parse(raw);
  return data.milestones;
}

export function getStatuses(): Record<string, MilestoneStatus> {
  const raw = fs.readFileSync(path.join(ARTIFACTS_DIR, 'status.json'), 'utf-8');
  return JSON.parse(raw);
}

export function getDepartmentSlugs(): string[] {
  const entries = fs.readdirSync(ARTIFACTS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      const dirPath = path.join(ARTIFACTS_DIR, entry.name);
      return (
        fs.existsSync(path.join(dirPath, 'department_profile.md')) &&
        fs.existsSync(path.join(dirPath, 'automation_priorities.md'))
      );
    })
    .map((entry) => entry.name);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/parser.ts src/lib/__tests__/parser.test.ts
git commit -m "Add JSON readers and department discovery to parser"
```

---

### Task 4: Build the priority parser

**Files:**
- Modify: `src/lib/parser.ts`
- Modify: `src/lib/__tests__/parser.test.ts`

- [ ] **Step 1: Write failing tests for priority parsing**

Append to `src/lib/__tests__/parser.test.ts`:

```typescript
import { parsePriorities } from '../parser';

describe('parsePriorities — Accounting', () => {
  const priorities = parsePriorities('accounting');

  it('parses 9 priorities', () => {
    expect(priorities).toHaveLength(9);
  });

  it('priority 1 has correct name', () => {
    expect(priorities[0].name).toBe('Sales Orders & Invoicing — System-Generated POs');
  });

  it('priority 1 has correct effort/complexity/impact', () => {
    expect(priorities[0].effort).toBe('Low');
    expect(priorities[0].complexity).toBe('Low');
    expect(priorities[0].impact).toBe('High');
  });

  it('priority 5 has High complexity and Very High impact', () => {
    expect(priorities[4].complexity).toBe('High');
    expect(priorities[4].impact).toBe('Very High');
  });

  it('priority 9 has Critical impact', () => {
    expect(priorities[8].impact).toBe('Critical');
  });

  it('has whatToAutomate populated', () => {
    expect(priorities[0].whatToAutomate.length).toBeGreaterThan(10);
  });

  it('has suggestedApproach populated', () => {
    expect(priorities[0].suggestedApproach.length).toBeGreaterThan(10);
  });

  it('has dependencies as array', () => {
    expect(Array.isArray(priorities[0].dependencies)).toBe(true);
    expect(priorities[0].dependencies.length).toBeGreaterThan(0);
  });

  it('sets departmentSlug', () => {
    expect(priorities[0].departmentSlug).toBe('accounting');
  });
});

describe('parsePriorities — Sales Operations', () => {
  const priorities = parsePriorities('sales-operations');

  it('parses 8 priorities', () => {
    expect(priorities).toHaveLength(8);
  });

  it('priority 1 has correct name', () => {
    expect(priorities[0].name).toBe(
      'Eliminate Duplicate Data Entry Across Merchant Onboarding Systems'
    );
  });

  it('priority 1 has status "In Progress"', () => {
    expect(priorities[0].status).toMatch(/In Progress/);
  });

  it('priority 2 has status "Not started"', () => {
    expect(priorities[1].status).toMatch(/Not started/i);
  });

  it('has whatToAutomate populated', () => {
    expect(priorities[0].whatToAutomate.length).toBeGreaterThan(10);
  });

  it('defaults suggestedApproach to empty when missing', () => {
    // Sales Ops priorities don't have "Suggested approach" field
    expect(priorities[0].suggestedApproach).toBe('');
  });

  it('sets departmentSlug', () => {
    expect(priorities[0].departmentSlug).toBe('sales-operations');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `parsePriorities` is not exported.

- [ ] **Step 3: Implement parsePriorities**

Add to `src/lib/parser.ts`:

```typescript
export function parsePriorities(slug: string): AutomationPriority[] {
  const filePath = path.join(ARTIFACTS_DIR, slug, 'automation_priorities.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Parse summary table for effort/impact values
  const summaryData = parseSummaryTable(content, slug);

  // Split into priority sections
  const priorityRegex = /^#{2,3}\s+Priority\s+(\d+)\s*[—:\-–]\s*(.+)/gm;
  const sections: { rank: number; name: string; body: string }[] = [];
  let match;
  const matches: { rank: number; name: string; index: number }[] = [];

  while ((match = priorityRegex.exec(content)) !== null) {
    matches.push({ rank: parseInt(match[1]), name: match[2].trim(), index: match.index });
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index;
    const end = i + 1 < matches.length ? matches[i + 1].index : content.length;
    sections.push({
      rank: matches[i].rank,
      name: matches[i].name,
      body: content.slice(start, end),
    });
  }

  return sections.map((section) => {
    const summary = summaryData.get(section.rank);
    return {
      departmentSlug: slug,
      rank: section.rank,
      name: section.name,
      effort: parseEffort(summary?.effort),
      complexity: parseComplexity(extractField(section.body, 'Complexity') || summary?.complexity || ''),
      impact: parseImpact(summary?.impact),
      whatToAutomate: extractField(section.body, 'What to [Aa]utomate(?:/improve)?') || extractField(section.body, 'What to [Bb]uild') || extractField(section.body, 'What to [Ii]mprove') || '',
      currentState: extractField(section.body, 'Current [Ss]tate') || extractField(section.body, 'Target [Ss]tate') || '',
      whyItMatters: extractField(section.body, 'Why [Ii]t [Mm]atters') || '',
      estimatedTimeSavings: extractField(section.body, 'Estimated [Tt]ime [Ss]avings') || extractField(section.body, 'Estimated [Rr]isk [Rr]eduction') || '',
      dependencies: extractListField(section.body, 'Dependencies'),
      suggestedApproach: extractField(section.body, 'Suggested [Aa]pproach') || '',
      successCriteria: extractField(section.body, 'Success [Cc]riteria') || '',
      status: extractField(section.body, 'Status') || 'Not started',
    };
  });
}

function parseSummaryTable(content: string, slug: string): Map<number, { effort?: string; complexity?: string; impact?: string }> {
  const result = new Map<number, { effort?: string; complexity?: string; impact?: string }>();
  // Find the summary table (lines starting with |)
  const lines = content.split('\n');
  let inTable = false;
  let headers: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) {
      if (inTable) break;
      continue;
    }
    const cells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
    if (!inTable) {
      // Check if this is a summary-style table header
      const headerStr = cells.join(' ').toLowerCase();
      if (headerStr.includes('rank') || headerStr.includes('priority')) {
        headers = cells.map((c) => c.toLowerCase());
        inTable = true;
      }
      continue;
    }
    // Skip separator row
    if (cells.every((c) => /^[-:]+$/.test(c))) continue;

    const rankIdx = headers.findIndex((h) => h === 'rank' || h === 'priority');
    const effortIdx = headers.findIndex((h) => h.includes('effort'));
    const complexityIdx = headers.findIndex((h) => h.includes('complexity'));
    const impactIdx = headers.findIndex((h) => h === 'impact' || h.includes('time impact'));

    if (rankIdx >= 0 && cells[rankIdx]) {
      const rank = parseInt(cells[rankIdx]);
      if (!isNaN(rank)) {
        result.set(rank, {
          effort: effortIdx >= 0 ? cells[effortIdx] : undefined,
          complexity: complexityIdx >= 0 ? cells[complexityIdx] : undefined,
          impact: impactIdx >= 0 ? cells[impactIdx] : undefined,
        });
      }
    }
  }
  return result;
}

function extractField(body: string, labelPattern: string): string | null {
  // Match **Label:** followed by content until next **Label:** or heading
  const regex = new RegExp(`\\*\\*${labelPattern}:\\*\\*\\s*(.+?)(?=\\n\\*\\*[A-Z]|\\n#{2,3}\\s|$)`, 's');
  const match = regex.exec(body);
  if (!match) return null;
  return match[1].trim();
}

function extractListField(body: string, labelPattern: string): string[] {
  const raw = extractField(body, labelPattern);
  if (!raw) return [];
  // If it contains bullet points, split on them
  if (raw.includes('\n-') || raw.includes('\n*')) {
    return raw
      .split('\n')
      .map((line) => line.replace(/^[-*]\s*/, '').trim())
      .filter(Boolean);
  }
  // Otherwise split on semicolons or return as single item
  if (raw.includes(';')) {
    return raw.split(';').map((s) => s.trim()).filter(Boolean);
  }
  return [raw];
}

function parseEffort(value?: string): 'Low' | 'Medium' | 'High' {
  if (!value) return 'Medium';
  const normalized = value.toLowerCase().trim();
  if (normalized.startsWith('low')) return 'Low';
  if (normalized.startsWith('high')) return 'High';
  return 'Medium';
}

function parseComplexity(value: string): 'Low' | 'Medium' | 'Medium-High' | 'High' {
  const normalized = value.toLowerCase().split('—')[0].split('(')[0].trim();
  if (normalized === 'low') return 'Low';
  if (normalized === 'high') return 'High';
  if (normalized.includes('medium-high') || normalized.includes('medium–high')) return 'Medium-High';
  if (normalized.includes('low-medium') || normalized.includes('low–medium')) return 'Medium';
  return 'Medium';
}

function parseImpact(value?: string): 'Low' | 'Medium' | 'High' | 'Very High' | 'Critical' {
  if (!value) return 'High';
  const normalized = value.toLowerCase().trim();
  if (normalized.includes('critical')) return 'Critical';
  if (normalized.includes('very high')) return 'Very High';
  if (normalized.startsWith('high')) return 'High';
  if (normalized.startsWith('low')) return 'Low';
  return 'Medium';
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All priority tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/parser.ts src/lib/__tests__/parser.test.ts
git commit -m "Add priority parser with tests for both department formats"
```

---

### Task 5: Build the profile parser

**Files:**
- Modify: `src/lib/parser.ts`
- Modify: `src/lib/__tests__/parser.test.ts`

- [ ] **Step 1: Write failing tests for profile parsing**

Append to `src/lib/__tests__/parser.test.ts`:

```typescript
import { parseProfile } from '../parser';

describe('parseProfile — Accounting', () => {
  const profile = parseProfile('accounting');

  it('has correct slug and name', () => {
    expect(profile.slug).toBe('accounting');
    expect(profile.name).toBe('Accounting');
  });

  it('has mission populated', () => {
    expect(profile.mission.length).toBeGreaterThan(10);
    expect(profile.mission).toMatch(/recording all business transactions/i);
  });

  it('has team members', () => {
    expect(profile.teamMembers.length).toBeGreaterThanOrEqual(2);
    expect(profile.teamMembers[0].name).toMatch(/Nancy/);
  });

  it('has tools', () => {
    expect(profile.tools.length).toBeGreaterThan(0);
    expect(profile.tools.some((t) => t.match(/QuickBooks/i))).toBe(true);
  });

  it('has single points of failure', () => {
    expect(profile.singlePointsOfFailure.length).toBeGreaterThan(0);
  });

  it('has pain points', () => {
    expect(profile.painPoints.length).toBeGreaterThan(0);
  });

  it('has tribal knowledge risks', () => {
    expect(profile.tribalKnowledgeRisks.length).toBeGreaterThan(0);
  });
});

describe('parseProfile — Sales Operations', () => {
  const profile = parseProfile('sales-operations');

  it('has correct slug and name', () => {
    expect(profile.slug).toBe('sales-operations');
    expect(profile.name).toBe('Sales Operations');
  });

  it('has mission populated', () => {
    expect(profile.mission.length).toBeGreaterThan(10);
  });

  it('has team members', () => {
    expect(profile.teamMembers.length).toBeGreaterThanOrEqual(2);
    expect(profile.teamMembers[0].name).toMatch(/Layal/);
  });

  it('has tools', () => {
    expect(profile.tools.length).toBeGreaterThan(0);
    expect(profile.tools.some((t) => t.match(/WeTrack/i))).toBe(true);
  });

  it('has tribal knowledge risks', () => {
    expect(profile.tribalKnowledgeRisks.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `parseProfile` is not exported.

- [ ] **Step 3: Implement parseProfile**

Add to `src/lib/parser.ts`:

```typescript
export function parseProfile(slug: string): DepartmentProfile {
  const filePath = path.join(ARTIFACTS_DIR, slug, 'department_profile.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  // Extract department name from title
  const titleMatch = content.match(/^#\s+(.+?)(?:\s*[—\-–]\s*Department Profile)/m);
  const name = titleMatch ? titleMatch[1].trim() : slugToName(slug);

  // Extract mission
  const mission = extractField(content, 'Mission') || extractSectionContent(content, 'Mission') || '';

  // Extract scope
  const scope = extractField(content, 'Scope') || extractSectionContent(content, 'Scope') || '';

  // Extract team members from table
  const teamMembers = parseTeamTable(content);

  // Extract tools from table
  const tools = parseToolsList(content);

  // Extract single points of failure
  const singlePointsOfFailure = parseSPOFs(content);

  // Extract pain points
  const painPoints = parsePainPoints(content);

  // Extract tribal knowledge risks
  const tribalKnowledgeRisks = parseTribalKnowledge(content);

  return {
    slug,
    name,
    mission,
    scope,
    teamMembers,
    tools,
    singlePointsOfFailure,
    painPoints,
    tribalKnowledgeRisks,
  };
}

function slugToName(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function extractSectionContent(content: string, headingName: string): string | null {
  const regex = new RegExp(`^#{2,3}\\s+${headingName}\\s*\\n([\\s\\S]*?)(?=\\n#{2,3}\\s|$)`, 'm');
  const match = regex.exec(content);
  if (!match) return null;
  return match[1].trim();
}

function parseTeamTable(content: string): TeamMember[] {
  const members: TeamMember[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) continue;

    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    const headerStr = cells.join(' ').toLowerCase();

    // Find team/roster table by header content
    if (
      (headerStr.includes('name') && headerStr.includes('title')) ||
      (headerStr.includes('name') && headerStr.includes('responsibilities'))
    ) {
      // Skip separator row
      i++;
      if (i < lines.length && lines[i].trim().match(/^\|[-\s|:]+\|$/)) i++;

      // Parse data rows
      while (i < lines.length) {
        const row = lines[i].trim();
        if (!row.startsWith('|') || row === '') break;
        const rowCells = row.split('|').map((c) => c.trim()).filter(Boolean);
        if (rowCells.length >= 2 && !rowCells.every((c) => /^[-:]+$/.test(c))) {
          members.push({
            name: rowCells[0],
            title: rowCells[1],
            responsibilities: rowCells[2] || '',
          });
        }
        i++;
      }
      break;
    }
  }
  return members;
}

function parseToolsList(content: string): string[] {
  const tools: string[] = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line.startsWith('|')) continue;

    const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
    const headerStr = cells.join(' ').toLowerCase();

    // Find tools table by header
    if (headerStr.includes('tool') && (headerStr.includes('purpose') || headerStr.includes('type'))) {
      // Skip separator row
      i++;
      if (i < lines.length && lines[i].trim().match(/^\|[-\s|:]+\|$/)) i++;

      // Parse data rows
      while (i < lines.length) {
        const row = lines[i].trim();
        if (!row.startsWith('|') || row === '') break;
        const rowCells = row.split('|').map((c) => c.trim()).filter(Boolean);
        if (rowCells.length >= 1 && !rowCells.every((c) => /^[-:]+$/.test(c))) {
          // Strip bold markers
          tools.push(rowCells[0].replace(/\*\*/g, ''));
        }
        i++;
      }
      break;
    }
  }
  return tools;
}

function parseSPOFs(content: string): string[] {
  // Look for SPOF table or section
  const spofSection = extractSectionContent(content, 'Single Points of Failure');
  if (spofSection) {
    // Parse table rows or bullet points
    return parseTableFirstColumn(spofSection)
      .concat(parseBulletPoints(spofSection))
      .filter(Boolean);
  }

  // Also check for "Capacity Note" mentions
  const capacityMatch = content.match(/single largest operational risk[^.]*\./i);
  if (capacityMatch) return [capacityMatch[0]];

  return [];
}

function parsePainPoints(content: string): string[] {
  // Look for Pain Points section or Time Sinks table
  const painSection = extractSectionContent(content, 'Pain Points & Bottlenecks')
    || extractSectionContent(content, 'Time Sinks');
  if (painSection) {
    const tablePoints = parseTableFirstColumn(painSection);
    if (tablePoints.length > 0) return tablePoints;
    return parseBulletPoints(painSection);
  }

  // For Sales Ops, look for Handoffs table bottlenecks
  const handoffSection = extractSectionContent(content, 'Handoffs & Dependencies Map');
  if (handoffSection) {
    const lines = handoffSection.split('\n');
    const points: string[] = [];
    for (const line of lines) {
      if (line.includes('Yes') && line.startsWith('|')) {
        const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
        if (cells.length >= 4) {
          points.push(`${cells[0]} → ${cells[1]}: ${cells[3]}`);
        }
      }
    }
    if (points.length > 0) return points;
  }

  return [];
}

function parseTribalKnowledge(content: string): string[] {
  const section = extractSectionContent(content, 'Tribal Knowledge Risks')
    || extractSectionContent(content, 'Tribal Knowledge & Key Risks');
  if (!section) return [];

  // Try table first, then bullet points
  const tableEntries = parseTableFirstTwoCols(section);
  if (tableEntries.length > 0) return tableEntries;
  return parseBulletPoints(section);
}

function parseTableFirstColumn(section: string): string[] {
  const results: string[] = [];
  const lines = section.split('\n');
  let pastHeader = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    if (trimmed.match(/^\|[-\s|:]+\|$/)) { pastHeader = true; continue; }
    if (!pastHeader) { pastHeader = false; continue; }
    const cells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 1 && !cells.every((c) => /^[-:]+$/.test(c))) {
      results.push(cells[0]);
    }
  }
  return results;
}

function parseTableFirstTwoCols(section: string): string[] {
  const results: string[] = [];
  const lines = section.split('\n');
  let pastHeader = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    if (trimmed.match(/^\|[-\s|:]+\|$/)) { pastHeader = true; continue; }
    if (!pastHeader) { pastHeader = false; continue; }
    const cells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 2 && !cells.every((c) => /^[-:]+$/.test(c))) {
      results.push(`${cells[0]}: ${cells[1]}`);
    }
  }
  return results;
}

function parseBulletPoints(section: string): string[] {
  return section
    .split('\n')
    .filter((line) => /^\s*[-*]\s/.test(line))
    .map((line) => line.replace(/^\s*[-*]\s*/, '').trim())
    .filter(Boolean);
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All profile tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/parser.ts src/lib/__tests__/parser.test.ts
git commit -m "Add department profile parser with tests"
```

---

### Task 6: Build the timeline and scaling risk parsers + getDepartment/getAllDepartments

**Files:**
- Modify: `src/lib/parser.ts`
- Modify: `src/lib/__tests__/parser.test.ts`

- [ ] **Step 1: Write failing tests**

Append to `src/lib/__tests__/parser.test.ts`:

```typescript
import { getDepartment, getAllDepartments } from '../parser';

describe('getDepartment', () => {
  it('returns Accounting with profile and 9 priorities', () => {
    const dept = getDepartment('accounting');
    expect(dept.profile.name).toBe('Accounting');
    expect(dept.priorities).toHaveLength(9);
  });

  it('returns Sales Operations with profile and 8 priorities', () => {
    const dept = getDepartment('sales-operations');
    expect(dept.profile.name).toBe('Sales Operations');
    expect(dept.priorities).toHaveLength(8);
  });

  it('Accounting has quickWins', () => {
    const dept = getDepartment('accounting');
    expect(dept.quickWins).toBeDefined();
    expect(dept.quickWins!.length).toBeGreaterThan(0);
  });

  it('Accounting has thirtyDayTargets', () => {
    const dept = getDepartment('accounting');
    expect(dept.thirtyDayTargets).toBeDefined();
    expect(dept.thirtyDayTargets!.length).toBeGreaterThan(0);
  });

  it('Accounting has ninetyDayTargets', () => {
    const dept = getDepartment('accounting');
    expect(dept.ninetyDayTargets).toBeDefined();
    expect(dept.ninetyDayTargets!.length).toBeGreaterThan(0);
  });

  it('Accounting has scalingRisks', () => {
    const dept = getDepartment('accounting');
    expect(dept.scalingRisks).toBeDefined();
    expect(dept.scalingRisks!.length).toBeGreaterThan(0);
    expect(dept.scalingRisks![0].area).toBeDefined();
  });
});

describe('getAllDepartments', () => {
  it('returns at least 2 departments', () => {
    const departments = getAllDepartments();
    expect(departments.length).toBeGreaterThanOrEqual(2);
  });

  it('each department has profile and priorities', () => {
    const departments = getAllDepartments();
    for (const dept of departments) {
      expect(dept.profile.slug).toBeTruthy();
      expect(dept.priorities.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm test
```

Expected: FAIL — `getDepartment` and `getAllDepartments` are not exported.

- [ ] **Step 3: Implement timeline parsers and composite functions**

Add to `src/lib/parser.ts`:

```typescript
function parseNumberedList(content: string, sectionName: string): string[] | undefined {
  const regex = new RegExp(`^##\\s+${sectionName}[\\s\\S]*?\\n([\\s\\S]*?)(?=\\n##\\s|$)`, 'm');
  const match = regex.exec(content);
  if (!match) return undefined;
  const items = match[1]
    .split('\n')
    .filter((line) => /^\d+\.\s/.test(line.trim()))
    .map((line) => line.replace(/^\d+\.\s*/, '').trim());
  return items.length > 0 ? items : undefined;
}

function parseScalingRisks(content: string): ScalingRisk[] | undefined {
  const sectionRegex = /^##\s+Scaling Risks[\s\S]*?\n([\s\S]*?)(?=\n##\s|$)/m;
  const match = sectionRegex.exec(content);
  if (!match) return undefined;

  const section = match[1];
  const risks: ScalingRisk[] = [];
  const lines = section.split('\n');
  let pastHeader = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith('|')) continue;
    if (trimmed.match(/^\|[-\s|:]+\|$/)) { pastHeader = true; continue; }
    if (!pastHeader) continue;
    const cells = trimmed.split('|').map((c) => c.trim()).filter(Boolean);
    if (cells.length >= 2 && !cells.every((c) => /^[-:]+$/.test(c))) {
      risks.push({
        area: cells[0],
        risk: cells[1],
        mitigation: cells.length >= 4 ? cells[3] : cells.length >= 3 ? cells[2] : '',
      });
    }
  }

  return risks.length > 0 ? risks : undefined;
}

export function getDepartment(slug: string): Department {
  const profile = parseProfile(slug);
  const priorities = parsePriorities(slug);

  const prioritiesFilePath = path.join(ARTIFACTS_DIR, slug, 'automation_priorities.md');
  const prioritiesContent = fs.readFileSync(prioritiesFilePath, 'utf-8');

  const quickWins = parseNumberedList(prioritiesContent, 'Quick Wins[^\\n]*');
  const thirtyDayTargets = parseNumberedList(prioritiesContent, '30-Day Targets');
  const ninetyDayTargets = parseNumberedList(prioritiesContent, '90-Day Targets');
  const scalingRisks = parseScalingRisks(prioritiesContent);

  return {
    profile,
    priorities,
    quickWins,
    thirtyDayTargets,
    ninetyDayTargets,
    scalingRisks,
  };
}

export function getAllDepartments(): Department[] {
  const slugs = getDepartmentSlugs();
  return slugs.map((slug) => getDepartment(slug));
}
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
npm test
```

Expected: All tests pass.

- [ ] **Step 5: Verify build still works**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/lib/parser.ts src/lib/__tests__/parser.test.ts
git commit -m "Add timeline/scaling risk parsers and getDepartment/getAllDepartments"
```
