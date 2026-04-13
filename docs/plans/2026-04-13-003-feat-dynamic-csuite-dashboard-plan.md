---
title: "feat: Replace static dashboard views with dynamic CSuite command center"
status: completed
origin: docs/brainstorms/dynamic-csuite-dashboard-requirements.md
created: 2026-04-13
depth: deep
---

# feat: Replace static dashboard views with dynamic CSuite command center

## Problem Frame

After login, users see a plain AI Priorities table and a basic admin/member-split dashboard. The static CSuite demo at `/wevend` — with its two-panel command center, department color palettes, per-priority reporting views with charts, stat cards, tables, and AI summaries — is what clients expect. Replace both views entirely with a dynamic version of this dashboard powered by real database data and auto-generated placeholder reporting for new priorities.

(see origin: `docs/brainstorms/dynamic-csuite-dashboard-requirements.md`)

## Scope Boundaries

- No mechanism to replace placeholder data with real data (future feature)
- No role-based view differences — everyone sees the same dashboard
- No manual color palette selection — auto-assigned only
- No offline/static file export
- No changes to the X-Ray interview or intake flow itself
- Existing views at `/wevend` and `/csuite` are not touched

## Key Decisions

### D1: Reporting data stored as JSON column on priorities table

**Decision**: Add `reporting_data jsonb DEFAULT NULL` to the `priorities` table.

**Rationale**: A separate table adds join complexity for no benefit — the reporting data is always fetched with its priority and is a 1:1 relationship. A JSON column keeps the data co-located and queryable when needed. The shape matches the static `CSUITE_DATA` structure (stat_cards, charts, summary, table). `NULL` means "no reporting data generated yet" (different from placeholder, which is explicitly generated).

**Shape** (mirrors `public/wevend/data.js`):
```typescript
interface ReportingData {
  layout: 'standard' | 'table-first' | 'chart-heavy' | 'full-width';
  is_placeholder: boolean;
  stat_cards: { label: string; value: string; subtitle: string }[];
  summary: string;
  charts: {
    id: string;
    title: string;
    type: 'line' | 'bar' | 'doughnut' | 'stacked-bar' | 'horizontal-bar' | 'multi-line';
    data: { labels: string[]; datasets: { label: string; data: number[] }[] };
  }[];
  table: {
    columns: string[];
    rows: string[][];
    badges?: Record<number, Record<string, 'success' | 'warning' | 'danger'>>;
  };
}
```

### D2: Priority slug column for clean URLs

**Decision**: Add `slug text` to the `priorities` table with a unique constraint per department (`UNIQUE (department_id, slug)`).

**Rationale**: Priorities currently have no slug. Using rank as URL segment breaks when ranks reorder. Using UUID is user-hostile. A slugified name (generated from `name` at creation/update) gives clean, stable, shareable URLs like `/dashboard/accounting/sales-orders-invoicing`. Existing priorities need a backfill migration.

### D3: Department color palettes via `color_index` column

**Decision**: Add `color_index int` to the `departments` table. A lookup function maps index → palette. Pool of 20 palettes; index assigned at creation time (next available or max+1). Fallback to neutral gray palette when index >= pool size.

**Rationale**: Deterministic assignment (array index of sorted departments) would reshuffle all colors when a department is added/removed. Storing the index makes colors stable. No need for a full JSON palette column — a single integer is cheaper and the palette pool lives in code.

### D4: Inline sidebar selection + nested routes (hybrid)

**Decision**: At company view (`/dashboard`), clicking a dept in the sidebar shows that dept's summary inline via client state — URL stays at `/dashboard`. The inline summary includes a CTA link that navigates to `/dashboard/[deptSlug]`. Same pattern at department level. This matches the static dashboard's interaction model exactly.

**Rationale**: Inline previews give fast, lightweight browsing. Full routes give shareable deep links and browser history. The CTA link is the bridge between the two. (see origin R5, R9, R13)

### D5: Recharts for all chart types

**Decision**: Use recharts v3.8.1 (already installed) for all dynamic dashboard charts.

**Rationale**: Already in the project with a working pattern (`src/components/MilestoneChart.tsx`). Supports all 6 required chart types. Chart.js remains only for the static SPAs at `/wevend` and `/csuite`.

### D6: Unified view for all roles

**Decision**: Remove role-based view splitting. All roles (owner, admin, member) see the same dashboard. Dashboard is visible in nav for all roles. Dashboard is the default landing page.

**Rationale**: The current admin/member split creates maintenance burden and confusion. The CSuite dashboard's value is that everyone sees the full company picture. (see origin R6)

### D7: Missing data badge reuses existing completeness infrastructure

**Decision**: Use existing `getUnfiledRankedOpportunities` (which calls `getCompletenessScore`) to compute the nav badge count. For priority sidebar cards, pass the `completeness` object already on `RankedOpportunity` and show a badge when `score < total`.

**Rationale**: The completeness scoring system is already built and tested. No new query needed — just surface the existing data in new places.

## Requirements Trace

| Req | Description | Implementation Unit |
|-----|-------------|-------------------|
| R1 | Delete AI Priorities view | IU-7 |
| R2 | Delete current Dashboard views | IU-7 |
| R3 | Replace with dynamic CSuite dashboard | IU-3, IU-4, IU-5 |
| R4 | Dashboard is default landing page | IU-6 |
| R5 | Three levels of nested routes | IU-3, IU-4, IU-5 |
| R6 | All roles see same view | IU-6 |
| R7 | Company: two-panel layout with dept sidebar | IU-3 |
| R8 | Company: aggregate stats default | IU-3 |
| R9 | Company: click dept → inline summary | IU-3 |
| R10 | Company: click again → deselect | IU-3 |
| R11 | Dept: two-panel with priority sidebar | IU-4 |
| R12 | Dept: aggregate stats default | IU-4 |
| R13 | Dept: click priority → inline summary | IU-4 |
| R14 | Dept: click again → deselect | IU-4 |
| R15 | Priority detail: full reporting view | IU-5 |
| R16 | 4 layout templates | IU-5 |
| R17 | 6 chart types | IU-5 |
| R18 | Auto-generate placeholder reporting data | IU-2 |
| R19 | Placeholder indicator near title | IU-4, IU-5 |
| R20 | Replacing placeholder out of scope | N/A |
| R21 | Auto-assign color palettes | IU-1 |
| R22 | 5 color roles per palette | IU-1 |
| R23 | Fallback to neutral grays | IU-1 |
| R24 | Missing data badge on priority cards | IU-4 |
| R25 | Nav count badge for missing data | IU-6 |
| R26 | Responsive 768px sidebar collapse | IU-3, IU-4 |

## Implementation Units

### IU-1: Database migration — slug, color_index, reporting_data
- [x] Complete

**Goal**: Add the three new columns and backfill existing data.

**Files**:
- `supabase/migrations/011_dashboard_columns.sql` (new)
- `src/lib/types.ts` (update DbPriority, DbDepartment)
- `src/lib/constants.ts` (add color palette utilities)

**Approach**:
1. Add `slug text` to priorities with `UNIQUE (department_id, slug)`
2. Add `color_index int` to departments
3. Add `reporting_data jsonb DEFAULT NULL` to priorities
4. Backfill slugs for existing priorities: `slugify(name)` with collision handling (append `-2`, `-3`)
5. Backfill color_index for existing departments: assign sequentially per org ordered by name
6. Add `NOT NULL` constraint on slug after backfill
7. Update RLS — no new policies needed (existing department/priority policies cover new columns)
8. Add `DEPARTMENT_COLOR_PALETTES` array (20 palettes, 5 roles each) and `getColorPalette(colorIndex: number)` to `src/lib/constants.ts`. Source the first 12 from static dashboard's `DEPARTMENT_COLORS`, fill remaining 8 with visually distinct additions. Fallback returns neutral gray.
9. **Intentionally do NOT backfill `reporting_data`** for existing priorities — IU-5 handles null at render time via deterministic on-the-fly generation. This avoids a complex migration that imports application logic into SQL.

**Patterns to follow**: `supabase/migrations/009_intake_redesign.sql` for migration style

**Test scenarios**:
- Migration runs cleanly on empty database
- Backfill generates unique slugs per department (handles name collisions)
- Backfill assigns sequential color indices per org
- RLS policies still allow read/write for org members
- `getColorPalette(0)` returns first palette with all 5 color roles
- `getColorPalette(25)` returns neutral gray fallback

**Verification**: Migration applies successfully. `DbPriority` type includes `slug`, `reporting_data`. `DbDepartment` includes `color_index`. Color palette lookup works.

---

### IU-2: Placeholder reporting data generator
- [x] Complete

**Goal**: Create a function that generates realistic-looking placeholder reporting data from priority metadata (effort, complexity, impact, time savings) and auto-generates on priority creation.

**Files**:
- `src/lib/reporting.ts` (new)
- `src/lib/types.ts` (add ReportingData type)

**Approach**:
1. Define `ReportingData` TypeScript interface matching D1 shape
2. Create `generatePlaceholderReporting(priority: DbPriority): ReportingData` that:
   - Uses priority name, effort, complexity, estimated_time_savings to seed values
   - Generates 4 stat cards contextual to the priority
   - Generates 2-3 charts with plausible data (seeded by priority ID for stability)
   - Generates a summary paragraph
   - Generates a detail table with 6-8 rows
   - Sets `is_placeholder: true`
   - Picks layout template based on chart count / data density
3. Create a deterministic seeded random using priority ID hash so charts don't change on regeneration

**Note**: Color palette utilities (`DEPARTMENT_COLOR_PALETTES` array, `getColorPalette` function) belong in `src/lib/constants.ts`, not here. See IU-1.

**Patterns to follow**: `public/wevend/data.js` for reporting data shape; `src/lib/constants.ts` for exported config

**Test scenarios**:
- Generator produces valid ReportingData shape for all effort/complexity/impact combinations
- Generated data is deterministic (same priority ID → same output)
- `is_placeholder` is always true
- Stat card values are plausible (not negative, not absurdly large)
- Chart datasets have correct label count matching data array length
**Verification**: Unit tests pass. Type-checks clean.

---

### IU-3: Company-level dashboard view
- [x] Complete

**Goal**: Build the company-level dashboard at `/org/[slug]/dashboard` with two-panel command center layout.

**Files**:
- `src/app/org/[orgSlug]/dashboard/page.tsx` (rewrite)
- `src/app/org/[orgSlug]/dashboard/layout.tsx` (new — shared dashboard layout)
- `src/components/dashboard/CompanyDashboard.tsx` (new)
- `src/components/dashboard/DepartmentSidebar.tsx` (new)
- `src/components/dashboard/StatCard.tsx` (new)
- `src/components/dashboard/DashboardChart.tsx` (new)

**Approach**:
1. Server component page fetches departments, priorities, milestones via existing `getCompanyOverview` + `getDepartments`
2. Dashboard layout establishes the two-panel structure: 260px left sidebar + flexible main area
3. `CompanyDashboard` is a client component managing selected-department state
4. Default main area: aggregate stat cards (total priorities, in-progress, completed, departments), department bar chart (priorities per dept), status doughnut chart, company AI summary
5. Sidebar: department cards with name, priority count, active count, department color accent
6. Click dept → main area shows dept summary (stat cards, status + impact charts, AI summary, CTA "View Department →" link to `/org/[orgSlug]/dashboard/[deptSlug]`)
7. Click same dept → deselect, return to aggregate view
8. At 768px: sidebar collapses to horizontal scrollable pill row above main content

**Patterns to follow**: `src/components/MilestoneChart.tsx` for recharts usage; `public/wevend/data.js` for stat card / chart layout reference

**Test scenarios**:
- Company view renders with 0 departments (empty state message)
- Company view renders aggregate stats correctly for org with multiple departments
- Clicking department in sidebar shows department summary inline
- Clicking selected department deselects and shows aggregate view
- Department cards show color accent from assigned palette
- Stat cards show correct counts (total, in-progress, completed)
- Charts render with correct data (bar chart for dept breakdown, doughnut for status)
- At 768px viewport, sidebar renders as horizontal scrollable pills

**Verification**: Visual match to static `/wevend` company-level view. Interactive selection/deselection works. Responsive layout verified at 768px.

---

### IU-4: Department-level dashboard view
- [x] Complete

**Goal**: Build the department-level view at `/org/[slug]/dashboard/[deptSlug]` with priority sidebar and inline selection.

**Files**:
- `src/app/org/[orgSlug]/dashboard/[deptSlug]/page.tsx` (new)
- `src/components/dashboard/DepartmentView.tsx` (new)
- `src/components/dashboard/PrioritySidebar.tsx` (new)
- `src/components/dashboard/PrioritySummaryCard.tsx` (new)

**Approach**:
1. Server component page resolves department by slug via `getDepartmentBySlug`, fetches priorities via `getPriorities`
2. Two-panel layout reusing dashboard layout: left sidebar lists priorities (rank, name, status badge, impact level, completeness badge if missing data, placeholder badge if `is_placeholder`)
3. `DepartmentView` is a client component managing selected-priority state
4. Default main area: dept stat cards (total priorities, by status, by impact), status doughnut + impact doughnut charts, dept AI summary
5. Click priority → main area shows priority summary (stat cards from reporting_data, first 2 charts, AI summary snippet, CTA "View Details →" link to `/org/[orgSlug]/dashboard/[deptSlug]/[prioritySlug]`)
6. Click same priority → deselect, return to department overview
7. Priority cards in sidebar show:
   - Orange badge when `completeness.score < completeness.total` (missing data)
   - "Placeholder" tag when `reporting_data.is_placeholder === true`
8. At 768px: sidebar collapses to horizontal scrollable pill row

**Patterns to follow**: IU-3 sidebar/selection pattern; `src/lib/db.ts:getCompletenessScore` for completeness check

**Test scenarios**:
- Department view renders with 0 priorities (empty state)
- Priority sidebar shows rank, name, status badge, impact level
- Missing data badge appears when priority has incomplete fields
- Placeholder indicator appears when reporting_data.is_placeholder is true
- Clicking priority shows inline summary with first 2 charts
- Clicking selected priority deselects to dept overview
- Invalid deptSlug returns 404
- Department color palette applied to charts and accents

**Verification**: Visual match to static `/wevend` department-level view. Badges and indicators visible. 404 for invalid slug.

---

### IU-5: Priority detail/reporting view
- [x] Complete

**Goal**: Build the full priority reporting page at `/org/[slug]/dashboard/[deptSlug]/[prioritySlug]`.

**Files**:
- `src/app/org/[orgSlug]/dashboard/[deptSlug]/[prioritySlug]/page.tsx` (new)
- `src/components/dashboard/PriorityReportingView.tsx` (new)
- `src/components/dashboard/ReportingTable.tsx` (new)
- `src/components/dashboard/ChartRenderer.tsx` (new)

**Approach**:
1. Server component resolves dept + priority by slugs, fetches reporting_data
2. If `reporting_data` is null (pre-migration priorities), generate placeholder on-the-fly using the same deterministic `generatePlaceholderReporting` from IU-2 (seeded by priority ID — output is stable across page loads). Do not persist — the priority will get real reporting data when the user replaces it.
3. Full-width main area (no sidebar at this level)
4. Layout driven by `reporting_data.layout`:
   - `standard`: stat cards → charts (2-col) → summary → table
   - `table-first`: stat cards → table → charts → summary
   - `chart-heavy`: stat cards → charts (2x2 grid) → summary → table
   - `full-width`: stat cards → charts (full-width stacked) → summary → table
5. `ChartRenderer` component handles all 6 chart types via recharts:
   - `line` → `<LineChart>`
   - `bar` → `<BarChart>`
   - `doughnut` → `<PieChart>` with innerRadius
   - `stacked-bar` → `<BarChart>` with stacked datasets
   - `horizontal-bar` → `<BarChart layout="vertical">`
   - `multi-line` → `<LineChart>` with multiple datasets
6. `ReportingTable` renders data table with column headers, rows, and badge coloring
7. Placeholder indicator: amber badge next to priority title "Sample Data — Replace with actuals"
8. Priority title includes department color accent

**Patterns to follow**: `src/components/MilestoneChart.tsx` for recharts; `public/wevend/data.js` for visual reference of each chart type

**Test scenarios**:
- Renders all 4 layout templates correctly
- Renders all 6 chart types without error
- Stat cards display label, value, subtitle
- Table renders with correct columns, rows, and badge colors
- Placeholder badge visible when `is_placeholder` is true
- Placeholder badge hidden when `is_placeholder` is false
- Invalid prioritySlug returns 404
- Handles priority with null reporting_data (generates on-the-fly)
- Department color palette applied to chart colors

**Verification**: Visual match to static `/wevend` priority detail views. All chart types render. Layout variants work.

---

### IU-6: Navigation, routing, and post-login redirects
- [x] Complete

**Goal**: Update nav to show Dashboard for all roles as the default, add missing data count badge, update post-login redirects.

**Files**:
- `src/app/org/[orgSlug]/layout.tsx` (update nav links)
- `src/components/AuthForm.tsx` (update redirect)
- `src/app/auth/callback/route.ts` (update redirect)
- `src/app/(public)/update-password/page.tsx` (update redirect)

**Approach**:
1. In `layout.tsx`:
   - Remove `AI Priorities` from nav entirely
   - Make `Dashboard` visible to all roles (remove role filter)
   - Make Dashboard the first nav item
   - Add missing data count badge: compute via `getUnfiledRankedOpportunities(org.id).length` (already called as `unfiled`)
   - Show badge next to "Dashboard" label when count > 0
2. Update post-login redirects (3 files):
   - `AuthForm.tsx` line 66: `/org/${org.slug}/priorities` → `/org/${org.slug}/dashboard`
   - `auth/callback/route.ts` line 52: same change
   - `update-password/page.tsx` line 60: same change

**Patterns to follow**: Existing badge pattern in layout.tsx (Intake badge)

**Test scenarios**:
- Dashboard appears in nav for all roles (owner, admin, member)
- AI Priorities link no longer appears in nav
- Missing data badge shows correct count next to Dashboard
- Missing data badge hidden when count is 0
- Post-login redirect goes to `/dashboard` (not `/priorities`)
- Magic link callback redirects to `/dashboard`
- Password reset callback redirects to `/dashboard`

**Verification**: Nav renders correctly for all roles. Badge count matches reality. All login flows land on dashboard.

---

### IU-7: Delete old views and components
- [x] Complete

**Goal**: Remove the old AI Priorities view, the old Dashboard views (ExecutiveDashboard, DashboardContent), and their dependencies.

**Files to delete**:
- `src/app/org/[orgSlug]/priorities/page.tsx`
- `src/components/PrioritiesPageContent.tsx`
- `src/components/PrioritiesTable.tsx`
- `src/components/ExecutiveDashboard.tsx`
- `src/components/DashboardContent.tsx`

**Approach**:
1. Delete the 5 files listed above
2. Search for any imports of these components and remove them
3. Verify no other routes or components reference the deleted files
4. Keep `src/lib/db.ts` functions intact — `getTopWins`, `getCompanyOverview`, etc. are still used by the new dashboard

**Test scenarios**:
- Build succeeds with no import errors
- No routes reference deleted components
- `/org/[slug]/priorities` returns 404

**Verification**: `npm run build` succeeds. No broken imports.

---

### IU-8: Slug generation on priority creation
- [x] Complete

**Goal**: Ensure new priorities get a slug and placeholder reporting data when created through the intake system.

**Files**:
- `supabase/migrations/009_intake_redesign.sql` — `apply_extraction()` PL/pgSQL function (priority INSERT statements at lines ~136, ~287, ~373)
- `src/app/api/intake/complete/route.ts` — POST handler that calls `apply_extraction`
- `src/lib/apply-extraction.ts` — wrapper around the RPC call
- `src/lib/reporting.ts` (import generator)
- `scripts/seed.ts` (update seed to include slug + reporting_data)

**Approach**:
1. Priority creation happens in the `apply_extraction()` Postgres function (migration 009). Three INSERT paths: append mode (line ~136), overwrite/create new (line ~287), and create department (line ~373).
2. Before insert, generate slug from priority name using a `slugify` utility (lowercase, replace spaces with hyphens, strip special chars, truncate to 80 chars)
3. Handle slug collisions within the same department (append `-2`, `-3`)
4. After insert, generate placeholder reporting data via `generatePlaceholderReporting` and update the priority's `reporting_data` column
5. For department creation, assign `color_index` as `MAX(color_index) + 1` for the org (or 0 if first department)

**Patterns to follow**: Existing priority creation flow in the codebase

**Test scenarios**:
- New priority gets a slug derived from its name
- Slug collision within same department gets `-2` suffix
- New priority gets placeholder reporting_data with `is_placeholder: true`
- New department gets next sequential color_index
- First department in org gets color_index 0

**Verification**: Create a priority through intake → verify slug and reporting_data are populated in database.

## Deferred to Implementation

- **Exact placeholder data generation logic**: The generator needs to produce contextually relevant stat cards, chart titles, and summary text based on priority metadata. The specific text templates and number ranges should be determined during implementation by studying the static data in `public/wevend/data.js`.
- **Empty state UI copy**: The exact messaging for 0-department org or 0-priority department views.
- **Long name truncation**: CSS truncation with tooltip — exact max-width values determined during implementation.

## Dependencies and Sequencing

```
IU-1 (migration + palettes) ──→ IU-2 (reporting generator) ──→ IU-8 (slug/reporting on create)
       │                                │
       │                                ├──→ IU-3 (company view) ──→ IU-4 (dept view) ──→ IU-5 (priority detail)
       │                                │
       └──→ IU-6 (nav/routing)          │
                                        └── IU-3 needs palette lookup from IU-1

IU-3..IU-6 complete ──→ IU-7 (delete old views)
```

- IU-1 must go first (schema + palette utilities everything depends on)
- IU-2 depends on IU-1 (needs types)
- IU-3 depends on IU-1 (needs palette lookup) and IU-2 (needs reporting data types for inline previews)
- IU-3, IU-4, IU-5 are sequential (each level builds on the previous)
- IU-6 can run in parallel with IU-3..IU-5
- IU-7 goes last (can't delete old views until new ones are working)
- IU-8 can run after IU-2


## System-Wide Impact

- **Post-login redirect**: Changes from `/priorities` to `/dashboard` in 3 files (AuthForm, auth callback, update-password). Any future login flows must redirect to `/dashboard`.
- **Nav structure**: Dashboard moves from admin/owner-only to all-roles. AI Priorities link removed entirely.
- **Database schema**: 3 new columns on existing tables. Migration must be applied to both local and production Supabase instances.
- **URL structure**: New nested routes. Old `/org/[slug]/priorities` route will 404 after IU-7. If any external links point to `/priorities`, they'll break.

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Recharts bundle size increases page load | Medium | Low | Dynamic import chart components, only load chart types actually used |
| Placeholder data looks unconvincing | Medium | Medium | Study static data closely, use contextual labels from priority metadata |
| Slug collisions on backfill | Low | Medium | Collision handling in migration (append counter) |
| Large orgs (50+ priorities) slow to render | Low | Medium | Server-side pagination if needed; for now, existing orgs are small |

## Verification Strategy

1. **Per-unit verification**: Each IU has specific test scenarios and a verification statement
2. **Visual verification**: Compare each dashboard level against the static `/wevend` demo
3. **Integration test**: Full flow — login → land on dashboard → browse company → dept → priority detail → back navigation
4. **Responsive test**: Verify 768px breakpoint behavior at company and department levels
5. **Role test**: Login as owner, admin, member — all see same dashboard
6. **Empty state test**: Org with 0 departments, department with 0 priorities
