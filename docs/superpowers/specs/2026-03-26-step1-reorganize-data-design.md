# Step 1: Reorganize Data Files + Install Dependencies

## Context
X-Ray V1 MVP needs a standardized file structure for department data so the markdown parser (Step 3) can scan `/artifacts` subdirectories by convention. The existing files in `artifacts/WeVend X-Ray/` have inconsistent names and are all in one folder.

## Scope
- Copy 4 markdown files to standardized locations
- Create 2 JSON config files
- Install 6 npm packages
- Single commit

## File Operations

### 1a. Copy to standardized structure

| Source | Destination |
|--------|-------------|
| `artifacts/WeVend X-Ray/Accounting_Department-Profile_Doc_v2.md` | `artifacts/accounting/department_profile.md` |
| `artifacts/WeVend X-Ray/Accounting_Automation-Priorities_Doc_v2.md` | `artifacts/accounting/automation_priorities.md` |
| `artifacts/WeVend X-Ray/SalesOperations_Department_Profile.md` | `artifacts/sales-operations/department_profile.md` |
| `artifacts/WeVend X-Ray/SalesOperations_Automation_Priorities.md` | `artifacts/sales-operations/automation_priorities.md` |

Originals remain untouched in `artifacts/WeVend X-Ray/`.

### 1b. Create `artifacts/milestones.json`
4-stage milestone definitions: Not Started (0), Implemented (1), 2 Weeks Stable (2), Dept Head Confirmed (3).

### 1c. Create `artifacts/status.json`
Per-priority tracking for 16 priorities (9 accounting, 7 sales-ops). All milestone 0 except `sales-operations/priority-1` at milestone 1.

### 1d. Install dependencies
```
npm install gray-matter remark remark-html rehype-stringify unified recharts
```

## Verification
- All 4 copied files exist and match originals
- Both JSON files parse without error
- `npm run build` still succeeds
- Originals in `WeVend X-Ray/` unchanged

## Commit Message
"Reorganize artifacts, add milestone configs, install parsing and chart dependencies"
