# Sortable Priorities Table & Unfiled Page

## Context
Leadership needs to quickly see which automation priorities save the most hours with the least effort. The current `estimatedTimeSavings` field is free-form text with inconsistent formats. Priorities without valid hours/week data need to be flagged so users can fix the input files.

## Scope
- Add time savings parser to extract hours/week from free-form text
- Replace TopWinsTable with a sortable PrioritiesTable on the homepage
- Add /unfiled page listing priorities with invalid time estimates
- Add Unfiled nav link with count badge

## Standard Unit
All time savings must be expressed in **hours per week**. Ranges are accepted (e.g., "10-15 hours/week"). Sort by midpoint of range.

## Time Savings Parser

New function `parseTimeSavings(raw: string)` in `src/lib/parser.ts`.

**Valid patterns** (case-insensitive):
- "10 hours/week", "10 hrs/wk", "10 hours per week", "10h/week"
- "5-15 hours/week", "5–15 hrs/wk" (ranges with dash or en-dash)
- Single values treated as both min and max (e.g., "10 hours/week" → min=10, max=10, midpoint=10)

**Returns `ParsedTimeSavings`:**
- Valid: `{ valid: true, min: number, max: number, midpoint: number, display: string }`
- Invalid: `{ valid: false, rawText: string, issue: string }`

**Issue categories:**
- `"no numeric value found"` — vague language like "significant time savings"
- `"non-standard unit"` — has a number but in days, months, or minutes instead of hours/week
- `"not quantified"` — text explicitly says "not quantified" or similar

## Types

Add to `src/lib/types.ts`:

```typescript
type ParsedTimeSavings =
  | { valid: true; min: number; max: number; midpoint: number; display: string }
  | { valid: false; rawText: string; issue: string };

interface UnfiledPriority {
  departmentSlug: string;
  departmentName: string;
  rank: number;
  name: string;
  rawText: string;
  issue: string;
}
```

## Data Flow Changes

- `RankedOpportunity` gains field: `parsedTimeSavings: ParsedTimeSavings`
- `buildRankedOpportunity()` in aggregator calls `parseTimeSavings()` on each priority's `estimatedTimeSavings`
- New aggregator export: `getUnfiledPriorities(): UnfiledPriority[]` — all priorities where `parsedTimeSavings.valid === false`
- `getTopWins()` continues returning all priorities; the table shows "—" for unfiled ones in the hours column

## Homepage Priorities Table

New client component `src/components/PrioritiesTable.tsx` replacing `TopWinsTable.tsx`.

- Displays **all** priorities (not just top 10)
- Columns: Rank, Opportunity, Department, Impact, Effort, Hours Saved/Week, Stage
- **Hours Saved/Week**: displays range (e.g., "10–15") for valid, "—" for unfiled
- **Sortable columns**: Hours Saved/Week (default descending by midpoint) and Effort
- Click header to toggle asc/desc, visual arrow indicator
- Unfiled priorities sort to bottom when sorted by hours saved
- Dark theme: same styling as existing table (cyan accents, impact color badges)

## Unfiled Page

New route: `src/app/unfiled/page.tsx` (server component).

- Calls `getUnfiledPriorities()` from aggregator
- **Empty state**: success message "All priorities have valid time estimates"
- **With items**: table with columns:
  - Priority (name and rank)
  - Department
  - Issue (specific problem description)
  - Current Text (raw `estimatedTimeSavings` so user sees what to fix)

## Navigation Changes

Update `src/app/layout.tsx`:
- Add "Unfiled" nav link pointing to `/unfiled`
- Show count badge when unfiled items exist (e.g., "Unfiled (4)")
- Nav link needs unfiled count at build time — call `getUnfiledPriorities().length` in layout

## Files Changed
- Modify: `src/lib/types.ts` — add ParsedTimeSavings, UnfiledPriority
- Modify: `src/lib/parser.ts` — add parseTimeSavings()
- Modify: `src/lib/aggregator.ts` — wire parsedTimeSavings into RankedOpportunity, add getUnfiledPriorities()
- Create: `src/components/PrioritiesTable.tsx` — sortable table (client component)
- Delete: `src/components/TopWinsTable.tsx` — replaced by PrioritiesTable
- Modify: `src/app/page.tsx` — swap TopWinsTable for PrioritiesTable, pass all priorities
- Create: `src/app/unfiled/page.tsx` — unfiled priorities page
- Modify: `src/app/layout.tsx` — add Unfiled nav link with count badge

## Testing
- `parseTimeSavings()`: valid single values, valid ranges, en-dash ranges, case variations, non-standard units flagged, vague text flagged, "not quantified" flagged
- `getUnfiledPriorities()`: returns correct count against real data, each has issue and rawText
- PrioritiesTable: sort by hours saved (midpoint), sort by effort, unfiled sorts to bottom
- Unfiled page: renders flagged items, shows empty state when none

## Commit Message
"Add sortable priorities table and unfiled page for data quality"
