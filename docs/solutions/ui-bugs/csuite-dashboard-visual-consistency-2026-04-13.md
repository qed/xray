---
title: CSuite dashboard visual consistency between company and department views
date: 2026-04-13
category: ui-bugs
module: csuite-dashboard
problem_type: ui_bug
component: frontend_stimulus
severity: medium
symptoms:
  - "Department dashboard 4th stat card showed HIGHEST IMPACT LEVEL instead of COMPLETED"
  - "Status Breakdown chart on left at department level vs right at company level"
  - "Status Breakdown chart title missing completion percentage"
root_cause: logic_error
resolution_type: code_fix
applies_when:
  - Building drill-down dashboards with parent/child hierarchy views
  - Rendering the same metric type at multiple navigation levels
  - Users navigate between summary and detail views in a single session
tags:
  - csuite
  - dashboard
  - vanilla-js
  - chart-layout
  - stat-cards
  - visual-consistency
---

# CSuite dashboard visual consistency between company and department views

## Problem

The CSuite CEO dashboard had inconsistent stat card metrics and chart positions between the company-level and department-level views, breaking users' spatial memory when drilling down.

## Symptoms

- Department dashboard showed "HIGHEST IMPACT LEVEL" (non-clickable text) as the 4th stat card; company dashboard showed "COMPLETED" (clickable count) in the same position
- Status Breakdown doughnut chart appeared on the right at company level but on the left at department level
- Chart title said only "Status Breakdown" without showing completion percentage

## Solution

### 1. Match stat card metrics across levels

In `renderDeptOverview()` and `renderDeptSummaryContent()`, replaced the 4th card:

```js
// Before — department showed a different metric
{ value: deptStats.topImpact, label: 'HIGHEST IMPACT LEVEL',
  subtitle: 'Across ' + deptStats.priorityCount + ' priorities' }

// After — department mirrors company's COMPLETED card
{ value: String(deptStats.completedCount), label: 'COMPLETED',
  subtitle: 'Of ' + deptStats.priorityCount + ' priorities',
  click: 'Completed', deptSlug: dept.slug }
```

### 2. Match chart order across levels

In `buildDeptChartConfigs()`, swapped the return order so Status Breakdown is on the right at both levels:

```js
// Before — status left, impact right (opposite of company)
return [statusChart, impactChart];

// After — impact left, status right (matches company)
return [impactChart, statusChart];
```

### 3. Add % completed to chart titles

```js
var pctComplete = totalPriorities > 0
    ? Math.round((completedCount / totalPriorities) * 100)
    : 0;
// title: 'Status Breakdown — ' + pctComplete + '% Completed'
```

Applied at both company level (`buildCompanyChartConfigs`) and department level (`buildDeptChartConfigs`).

## Why This Works

Users build spatial memory for dashboard layouts. When "completion count is the rightmost card" and "the status doughnut is on the right," that model should hold at every level. Breaking it forces re-scanning and erodes trust in the data. Embedding % completed in the chart title eliminates an extra cognitive step — users read the headline without counting doughnut segments.

## Prevention

- **Pattern rule**: When `buildDeptChartConfigs()` and `buildCompanyChartConfigs()` define the same chart type, they must return it in the same array position
- **Pattern rule**: When stat card arrays are defined in both `renderCompanyOverview()` and `renderDeptOverview()`, cards at the same index should show the same metric (scoped to company vs department)
- **Review check**: Any change to one level's stat cards or chart order should be mirrored at the other level

## Related

- `public/wevend/index.html` — WeVend dashboard (original data)
- `public/csuite/index.html` — Anonymized Acme Corp dashboard
- `docs/superpowers/plans/2026-03-27-xray-phase2-features.md` — Original dashboard layout plan
