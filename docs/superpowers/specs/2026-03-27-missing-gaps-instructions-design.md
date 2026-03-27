# Missing Gaps Instructions Feature Design

**Date:** 2026-03-27
**Status:** Approved

## Overview

Three changes to improve the AI Priorities and Missing Gaps experience:

1. Hide priorities without valid hours/week from the AI Priorities table
2. Show a banner on AI Priorities linking to Missing Gaps with the count of excluded items
3. Build an inline instructions system on Missing Gaps that guides users to resolve each gap via Claude

## Part 1: AI Priorities Filtering + Banner

**File:** `src/app/page.tsx`

- Filter `getTopWins(100)` results to only items where `parsedTimeSavings.valid === true`
- Count excluded items (unfiled count)
- If unfiled count > 0, render an amber banner above the table:
  - Text: `"{N} priorities are missing hours/week estimates. View Missing Gaps to resolve them."`
  - "Missing Gaps" links to `/unfiled`
- No changes to `PrioritiesTable.tsx` — filtering happens in the page component

## Part 2: Missing Gaps Instructions System

### Expandable Instruction Rows

**File:** `src/components/MissingGapsTable.tsx`

Each row gets an "Instructions" button. Clicking toggles an expanded section below that row containing:

**1. Collapsible "How to use this" guide:**
   1. Copy the prompt below
   2. Paste it into Claude (claude.ai) and answer its questions
   3. Upload the generated `.md` file using the button below

**2. Pre-built prompt block:**
   - Rendered in a `<pre>` block with a "Copy to clipboard" button
   - Dynamically generated per priority, includes:
     - Priority name, department, rank
     - Current raw text (the unparsable time estimate)
     - Instructions for Claude to ask the user questions one at a time to determine:
       - What the task involves
       - How often it's done
       - How long it takes manually
       - Estimated hours saved per week with automation
     - Instructions for Claude to output a corrected markdown snippet with a valid `**Estimated Time Savings:**` field in hours/week format

**3. "Upload Fix" button:**
   - Links to `/upload?type=priorities&dept={slug}`
   - Styled as a secondary button

### UploadForm Query Param Pre-fill

**File:** `src/components/UploadForm.tsx`

- Read `type` and `dept` query params from the URL on mount
- If `type=priorities`, pre-select "Automation Priorities" toggle
- If `dept={slug}`, pre-select that department in the dropdown

## Constraints

- All changes are client-side — no new API routes
- The prompt template is plain text, not executable
- The instructions guide is generic enough to work with any LLM, but references Claude by name
- Must scale to 11+ departments without changes
