# Missing Gaps Workflow Redesign — Design Spec

**Date:** 2026-03-30
**Goal:** Replace the card carousel (GapCard/GapCardList) with an expandable-row view grouped by department, a 6-step workflow progress bar, and a department-level prompt generator for Claude Cowork.

---

## Problem Statement

The current Missing Gaps page shows one priority at a time in a card carousel with inline editing. Users don't fill fields manually — they use Claude Cowork to generate the data. The page needs to reflect this workflow: see gaps, copy a prompt, run it in Cowork, get output, upload to X-Ray, review results.

---

## Architecture

Three units of work:

1. **MissingGapsWorkflow component** — client component with progress bar, department tabs, expandable priority rows
2. **Prompt generator** — builds a department-level prompt with full context for Claude Cowork
3. **Unfiled page rewrite** — server component that fetches department-grouped data

---

## Section 1: Workflow Progress Bar

A 6-step horizontal stepper at the top of the page:

1. **See Gaps** — active on page load
2. **Copy Prompt** — activates after user clicks "Copy Prompt"
3. **Run in Cowork** — activates after copy (user does this externally)
4. **Get Output** — informational step (user does this externally)
5. **Upload to X-Ray** — provides link to the upload page
6. **Review** — activates when user returns from upload

Steps are tracked in client state. Steps 1-2 are triggered by user actions on the page. Steps 3-4 are passive (shown as "current" after copy to guide the user). Step 5 is a link to `/org/{slug}/upload`. Step 6 activates when the page reloads after upload (if there are still gaps, the bar resets to step 1 with a message "Some gaps remain — let's go again").

Visual: numbered circles connected by lines. Active step is emerald green. Completed steps have checkmarks. Future steps are grey.

---

## Section 2: Department Tabs + Expandable Rows

### Department Tabs

Horizontal tab bar below the progress bar. One tab per department that has at least one incomplete priority. Each tab shows department name and badge with count of incomplete priorities.

Clicking a tab selects that department and updates the rows below.

### Expandable Priority Rows

Each incomplete priority is a single row:

**Collapsed state:**
- Chevron (right arrow)
- Rank badge (number in emerald circle)
- Priority name
- Missing field tags (amber pills, e.g., "Missing: time savings")
- Completeness score ("8/10")

**Expanded state:**
- Chevron (down arrow)
- All fields displayed in a 2-column grid below the header row
- Filled fields: emerald header label, slate text content
- Missing fields: amber header label with warning icon, amber background box with text "This field will be included in the generated prompt"

Clicking the row header toggles expand/collapse.

---

## Section 3: Department-Level Prompt Generator

### Button

"Copy Prompt for Claude Cowork" button displayed above the priority rows for the selected department.

### Prompt content

The generated prompt includes:

**Department context:**
- Department name, mission, scope
- Team members (name, title, responsibilities)
- Tools & software
- Pain points
- Single points of failure
- Tribal knowledge risks

**For each incomplete priority:**
- All known fields (name, what to automate, current state, etc.)
- Explicit list of missing fields with instructions to provide them

**Output format instructions:**
- Asks Claude Cowork to produce a markdown file matching the department's automation priorities format
- Specifies the exact field names and format expected
- Instructs to output ONLY the priorities that had missing data, with all fields filled

### Function: `src/lib/generate-prompt.ts`

```typescript
export function generateDepartmentPrompt(
  department: DbDepartment,
  teamMembers: DbTeamMember[],
  incompletePriorities: RankedOpportunity[],
): string
```

Returns a string prompt ready to copy to clipboard.

### Copy behavior

Clicking "Copy Prompt" copies the prompt text to clipboard, shows "Copied!" feedback, and advances the progress bar to step 2.

---

## Section 4: Unfiled Page Rewrite

### `src/app/org/[orgSlug]/unfiled/page.tsx`

Server component that fetches:
- All departments for the org (`getDepartments`)
- All unfiled/incomplete priorities (`getUnfiledRankedOpportunities`)
- Team members for each department that has incomplete priorities (`getTeamMembers`)

Groups priorities by department slug. Passes grouped data to `MissingGapsWorkflow`.

### Data shape passed to client

```typescript
interface DepartmentGaps {
  department: DbDepartment;
  teamMembers: DbTeamMember[];
  priorities: RankedOpportunity[];
}
```

---

## Section 5: Files Changed

- **Rewrite:** `src/app/org/[orgSlug]/unfiled/page.tsx`
- **Create:** `src/components/MissingGapsWorkflow.tsx` — main client component
- **Create:** `src/lib/generate-prompt.ts` — prompt builder
- **Delete:** `src/components/GapCard.tsx`
- **Delete:** `src/components/GapCardList.tsx`

---

## Testing

- Page shows workflow progress bar at step 1 on load
- Department tabs show with correct incomplete counts
- Clicking a tab switches department view
- Collapsed rows show name, missing tags, completeness score
- Expanding a row shows all fields — filled and missing
- "Copy Prompt" copies to clipboard and advances to step 2
- Generated prompt includes full department context and all missing fields
- Link to upload page works from step 5
- All-complete state shows success message
