# Step 4: Data Aggregation Layer

## Context
The X-Ray dashboard needs computed cross-department views for the Company Overview page, Top Wins table, and Kanban tracker. The parser (Step 3) provides raw department data; the aggregator transforms it into dashboard-ready structures.

## Scope
Create `src/lib/aggregator.ts` with 3 exported functions.

## Functions

### `getCompanyOverview(): CompanyOverview`
- Calls `getAllDepartments()` and `getStatuses()` from parser
- Computes: totalOpportunities, byMilestoneStage (count per stage), totalCompleted (milestone 3)
- Builds `DepartmentSummary[]` with per-department progress: totalPriorities, completed, inProgress, notStarted, progressPercent
- Includes `topWins` via `getTopWins(10)`

### `getTopWins(n: number): RankedOpportunity[]`
- Collects all priorities from all departments
- Scores each: `impactValue * effortValue`
  - Impact: Critical=5, Very High=4, High=3, Medium=2, Low=1
  - Effort: Low=3, Medium=2, High=1
- Merges milestone status from `getStatuses()` and milestone names from `getMilestones()`
- Sorts descending by score, returns top N

### `getOpportunitiesByMilestone(): Record<number, RankedOpportunity[]>`
- Groups all ranked opportunities by current milestone stage
- Keys: milestone IDs (0, 1, 2, 3)
- Values: arrays of `RankedOpportunity`

## Dependencies
- `src/lib/parser.ts` — getAllDepartments, getStatuses, getMilestones
- `src/lib/types.ts` — CompanyOverview, DepartmentSummary, RankedOpportunity

## Testing
- Total opportunities = 17 (9 accounting + 8 sales-ops)
- Scoring formula verified with known values
- Top wins sorted descending
- Milestone grouping includes all opportunities
- Department summaries have correct counts

## Commit Message
"Add data aggregation layer with scoring and ranking"
