# Upload Feature Design

**Date:** 2026-03-27
**Status:** Approved

## Overview

Add a file upload feature so non-technical users (department leads, managers) can upload department X-Ray markdown files via the web app. Uploaded data appears immediately without a rebuild. Requires switching the app from static generation to dynamic (request-time) rendering.

## Upload Page & UI

**Route:** `/upload`

- Single file input accepting `.md` files only
- Toggle to select file type: "Department Profile" or "Automation Priorities"
- Department name auto-detected from the filename (e.g., `Infrastructure_Compliance_Department_Profile.md` → "Infrastructure Compliance")
- If name can't be parsed from filename: show dropdown with existing departments plus "New Department" option. Selecting "New Department" reveals a text input for the name.
- Client-side validation: reject non-`.md` files with message: "This file must be in .md format. Use an LLM like Claude to convert your document to markdown first."
- Submit posts file + department info + file type to `POST /api/upload`
- On success: redirect to the department's detail page
- On error: show error message inline
- Add "Upload" link to navbar

## API Route

**Endpoint:** `POST /api/upload`
**File:** `src/app/api/upload/route.ts`

- Accepts multipart form data: `.md` file, department slug, file type (profile or priorities)
- Validates file is `.md` and non-empty
- Generates slug from department name (lowercase, spaces → hyphens, strip special chars)
- Writes file to `artifacts/WeVend X-Ray/{slug}/department_profile.md` or `automation_priorities.md`
- Creates subdirectory if it doesn't exist (new department)
- For new departments with automation priorities: parses priority count from the file headings, adds entries to `status.json`
- Returns JSON: `{ slug: string }` on success, `{ error: string }` on failure

## Dynamic Rendering Switch

Add `export const dynamic = 'force-dynamic'` to all pages that read department data:

- `src/app/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/app/tracker/page.tsx`
- `src/app/unfiled/page.tsx`
- `src/app/risks/page.tsx`
- `src/app/dependencies/page.tsx`
- `src/app/tools/page.tsx`
- `src/app/department/[slug]/page.tsx`
- `src/app/plan/[slug]/[priority]/page.tsx`
- `src/app/layout.tsx`

Remove `generateStaticParams()` from dynamic route pages (department detail, plan detail).

`/tour` stays static (hardcoded content).

## Constraints

- Only `.md` files accepted — no server-side format conversion
- Data stored on filesystem (not suitable for serverless/edge without persistent storage)
- Parser runs ~50ms per request — acceptable for internal tool with <100 users
- Must scale to 11+ departments without UI changes
