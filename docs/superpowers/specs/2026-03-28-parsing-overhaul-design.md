# Parsing Overhaul & Missing Gaps Redesign — Design Spec

**Date:** 2026-03-28
**Goal:** Unify markdown parsing into a single robust module, define a "complete priority" schema, and redesign the Missing Gaps page as a step-by-step card flow with guided input for filling data gaps.

---

## Problem Statement

X-Ray has two divergent markdown parsers (`scripts/seed.ts` and `src/lib/parse-upload.ts`) that extract priority data from department markdown files. They use different heading regexes, handle summary tables differently (seed does, upload doesn't), and handle ranks differently (seed preserves, upload renumbers). As X-Ray scales to dozens of companies with varying markdown formats, this fragility compounds.

The Missing Gaps page currently shows a flat table of priorities missing hrs/week estimates. The new vision: X-Ray defines 10 required fields for a "complete" priority, parses uploaded documents flexibly to extract what it can, and uses the Missing Gaps page to guide users through filling remaining gaps one priority at a time.

---

## Architecture

Three independent units of work:

1. **Shared parser module** (`src/lib/parse-markdown.ts`) — extracts profiles and priorities from markdown with format detection
2. **Completeness scoring** (additions to `src/lib/db.ts`) — scores each priority against the 10-field schema
3. **Missing Gaps card UI** (`src/components/GapCard.tsx` + redesigned unfiled page) — step-by-step guided editing
4. **AI Priorities completeness badges** — show N/10 score on each priority row

Consumers updated: `scripts/seed.ts`, `src/app/api/upload/route.ts`, unfiled page, priorities page.

---

## Section 1: Unified Parser Module

### File: `src/lib/parse-markdown.ts`

**Exports:**

```typescript
interface ParsedProfile {
  name: string;
  mission: string;
  scope: string;
  teamMembers: { name: string; title: string; responsibilities: string }[];
  tools: string[];
  singlePointsOfFailure: string[];
  painPoints: string[];
  tribalKnowledgeRisks: string[];
}

interface ParsedPriority {
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
  missingFields: string[];  // which of the 10 required fields are empty
}

function parseProfile(text: string): ParsedProfile;
function parsePriorities(text: string): ParsedPriority[];
```

### Heading detection

The parser scans the document to detect which heading pattern is used for priorities:
- `### Priority N:` (accounting, infrastructure, operations)
- `## Priority N —` (sales-operations)
- `## Priority N.` (possible future format)
- `## N.` or `## N:` (minimal format)

It builds a regex from the first match found, then splits the document.

### Summary table extraction

Before splitting into priority sections, the parser looks for a summary table with:
- A header row containing "rank" (or first column is numeric) AND a time-related column
- Time column detection keywords: "time saved", "est. time", "net time saved", "weekly time", "time savings"
- If the column header contains "weekly" and the cell value is just hours (no /week), append "/week"
- Builds a `Map<number, string>` of rank → time savings value

### Field extraction cascade

For each priority section, each required field is extracted by trying multiple heading/label variants in order:

| DB Field | Variants tried (in order) |
|----------|--------------------------|
| `whatToAutomate` | "What to automate", "What to improve", "What to build", "What to automate/improve" |
| `currentState` | "Current state", "Current process", "Current status", "Target state" |
| `whyItMatters` | "Why it matters", "Why" |
| `estimatedTimeSavings` | Summary table value (preferred), then inline: "Estimated time savings", "Net time saved", "Time savings", "Verified time savings" |
| `complexity` | "Complexity" |
| `impact` | "Impact" |
| `suggestedApproach` | "Suggested approach", "Approach", "Recommendation" |
| `successCriteria` | "Success criteria", "Success" |
| `dependencies` | "Dependencies", "Depends on" |
| `status` | "Status" |

All extracted values are cleaned: bold markers (`**`) stripped, leading/trailing pipes stripped, whitespace trimmed.

### Section extraction

Two extraction modes:
- **Field extraction** — for single-line values (complexity, impact, status, time savings). Matches `**FieldName:** value` or `**FieldName:** value` patterns on a single line.
- **Section extraction** — for multi-line content (what to automate, current state, etc.). Finds the heading, captures all content until the next heading of equal or higher level.
- **List extraction** — for dependencies. Captures bullet items (`- item`) within the section.

Section headings are detected at `###` or `####` level (within a priority that's `##` or `###`), dynamically adjusted based on the priority heading level.

### Completeness check

After extraction, the parser checks which of the 10 required fields are empty and returns them in `missingFields[]`:

```typescript
const REQUIRED_FIELDS = [
  'name', 'whatToAutomate', 'currentState', 'whyItMatters',
  'estimatedTimeSavings', 'complexity', 'impact',
  'suggestedApproach', 'successCriteria', 'dependencies'
] as const;
```

A priority's completeness score is `(10 - missingFields.length) / 10`.

---

## Section 2: Completeness Scoring in db.ts

### New function: `getCompletenessScore(priority: DbPriority): { score: number; total: number; missing: string[] }`

Checks which of the 10 required fields are empty/missing on the database record. Returns:
- `score`: number of filled fields (0-10)
- `total`: always 10
- `missing`: array of field names that are empty

### Updated `getTopWins()` return type

`RankedOpportunity` gains:
- `completeness: { score: number; total: number; missing: string[] }`

### Updated `getUnfiledRankedOpportunities()`

Currently returns priorities where `parsedTimeSavings.valid === false`. New behavior: returns priorities where `completeness.score < 10` (any missing field), sorted by completeness score ascending (most incomplete first).

### AI Priorities page filter

Currently shows only priorities with valid time savings. New behavior: shows priorities with valid time savings (unchanged gate), but each row displays a completeness badge.

---

## Section 3: Missing Gaps Card UI

### Redesigned unfiled page: `src/app/org/[orgSlug]/unfiled/page.tsx`

Server component that fetches incomplete priorities and renders a card queue.

**Layout:**
- Header: "Missing Gaps" + progress summary ("12 of 35 priorities are incomplete")
- Progress bar showing overall completeness across all priorities
- Card area: shows one priority card at a time
- Navigation: "Previous" / "Next" buttons + "3 of 12" counter

### New component: `src/components/GapCard.tsx`

Client component. Shows one incomplete priority as a card with:

**Card header:**
- Priority name + department name
- Completeness badge: "7/10 fields complete"
- Visual indicator dots (filled = complete, empty = missing)

**Card body:**
- Lists only the MISSING fields as editable inputs
- Already-filled fields shown as read-only text (collapsed, expandable)
- Input types based on field:
  - `complexity`: dropdown — Low, Low-Medium, Medium, Medium-High, High
  - `impact`: dropdown — Low, Medium, High, Very High, Critical
  - `estimatedTimeSavings`: structured input — two number fields (min/max hours) + "/week" label. Single value mode by default, toggle for range.
  - `dependencies`: tag-style input — type to add, click X to remove
  - All others (`whatToAutomate`, `currentState`, `whyItMatters`, `suggestedApproach`, `successCriteria`): textarea

**Card footer:**
- "Save & Next" button — saves via API, advances to next card
- "Skip" button — moves to next without saving
- "Save" button — saves without advancing

### New API route: `src/app/api/priorities/[id]/route.ts`

PATCH endpoint to update individual priority fields. Accepts partial updates:
```json
{ "complexity": "Medium", "impact": "High", "estimated_time_savings": "5 hrs/week" }
```

Validates:
- User is authenticated
- User is member of the org that owns this priority
- Field names are valid priority columns
- Time savings input is normalized to "X hrs/week" or "X-Y hrs/week" format

---

## Section 4: AI Priorities Completeness Badges

### Updated `PrioritiesTable.tsx`

Each row gains a completeness indicator:
- Full circle (green) if 10/10
- Partial circle or "7/10" text badge if incomplete
- Clicking the badge navigates to that priority's gap card on the Missing Gaps page

### Updated priorities page banner

Current: "{N} priorities are missing hours/week estimates"
New: "{N} priorities have incomplete data" with breakdown: "5 missing time estimates, 3 missing success criteria, ..."

---

## Section 5: Consumer Updates

### `scripts/seed.ts`

Replace inline parsing with:
```typescript
import { parseProfile, parsePriorities } from '@/lib/parse-markdown';
```

Thin wrapper: reads files, calls shared parser, inserts results into Supabase.

### `src/app/api/upload/route.ts`

Replace `parse-upload.ts` usage with:
```typescript
import { parseProfile, parsePriorities } from '@/lib/parse-markdown';
```

Delete `src/lib/parse-upload.ts` after migration.

---

## Testing Strategy

### Unit tests for `parse-markdown.ts`

Test with real data from each department format:
- Accounting (`### Priority N:` format, summary table with "Est. Time Saved")
- Infrastructure (`### Priority N:` format, summary table with "Net Time Saved (weekly)")
- Operations (`### Priority N:` format, summary table with "Weekly Time Saved")
- Sales Operations (`## Priority N —` format, inline `**Estimated Time Savings:**`)

Test edge cases:
- Empty time savings
- Time savings with bold markdown artifacts
- Missing sections
- Priority with all fields present (missingFields should be empty)
- Priority with no fields present (missingFields should have all 10)

### Integration test for completeness scoring

Test `getCompletenessScore()` with various combinations of filled/empty fields.

### Manual testing

- Seed WeVend data, verify all 35 priorities import with correct time savings
- Upload a new department via the upload form, verify parsing matches seed behavior
- Walk through Missing Gaps card flow: fill a field, save, verify it persists
- Check AI Priorities page shows completeness badges

---

## Out of Scope

- AI-assisted gap filling (Phase 7 on roadmap)
- Bulk editing multiple priorities at once
- Markdown export / round-trip editing
- DOCX file parsing (2 operations DOCX files exist but are duplicates of MD versions)
