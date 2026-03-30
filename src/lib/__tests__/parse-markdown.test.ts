import { describe, it, expect } from 'vitest';
import { parseProfile, parsePriorities } from '../parse-markdown';
import type { ParsedProfile, ParsedPriority } from '../parse-markdown';

/* ------------------------------------------------------------------ */
/*  Fixtures — each mirrors a real department format                   */
/* ------------------------------------------------------------------ */

const ACCOUNTING_PRIORITIES = `# Accounting Department — Automation & Agent Priorities
**Date:** March 25, 2026

---

## Priority Summary

| Rank | Opportunity | Est. Effort | Complexity | Impact |
|---|---|---|---|---|
| 1 | Sales Orders & Invoicing | Low | Low | High |
| 2 | Corporate Credit Cards | Low | Low | High |

---

## Detailed Opportunities

---

### Priority 1: Sales Orders & Invoicing — System-Generated POs

**What to automate/improve:**
Build on the existing standard PO Excel template to move toward system-generated sales POs.

**Current state:**
Accounting has built a standard PO template in Excel with dropdown lists for sales orders.

**Why it matters:**
Even with the existing Excel PO template in place, Accounting must still set up the same customer twice.

**Estimated time savings:**
Not quantified — but impacts every deal processed.

**Complexity:** Low — primarily a process and template design fix.

**Impact:** High

**Dependencies:**
- Sales Directors to mandate rep review
- IT to complete the system-generated PO solution

**Suggested approach:**
The standard Excel PO template with dropdowns is already in place.

**Success criteria:**
No duplicate customer setups required. PO data flows directly into QBO.

**Status:** Not started

---

### Priority 2: Corporate Credit Cards

**What to automate/improve:**
Issue corporate credit cards to replace John G.'s personal VISA cards.

**Current state:**
The whole company is currently spending on John G.'s personal VISA cards.

**Why it matters:**
Transitioning to corporate cards removes a recurring monthly bottleneck.

**Estimated time savings:**
Eliminates time lost to follow-up each month-end. Estimated to shave 1\u20133 days off the reconciliation.

**Complexity:** Low

**Impact:** High

**Dependencies:**
- John G. to approve the transition

**Suggested approach:**
Standard corporate card issuance process.

**Success criteria:**
Accounting has direct daily visibility into all card spend.

**Status:** Not started
`;

const SALES_OPS_PRIORITIES = `# Sales Operations \u2014 Automation Priorities

---

## Priority 1 \u2014 Eliminate Duplicate Data Entry

**Status:** In Progress

**What to Automate:**
The same merchant data is currently keyed three to four times across systems.

**Why It Matters:**
This is the single largest fixed labor cost in the operation.

**Estimated Time Savings:**
~167 hours/month recovered

**Complexity:** Medium-High

**Dependencies:** Dev team availability; Fiserv Co-Pilot API access

---

## Priority 2 \u2014 Automate Partner Onboarding Steps

**Status:** Not started

**What to Automate:**
When a partner signs their agreement, five downstream steps are all done manually today.

**Why It Matters:**
Partner onboarding is the gateway to merchant onboarding.

**Estimated Time Savings:** 3-5 hours per new partner onboarded

**Complexity:** Medium

**Dependencies:** WeTrack and WeCenter APIs; Jotform API
`;

const OPERATIONS_PRIORITIES = `# Operations \u2014 Automation & Agent Priorities

---

## Priority Summary

| Rank | Opportunity | Who Saves Time | Weekly Time Saved | Monthly Time Saved | Complexity | Impact |
|---|---|---|---|---|---|---|
| 1 | Daily Operational Digest | Scott, Robin, Brian | ~12.5 hrs | ~50 hrs | Low\u2013Med | High |
| 2 | Deployment Form Validation | Laurie, Suzy, Ngan | ~5 hrs | ~20 hrs | Medium | High |
| 3 | RMA Master Sheet | Robin, Jack | ~5 hrs | ~20 hrs | Medium | High |

---

## Detailed Opportunities

### Priority 1: Daily Operational Digest

**What to automate/improve:**
An AI agent runs every morning and compiles a daily briefing for Scott.

**Current state:**
Scott has no real-time visibility into what is happening operationally.

**Why it matters:**
Without visibility, Scott cannot manage proactively.

**Verified time savings:**
~12.5 hours/week across Scott, Robin, and Brian.

**Complexity:** Low\u2013Medium

**Dependencies:**
- Zendesk API access
- MOTRS data access

**Suggested approach:**
Complete the Zendesk daily digest, then expand to deployment and RMA metrics.

**Success criteria:**
Scott receives a daily briefing with zero manual effort.

---

### Priority 2: Deployment Form Validation

**What to automate/improve:**
An automated validation layer that checks submitted deployment forms.

**Current state:**
Deployment forms are submitted with errors and missing fields regularly.

**Why it matters:**
Errors in deployment forms cascade downstream.

**Complexity:** Medium

**Dependencies:**
- Zendesk form customization
- Inventory system API

**Suggested approach:**
Build validation rules into the form submission pipeline.

**Success criteria:**
Deployment form errors drop by 80%.

---

### Priority 3: RMA Master Sheet Auto-Consolidation

**What to automate/improve:**
Consolidate RMA data from multiple sources into a single view.

**Current state:**
RMA data lives in several spreadsheets and systems.

**Why it matters:**
Manual consolidation is error-prone and slow.

**Complexity:** Medium

**Dependencies:**
- Access to all RMA source systems

**Suggested approach:**
Build an automated data pipeline from source systems.

**Success criteria:**
Single consolidated RMA view updated automatically.
`;

const INFRASTRUCTURE_PRIORITIES = `# Infrastructure & Compliance \u2014 Automation & Agent Priorities

---

## Priority Summary

| Rank | Opportunity | Current Time (weekly) | Automation Savings % | Net Time Saved (weekly) | Complexity | Impact |
|---|---|---|---|---|---|---|
| 1 | Alert Noise Reduction | 2.0 hrs | 50% | **1.0 hr** | Low | High |
| 2 | Dev Team Coordination | 2.0 hrs | 50% | **1.0 hr** | Low\u2013Med | High |
| 3 | Incomplete Request Intake | 1.0 hr | 80% | **0.8 hr** | Low | High |

---

## Detailed Opportunities

### Priority 1: Alert Noise Reduction

**What to automate/improve:**
Implement intelligent alert filtering and classification for AWS SNS.

**Current state:**
Reza continuously monitors alerts from cloud infrastructure.

**Why it matters:**
Alert noise creates mental fatigue that degrades focus on higher-value work.

**Complexity:** Low

**Dependencies:**
- Baseline audit of current alert rules

**Suggested approach:**
Audit current SNS/EventBridge rules and identify top noise sources.

**Success criteria:**
Actionable alerts as a percentage of total alerts increases significantly.

---

### Priority 2: Dev Team Coordination Friction

**What to automate/improve:**
Create a structured intake and tracking system for dev requests.

**Current state:**
Dev requests arrive via Slack, email, and verbal conversations.

**Why it matters:**
Without a tracking system, requests get lost or duplicated.

**Complexity:** Low\u2013Med

**Dependencies:**
- Agreement on intake form fields

**Suggested approach:**
Deploy a lightweight ticketing system for dev requests.

**Success criteria:**
All dev requests tracked with status visibility.

---

### Priority 3: Incomplete Request Intake

**What to automate/improve:**
Validate incoming infrastructure requests before they reach Reza.

**Current state:**
Many requests arrive incomplete, requiring back-and-forth.

**Why it matters:**
Incomplete requests waste time on clarification cycles.

**Complexity:** Low

**Dependencies:**
- Standard request template

**Suggested approach:**
Build a form with required fields and validation.

**Success criteria:**
Incomplete requests drop by 80%.
`;

const EST_TIME_SAVED_WEEKLY_PRIORITIES = `# Test Department

---

## Priority Summary

| Rank | Opportunity | Est. Time Saved (weekly) | Complexity | Impact |
|---|---|---|---|---|
| 1 | Task Alpha | 4 hrs | Low | High |
| 2 | Task Beta | 2.5 hrs | Medium | Medium |

---

### Priority 1: Task Alpha

**What to automate/improve:**
Automate task alpha.

**Current state:**
Currently manual.

**Why it matters:**
Saves time.

**Complexity:** Low

**Impact:** High

**Dependencies:**
- None

**Suggested approach:**
Just do it.

**Success criteria:**
Task is automated.

---

### Priority 2: Task Beta

**What to automate/improve:**
Automate task beta.

**Current state:**
Currently slow.

**Why it matters:**
Efficiency.

**Complexity:** Medium

**Impact:** Medium

**Dependencies:**
- Task Alpha

**Suggested approach:**
Build on alpha.

**Success criteria:**
Task beta automated.
`;

const PROFILE_TEXT = `# Accounting Department Profile

## Mission
Provide accurate and timely financial reporting and compliance for all entities.

## Scope
Full-cycle accounting for WeVend and MONEX entities including AP, AR, payroll, and reporting.

## Team

| Name | Title | Responsibilities |
|---|---|---|
| Nancy ShuPan | Accounting Coordinator | AP, AR, reconciliation |
| Alice Wu | Bookkeeper | Data entry, receipts |

## Tools & Software
- QuickBooks Online (QBO)
- QuickBooks Desktop (QBD)
- Excel

## Pain Points
- Duplicate data entry across systems
- Month-end bottleneck on credit card statements

## Single Points of Failure
- Nancy is the only person who understands the full reconciliation process
- QBO access is limited to Nancy

## Tribal Knowledge Risks
- Commission calculation logic is undocumented
- Entity separation rules known only to Nancy
`;

/* ------------------------------------------------------------------ */
/*  Tests — parsePriorities                                           */
/* ------------------------------------------------------------------ */

describe('parsePriorities', () => {
  describe('### Priority N: format (accounting/infrastructure/operations)', () => {
    it('parses priorities with ### headings correctly', () => {
      const result = parsePriorities(ACCOUNTING_PRIORITIES);
      expect(result).toHaveLength(2);
      expect(result[0].rank).toBe(1);
      expect(result[0].name).toBe('Sales Orders & Invoicing \u2014 System-Generated POs');
      expect(result[1].rank).toBe(2);
      expect(result[1].name).toBe('Corporate Credit Cards');
    });

    it('extracts all fields from ### format', () => {
      const result = parsePriorities(ACCOUNTING_PRIORITIES);
      const p = result[0];
      expect(p.whatToAutomate).toContain('Build on the existing standard PO Excel template');
      expect(p.currentState).toContain('Accounting has built a standard PO template');
      expect(p.whyItMatters).toContain('Even with the existing Excel PO template');
      expect(p.estimatedTimeSavings).toContain('Not quantified');
      expect(p.complexity).toBe('Low \u2014 primarily a process and template design fix.');
      expect(p.suggestedApproach).toContain('standard Excel PO template');
      expect(p.successCriteria).toContain('No duplicate customer setups');
      expect(p.dependencies).toEqual([
        'Sales Directors to mandate rep review',
        'IT to complete the system-generated PO solution',
      ]);
      expect(p.status).toBe('Not started');
    });
  });

  describe('## Priority N \u2014 format (sales-ops)', () => {
    it('parses priorities with ## headings and em-dash separator', () => {
      const result = parsePriorities(SALES_OPS_PRIORITIES);
      expect(result).toHaveLength(2);
      expect(result[0].rank).toBe(1);
      expect(result[0].name).toBe('Eliminate Duplicate Data Entry');
      expect(result[1].rank).toBe(2);
      expect(result[1].name).toBe('Automate Partner Onboarding Steps');
    });

    it('extracts inline bold fields from ## format', () => {
      const result = parsePriorities(SALES_OPS_PRIORITIES);
      const p = result[0];
      expect(p.whatToAutomate).toContain('merchant data is currently keyed');
      expect(p.whyItMatters).toContain('single largest fixed labor cost');
      expect(p.estimatedTimeSavings).toBe('~167 hours/month recovered');
      expect(p.complexity).toBe('Medium-High');
      expect(p.status).toBe('In Progress');
    });
  });

  describe('summary table time savings extraction', () => {
    it('extracts time savings from "Weekly Time Saved" column and appends /week', () => {
      const result = parsePriorities(OPERATIONS_PRIORITIES);
      expect(result).toHaveLength(3);
      // Summary table value should be preferred and get /week appended
      expect(result[0].estimatedTimeSavings).toBe('~12.5 hrs/week');
      expect(result[1].estimatedTimeSavings).toBe('~5 hrs/week');
      expect(result[2].estimatedTimeSavings).toBe('~5 hrs/week');
    });

    it('extracts time savings from "Net Time Saved (weekly)" column and appends /week', () => {
      const result = parsePriorities(INFRASTRUCTURE_PRIORITIES);
      expect(result).toHaveLength(3);
      // Bold markers should be stripped, /week appended
      expect(result[0].estimatedTimeSavings).toBe('1.0 hr/week');
      expect(result[1].estimatedTimeSavings).toBe('1.0 hr/week');
      expect(result[2].estimatedTimeSavings).toBe('0.8 hr/week');
    });

    it('extracts time savings from "Est. Time Saved (weekly)" column', () => {
      const result = parsePriorities(EST_TIME_SAVED_WEEKLY_PRIORITIES);
      expect(result).toHaveLength(2);
      expect(result[0].estimatedTimeSavings).toBe('4 hrs/week');
      expect(result[1].estimatedTimeSavings).toBe('2.5 hrs/week');
    });
  });

  describe('missing fields tracking', () => {
    it('reports missing fields correctly', () => {
      const result = parsePriorities(ACCOUNTING_PRIORITIES);
      // Priority 1 has all fields present
      const p1 = result[0];
      expect(p1.missingFields).toEqual([]);

      // Priority 2 also has all fields
      const p2 = result[1];
      expect(p2.missingFields).toEqual([]);
    });

    it('reports missing fields for incomplete priorities', () => {
      const sparse = `# Test

### Priority 1: Sparse Item

**What to automate/improve:**
Do the thing.

**Complexity:** Low
`;
      const result = parsePriorities(sparse);
      expect(result).toHaveLength(1);
      expect(result[0].missingFields).toContain('currentState');
      expect(result[0].missingFields).toContain('whyItMatters');
      expect(result[0].missingFields).toContain('estimatedTimeSavings');
      expect(result[0].missingFields).toContain('suggestedApproach');
      expect(result[0].missingFields).toContain('successCriteria');
      expect(result[0].missingFields).toContain('dependencies');
      // name and whatToAutomate and complexity are present
      expect(result[0].missingFields).not.toContain('name');
      expect(result[0].missingFields).not.toContain('whatToAutomate');
      expect(result[0].missingFields).not.toContain('complexity');
    });
  });

  describe('bold markdown stripping', () => {
    it('strips ** bold markers from field values', () => {
      const result = parsePriorities(INFRASTRUCTURE_PRIORITIES);
      // Summary table values had **1.0 hr** — bold should be stripped
      expect(result[0].estimatedTimeSavings).not.toContain('**');
    });
  });

  describe('edge cases', () => {
    it('handles empty input', () => {
      const result = parsePriorities('');
      expect(result).toEqual([]);
    });

    it('handles input with no priorities', () => {
      const result = parsePriorities('# Just a heading\n\nSome text.');
      expect(result).toEqual([]);
    });
  });
});

/* ------------------------------------------------------------------ */
/*  Tests — parseProfile                                              */
/* ------------------------------------------------------------------ */

describe('parseProfile', () => {
  it('extracts department name from heading', () => {
    const result = parseProfile(PROFILE_TEXT);
    expect(result.name).toBe('Accounting');
  });

  it('extracts mission', () => {
    const result = parseProfile(PROFILE_TEXT);
    expect(result.mission).toContain('accurate and timely financial reporting');
  });

  it('extracts scope', () => {
    const result = parseProfile(PROFILE_TEXT);
    expect(result.scope).toContain('Full-cycle accounting');
  });

  it('extracts team members from table', () => {
    const result = parseProfile(PROFILE_TEXT);
    expect(result.teamMembers).toHaveLength(2);
    expect(result.teamMembers[0]).toEqual({
      name: 'Nancy ShuPan',
      title: 'Accounting Coordinator',
      responsibilities: 'AP, AR, reconciliation',
    });
    expect(result.teamMembers[1]).toEqual({
      name: 'Alice Wu',
      title: 'Bookkeeper',
      responsibilities: 'Data entry, receipts',
    });
  });

  it('extracts tools from bullet list', () => {
    const result = parseProfile(PROFILE_TEXT);
    expect(result.tools).toEqual([
      'QuickBooks Online (QBO)',
      'QuickBooks Desktop (QBD)',
      'Excel',
    ]);
  });

  it('extracts pain points', () => {
    const result = parseProfile(PROFILE_TEXT);
    expect(result.painPoints).toHaveLength(2);
    expect(result.painPoints[0]).toContain('Duplicate data entry');
  });

  it('extracts single points of failure', () => {
    const result = parseProfile(PROFILE_TEXT);
    expect(result.singlePointsOfFailure).toHaveLength(2);
    expect(result.singlePointsOfFailure[0]).toContain('Nancy');
  });

  it('extracts tribal knowledge risks', () => {
    const result = parseProfile(PROFILE_TEXT);
    expect(result.tribalKnowledgeRisks).toHaveLength(2);
    expect(result.tribalKnowledgeRisks[0]).toContain('Commission calculation');
  });

  it('handles empty input', () => {
    const result = parseProfile('');
    expect(result.name).toBe('');
    expect(result.mission).toBe('');
    expect(result.teamMembers).toEqual([]);
    expect(result.tools).toEqual([]);
  });
});
