# Step 2: TypeScript Types Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create the complete TypeScript type definitions for the X-Ray data model.

**Architecture:** Single file `src/lib/types.ts` with 10 exported interfaces that define the contract between parser, aggregator, and UI layers.

**Tech Stack:** TypeScript

---

### Task 1: Create types.ts with all interfaces

**Files:**
- Create: `src/lib/types.ts`

- [ ] **Step 1: Create `src/lib/types.ts`**

```typescript
export interface DepartmentProfile {
  slug: string;                    // e.g. "accounting", "sales-operations"
  name: string;                    // e.g. "Accounting"
  mission: string;
  scope: string;
  teamMembers: TeamMember[];
  tools: string[];
  singlePointsOfFailure: string[];
  painPoints: string[];
  tribalKnowledgeRisks: string[];
}

export interface TeamMember {
  name: string;
  title: string;
  responsibilities: string;
}

export interface AutomationPriority {
  departmentSlug: string;
  rank: number;
  name: string;
  effort: 'Low' | 'Medium' | 'High';
  complexity: 'Low' | 'Medium' | 'Medium-High' | 'High';
  impact: 'Low' | 'Medium' | 'High' | 'Very High' | 'Critical';
  whatToAutomate: string;
  currentState: string;
  whyItMatters: string;
  estimatedTimeSavings: string;
  dependencies: string[];
  suggestedApproach: string;
  successCriteria: string;
  status: string;                  // "Not started", "In Progress", etc.
}

export interface MilestoneConfig {
  id: number;
  name: string;
  definition: string;
}

export interface MilestoneStatus {
  milestone: number;
  updated: string;
  notes: string;
}

export interface Department {
  profile: DepartmentProfile;
  priorities: AutomationPriority[];
  quickWins?: string[];
  thirtyDayTargets?: string[];
  ninetyDayTargets?: string[];
  scalingRisks?: ScalingRisk[];
}

export interface ScalingRisk {
  area: string;
  risk: string;
  mitigation: string;
}

export interface CompanyOverview {
  totalOpportunities: number;
  byMilestoneStage: Record<number, number>;
  totalCompleted: number;
  departments: DepartmentSummary[];
  topWins: RankedOpportunity[];
}

export interface DepartmentSummary {
  slug: string;
  name: string;
  totalPriorities: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  progressPercent: number;
}

export interface RankedOpportunity {
  departmentSlug: string;
  departmentName: string;
  rank: number;
  name: string;
  impact: string;
  complexity: string;
  effort: string;
  estimatedTimeSavings: string;
  milestoneStage: number;
  milestoneName: string;
  score: number;                   // computed impact/effort ratio for ranking
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit src/lib/types.ts`
Expected: No errors (exit code 0).

- [ ] **Step 3: Verify build still works**

Run: `npm run build`
Expected: Build succeeds with static export.

- [ ] **Step 4: Commit**

```bash
git add src/lib/types.ts docs/superpowers/specs/2026-03-26-step2-typescript-types-design.md docs/superpowers/plans/2026-03-26-step2-typescript-types.md
git commit -m "Add TypeScript type definitions for X-Ray data model"
```
