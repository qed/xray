# Step 1: Reorganize Data Files + Install Dependencies

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the standardized data file structure and install dependencies so the parser (Step 3) can scan department subdirectories by convention.

**Architecture:** Copy 4 markdown files from `artifacts/WeVend X-Ray/` to department-specific subdirectories with standardized names. Create 2 JSON config files at the artifacts root. Install markdown parsing and charting libraries.

**Tech Stack:** Node.js (fs operations), npm (dependency management)

---

### Task 1: Create department directories and copy files

**Files:**
- Create: `artifacts/accounting/department_profile.md` (copy from source)
- Create: `artifacts/accounting/automation_priorities.md` (copy from source)
- Create: `artifacts/sales-operations/department_profile.md` (copy from source)
- Create: `artifacts/sales-operations/automation_priorities.md` (copy from source)

- [ ] **Step 1: Create directories and copy files**

```bash
mkdir -p artifacts/accounting artifacts/sales-operations

cp "artifacts/WeVend X-Ray/Accounting_Department-Profile_Doc_v2.md" artifacts/accounting/department_profile.md
cp "artifacts/WeVend X-Ray/Accounting_Automation-Priorities_Doc_v2.md" artifacts/accounting/automation_priorities.md
cp "artifacts/WeVend X-Ray/SalesOperations_Department_Profile.md" artifacts/sales-operations/department_profile.md
cp "artifacts/WeVend X-Ray/SalesOperations_Automation_Priorities.md" artifacts/sales-operations/automation_priorities.md
```

- [ ] **Step 2: Verify copies match originals**

```bash
diff "artifacts/WeVend X-Ray/Accounting_Department-Profile_Doc_v2.md" artifacts/accounting/department_profile.md
diff "artifacts/WeVend X-Ray/Accounting_Automation-Priorities_Doc_v2.md" artifacts/accounting/automation_priorities.md
diff "artifacts/WeVend X-Ray/SalesOperations_Department_Profile.md" artifacts/sales-operations/department_profile.md
diff "artifacts/WeVend X-Ray/SalesOperations_Automation_Priorities.md" artifacts/sales-operations/automation_priorities.md
```

Expected: No output (files are identical).

- [ ] **Step 3: Verify directory structure**

```bash
ls -la artifacts/accounting/
ls -la artifacts/sales-operations/
```

Expected: Each directory contains `department_profile.md` and `automation_priorities.md`.

---

### Task 2: Create milestones.json

**Files:**
- Create: `artifacts/milestones.json`

- [ ] **Step 1: Create the file**

Create `artifacts/milestones.json` with this exact content:

```json
{
  "milestones": [
    { "id": 0, "name": "Not Started", "definition": "Identified but no work begun" },
    { "id": 1, "name": "Implemented", "definition": "Solution built and deployed" },
    { "id": 2, "name": "2 Weeks Stable", "definition": "Running 14+ days, no critical issues" },
    { "id": 3, "name": "Dept Head Confirmed", "definition": "Department lead verified and signed off" }
  ]
}
```

- [ ] **Step 2: Verify JSON parses**

```bash
node -e "const d = require('./artifacts/milestones.json'); console.log(d.milestones.length, 'milestones'); d.milestones.forEach(m => console.log(m.id, m.name))"
```

Expected:
```
4 milestones
0 Not Started
1 Implemented
2 2 Weeks Stable
3 Dept Head Confirmed
```

---

### Task 3: Create status.json

**Files:**
- Create: `artifacts/status.json`

- [ ] **Step 1: Create the file**

Create `artifacts/status.json` with this exact content:

```json
{
  "accounting/priority-1": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "accounting/priority-2": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "accounting/priority-3": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "accounting/priority-4": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "accounting/priority-5": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "accounting/priority-6": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "accounting/priority-7": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "accounting/priority-8": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "accounting/priority-9": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "sales-operations/priority-1": { "milestone": 1, "updated": "2026-03-20", "notes": "Phase A in progress" },
  "sales-operations/priority-2": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "sales-operations/priority-3": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "sales-operations/priority-4": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "sales-operations/priority-5": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "sales-operations/priority-6": { "milestone": 0, "updated": "2026-03-26", "notes": "" },
  "sales-operations/priority-7": { "milestone": 0, "updated": "2026-03-26", "notes": "" }
}
```

- [ ] **Step 2: Verify JSON parses and has correct entries**

```bash
node -e "const d = require('./artifacts/status.json'); const keys = Object.keys(d); console.log(keys.length, 'entries'); console.log('sales-ops p1 milestone:', d['sales-operations/priority-1'].milestone)"
```

Expected:
```
16 entries
sales-ops p1 milestone: 1
```

---

### Task 4: Install npm dependencies

- [ ] **Step 1: Install packages**

```bash
npm install gray-matter remark remark-html rehype-stringify unified recharts
```

Expected: Packages install successfully, `package.json` dependencies updated.

- [ ] **Step 2: Verify packages in package.json**

```bash
node -e "const p = require('./package.json'); ['gray-matter','remark','remark-html','rehype-stringify','unified','recharts'].forEach(d => console.log(d, p.dependencies[d] ? 'OK' : 'MISSING'))"
```

Expected: All 6 packages show `OK`.

- [ ] **Step 3: Verify build still works**

```bash
npm run build
```

Expected: Build succeeds with static export to `out/` directory.

---

### Task 5: Commit

- [ ] **Step 1: Stage and commit all changes**

```bash
git add artifacts/accounting/ artifacts/sales-operations/ artifacts/milestones.json artifacts/status.json package.json package-lock.json
git commit -m "Reorganize artifacts, add milestone configs, install parsing and chart dependencies"
```

Expected: Commit created successfully.
