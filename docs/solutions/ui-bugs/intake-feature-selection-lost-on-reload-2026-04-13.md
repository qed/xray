---
title: Intake feature selection lost on page reload
date: 2026-04-13
category: ui-bugs
module: intake
problem_type: ui_bug
component: frontend_stimulus
severity: medium
symptoms:
  - "User sees Welcome to Intake screen after reloading mid-interview"
  - "Must re-click X-Ray button to resume an hour-long interview"
root_cause: missing_state
resolution_type: code_fix
tags:
  - intake
  - localStorage
  - state-persistence
  - page-reload
  - ux
---

# Intake feature selection lost on page reload

## Problem

Users conducting a 1-hour X-Ray department interview lost their place on page reload. Despite the conversation being fully persisted in Supabase with working resume logic, they saw the "Welcome to Intake" landing screen and had to manually re-click the X-Ray feature button.

## Symptoms

- Reloading the intake page during an interview shows "Welcome to Intake" instead of the in-progress interview
- The selected department is correctly restored (it was already persisted in localStorage)
- After manually clicking "X-Ray", the conversation resumes correctly from Supabase

## What Didn't Work

- The conversation data and phase progress were already saved to Supabase — that wasn't the issue
- The `XRayInterview` component already had full resume logic — also not the issue
- The sidebar already persisted `selectedDeptId` in localStorage — partially working

## Solution

The gap was that `activeFeature` in `IntakePageClient.tsx` was initialized as `null` on every mount and never persisted. Added localStorage persistence:

```typescript
const featureKey = `intake_feature_${orgId}`;

// Restore on mount
useEffect(() => {
  const stored = localStorage.getItem(featureKey);
  if (stored === 'xray' || stored === 'missing' || stored === 'new-priorities') {
    setActiveFeature(stored);
  }
}, [featureKey]);

// Persist on change
const handleFeatureSelect = useCallback((feature: IntakeFeature) => {
  setActiveFeature(feature);
  localStorage.setItem(featureKey, feature);
}, [featureKey]);
```

All direct `setActiveFeature` calls (in props and callbacks) replaced with `handleFeatureSelect`.

## Why This Works

On reload, the restoration chain now works end-to-end:
1. localStorage restores `selectedDeptId` (already worked)
2. localStorage restores `activeFeature` to `'xray'` (new)
3. `XRayInterview` mounts with the department ID
4. `XRayInterview` loads the active conversation from Supabase (already worked)
5. Chat resumes where the user left off

## Prevention

- When a page has multi-step navigation state (sidebar selection + feature selection + conversation), ensure ALL selection layers are persisted — not just some
- Pattern: any `useState` that gates which major component renders should be backed by localStorage if the workflow is long-running
- The localStorage key should be scoped to the org/context to avoid cross-org leakage (`intake_feature_{orgId}`)

## Related Issues

- `src/app/org/[orgSlug]/intake/IntakePageClient.tsx` — the fix
- `src/app/org/[orgSlug]/intake/IntakeSidebar.tsx` — existing localStorage pattern for department selection
