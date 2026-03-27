# Infrastructure & Compliance — Automation & Agent Priorities
**Date:** March 26, 2026
**Source:** Department X-Ray interview with Reza, Head of Infrastructure & Compliance
**Review Cadence:** Weekly with Peter Kuperman

---

## Total Time Savings Summary

| Metric | Value |
|---|---|
| **Total current time spent on automatable tasks (weekly)** | ~10.25 hours/week |
| **Total realistic time savings (weekly)** | ~6.0 hours/week |
| **Total realistic time savings (monthly)** | ~24 hours/month |
| **Total realistic time savings (annually)** | ~300 hours/year |
| **Number of automation opportunities identified** | 7 |
| **Number in progress (IaC)** | 1 |
| **Number of quick wins (< 1 week to implement)** | 2 |

---

## Priority Summary

| Rank | Opportunity | Current Time (weekly) | Automation Savings % | Net Time Saved (weekly) | Complexity | Impact |
|---|---|---|---|---|---|---|
| 1 | Alert Noise Reduction | 2.0 hrs | 50% | **1.0 hr** | Low | High |
| 2 | Dev Team Coordination | 2.0 hrs | 50% | **1.0 hr** | Low–Med | High |
| 3 | Incomplete Request Intake | 1.0 hr | 80% | **0.8 hr** | Low | High |
| 4 | DDQ & Compliance Responses | 2.0 hrs | 80% | **1.6 hrs** | Medium | High |
| 5 | Gray-Area Ownership Routing | 3.0 hrs | 50% | **1.5 hrs** | Medium | High |
| 6 | Manual Processes at Scale | In progress (IaC) | — | — | — | — |
| 7 | PCI Evidence Gathering | 0.25 hr (~12 hrs/yr) | 50% | **0.1 hr (~6 hrs/yr)** | Medium | Medium |
| | **TOTAL** | **10.25 hrs** | | **6.0 hrs** | | |

---

## Detailed Opportunities

### Priority 1: Alert Noise Reduction

**What to automate/improve:**
Implement intelligent alert filtering and classification for AWS SNS, EventBridge, and Nagios so that only genuine, actionable events surface to Reza. Suppress known-noise alerts, group correlated events, and establish severity-based routing rules that distinguish informational signals from incidents requiring human response.

**Current state:**
Reza continuously monitors alerts from cloud infrastructure, gateways, databases, and security tooling via dashboards, email, and SMS. Of the total monitoring time (~2 hours/week), only 1–5 alerts per week are genuinely actionable — the vast majority is noise that must be mentally filtered. This is a constant cognitive load operating in the background of every workday.

**Why it matters:**
Beyond the direct time cost, alert noise creates mental fatigue that degrades focus on higher-value work (gateway architecture, PCI, AI initiatives). At scale — 10,000 terminals generating proportionally more events — an unfiltered alert stream becomes unmanageable.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time per week (monitoring & triage) | 2.0 hours |
| Frequency | Continuous (daily) |
| Total current time per week | 2.0 hours |
| Hidden/downstream time costs | Likely cognitive fatigue affecting focus on strategic work — hard to quantify |
| Realistic automation savings | 50% — proper filtering won't eliminate all review, but eliminates the noise pass |
| **Net time saved per week** | **1.0 hour** |

**Complexity:** Low — AWS EventBridge and SNS support sophisticated filtering, suppression, and routing rules. Nagios supports alert thresholds, dependency mapping, and notification rules. This is configuration work, not custom development.

**Dependencies:** Requires a baseline audit of current alert rules to identify noise patterns. Initial tuning will take a few hours but pays off quickly.

**Suggested approach:**
1. Audit current SNS/EventBridge rules and Nagios alerts — identify the top 10 noise sources
2. Implement suppression rules for known-noise patterns (e.g., transient low-severity events that never require action)
3. Group correlated alerts (e.g., 5 alerts from the same service degradation → 1 grouped notification)
4. Implement severity-based routing: Critical → SMS + email; Warning → email only; Informational → dashboard only (no notification)
5. Review and tune monthly until signal-to-noise ratio is satisfactory

**Success criteria:** Actionable alerts as a percentage of total alerts increases significantly; Reza's monitoring time drops to under 1 hour/week.

**WeVend/MonexGroup considerations:** Two separate monitoring stacks (AWS SNS/EventBridge for WeVend cloud; Nagios for MonexGroup on-prem). Both need to be addressed independently.

---

### Priority 2: Dev Team Coordination Friction

**What to automate/improve:**
Establish a more structured coordination mechanism between Infrastructure & Compliance and the Development team to reduce the back-and-forth required to schedule, align, and validate infrastructure changes. This could be a lightweight async workflow, a standing sync format, or a shared scheduling tool.

**Current state:**
Coordination with the WeVend development team — scheduling work, aligning on timing, validating changes — consumes ~2 hours/week. The dev team is consistently busy and hard to pin down, making scheduling and validation slow. This delays infrastructure work that depends on developer availability and creates friction in the Jira → implementation pipeline.

**Why it matters:**
Development is the most frequent collaboration partner for Infrastructure & Compliance. Friction here cascades into delayed gateway changes, deferred maintenance, and after-hours scheduling. As Wevend scales, this dependency will become more frequent, not less.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time per week (coordination, chasing, alignment) | 2.0 hours |
| Frequency | Several interactions per week |
| Total current time per week | 2.0 hours |
| Hidden/downstream time costs | Deferred changes, after-hours scheduling, delayed incident follow-ups when dev availability is needed |
| Realistic automation savings | 50% — structured coordination reduces friction; genuine technical collaboration still needs human time |
| **Net time saved per week** | **1.0 hour** |

**Complexity:** Low–Medium — primarily a process and tooling change, not deep technical development.

**Dependencies:** Buy-in from Engineering/DevOps leads to adopt a shared coordination format.

**Suggested approach:**
1. Define a standard weekly async update slot — e.g., Infrastructure & Compliance publishes a list of pending items that need dev input/scheduling each Monday
2. Use Jira to formalize scheduling commitments — changes requiring dev involvement get a "needs scheduling" label and a target week
3. Establish a shared SLA: Infrastructure & Compliance requests get a dev response within 24 hours on priority items
4. If async isn't sufficient, add a short weekly 15-minute infrastructure-dev sync to align on the week's queue

**Success criteria:** Average time from change request to scheduled execution decreases; coordination back-and-forth drops to under 1 hour/week.

**WeVend/MonexGroup considerations:** Primarily applies to WeVend development (Reza's 85% WeVend focus); MonexGroup coordination is lower frequency.

---

### Priority 3: Incomplete Request Intake Standards

**What to automate/improve:**
Enforce a structured intake template for Jira tickets and ad-hoc requests coming into Infrastructure & Compliance. The template should require minimum required fields — scope, environment(s), business context, urgency, and risk assessment — before a request is accepted. Requests missing required fields should be bounced back automatically or at triage.

**Current state:**
Approximately 1 hour/week is spent on clarification loops — back-and-forth to get the information needed before work can start. Requests frequently arrive without clear scope (which environments, systems, or data are involved), business context, urgency, or deadlines. There's also a common assumption that a request is "just a small change" when it has production, security, or compliance implications. Every incomplete request triggers a clarification round before the clock on actual work starts.

**Why it matters:**
This is the highest-ROI process fix on the list — 80% savings on a 1-hour/week problem through a simple template enforcement. It also reduces error risk, since changes executed without proper context are more likely to have unintended consequences.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time per week (clarification loops, re-framing, de-risking) | 1.0 hour |
| Frequency | Several times per week across Jira and ad-hoc requests |
| Total current time per week | 1.0 hour |
| Hidden/downstream time costs | Delays to actual change execution; increased risk of changes being executed with incomplete context |
| Realistic automation savings | 80% — a well-enforced template eliminates most clarification rounds |
| **Net time saved per week** | **0.8 hours (~48 minutes)** |

**Complexity:** Low — this is a Jira configuration and process change, not a technical build.

**Dependencies:** Engineering and other requestors need to adopt the template. Brief communication campaign needed.

**Suggested approach:**
1. Define the required fields for an Infrastructure & Compliance Jira request: scope, environment(s) affected, business context, urgency (standard/urgent/critical), risk assessment (low/medium/high), and requestor's proposed timeline
2. Configure Jira to enforce required fields on ticket submission for the relevant project/issue type
3. Create a simple "request guide" for ad-hoc requests (Teams/email) with the same structure
4. Set a triage policy: tickets missing required fields are returned with a comment and not actioned until complete

**Success criteria:** Fewer than 1 clarification loop per week; average time from ticket submission to work start decreases.

**WeVend/MonexGroup considerations:** Primarily Jira (WeVend development interface); ad-hoc request standards apply across both BUs.

---

### Priority 4: DDQ & Compliance Response Library

**What to automate/improve:**
Build and maintain a reusable library of pre-approved responses to common security questionnaires, DDQs, and compliance evidence requests. An AI agent could then draft responses by pulling from this library, with Reza reviewing and approving before sending. Over time, the library grows and the draft quality improves.

**Current state:**
Sales, Product, Operations, Legal, and Finance regularly bring in customer due-diligence questionnaires, vendor risk assessments, and compliance evidence requests. Reza reviews, drafts, and validates responses — acting as the central translator and authority. This consumes ~1 hour/week typically and up to 4 hours/week during active sales or onboarding cycles. The same questions come up repeatedly; responses are drafted from scratch each time. As Wevend targets 2–4 client launches per month, this will become a meaningful weekly burden.

**Why it matters:**
This problem scales directly with revenue growth — every new client onboarding triggers a DDQ cycle. Without automation, this becomes a bottleneck to deal velocity. A response library also improves accuracy and consistency, reducing the risk of contradictory answers across different deals.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time per week — typical | 1.0 hour |
| Time per week — busy/active sales cycle | 4.0 hours |
| Working average (weighted) | ~2.0 hours/week |
| Frequency | Several requests/week during active periods |
| Total current time per week (average) | 2.0 hours |
| Hidden/downstream time costs | Deal velocity impacted when DDQ responses are slow; Reza is a bottleneck on deal closure |
| Realistic automation savings | 80% — agent drafts from library; Reza reviews and approves final output |
| **Net time saved per week** | **1.6 hours (average); up to 3.2 hours during busy periods** |

**Complexity:** Medium — requires building and maintaining a response library, plus either an AI-assisted drafting workflow or a template-matching system.

**Dependencies:** Initial effort to build the library from existing AOCs, policies, and past DDQ responses. Ongoing maintenance as policies and controls evolve.

**Suggested approach:**
1. Collect and organize existing DDQ responses, AOCs, pen-test summaries, and policy excerpts into a structured library (e.g., organized by control domain: access control, encryption, incident response, PCI scope, etc.)
2. Build a simple AI-assisted drafting workflow: incoming DDQ → map questions to library responses → generate draft → Reza reviews and approves
3. Track which questions are new or not covered by existing library content — these become the ongoing library expansion backlog
4. Version-control the library to ensure responses reflect current controls

**Success criteria:** Average DDQ response time decreases; Reza's time on this drops below 30 minutes/week on non-busy weeks.

**WeVend/MonexGroup considerations:** Separate AOCs and some policy differences between WeVend and WeVend US; library should tag responses by applicable entity.

---

### Priority 5: Gray-Area Ownership Routing Framework

**What to automate/improve:**
Define and implement a lightweight ownership routing framework that determines who owns a request when it spans multiple departments or has unclear accountability. Reduce the volume of gray-area items that default to Infrastructure & Compliance simply because they touch technology or compliance.

**Current state:**
Approximately 3 hours/week is absorbed by gray-area responsibilities — vendor/AI tool risk assessments, security ownership for new integrations, risk decisions with no clear owner, and cross-functional tasks spanning Development, Infrastructure, and Compliance. These items sit unresolved until urgent, then land on Reza by default.

**Why it matters:**
Gray-area absorption is a hidden tax on Reza's capacity. It also creates inconsistency — some gray-area items get thorough attention; others get rushed responses because they arrived as emergencies. A routing framework makes ownership predictable and prevents the default escalation to Infrastructure & Compliance for items that other departments could own.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time per week (gray-area intake, assessment, triage, resolution) | 3.0 hours |
| Frequency | Several times per week across different request types |
| Total current time per week | 3.0 hours |
| Hidden/downstream time costs | Delayed resolution of genuinely cross-functional items; Reza context-switching away from strategic work |
| Realistic automation savings | 50% — routing framework redirects items that don't belong to Reza; judgment calls that genuinely require him still remain |
| **Net time saved per week** | **1.5 hours** |

**Complexity:** Medium — primarily a governance and process design effort, with lightweight tooling support.

**Dependencies:** Leadership buy-in to define and enforce ownership boundaries across departments. Requires a decision from the relevant department leads about who owns what.

**Suggested approach:**
1. Map the top 5 recurring gray-area request types (AI tool risk assessments, new integration security reviews, DDQs, cross-functional change coordination, risk decisions)
2. For each: define the primary owner, the Infrastructure & Compliance role (input provider vs. decision maker vs. not involved), and the escalation path
3. Publish a simple "who owns what" reference document for department leads
4. Implement a triage question on incoming requests: "Does this require Infrastructure & Compliance to own the outcome, or just provide input?"
5. Review and refine quarterly

**Success criteria:** Gray-area items reaching Reza drop by 50%; items that do reach him arrive with a defined scope and a named requestor taking accountability for the outcome.

**WeVend/MonexGroup considerations:** Applies to both business units; some gray areas may differ between them (e.g., MonexGroup-specific vendor relationships).

---

### Priority 6: Manual Processes at Scale (Infrastructure as Code)

**What to automate/improve:**
Automate terminal provisioning, configuration management, and infrastructure change deployment through Infrastructure-as-Code (IaC) to support scaling from 1,500 to 10,000 terminals without proportional manual effort.

**Current state:**
**This initiative is already in progress.** Reza has implemented IaC and it has largely addressed the provisioning and configuration layer. This item is noted here for completeness and to track remaining gaps.

**Why it matters:**
Manual terminal-by-terminal processes would not scale to 10,000 terminals. IaC removes the linear relationship between terminal growth and operational effort, and reduces the risk of configuration drift and human error at scale.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time per week (before IaC) | ~2.0 hours |
| Current state | Largely resolved by IaC in progress |
| Remaining manual work | Low residual; ongoing monitoring for edge cases |
| Realistic automation savings (remaining) | To be determined as IaC matures |
| **Net time saved per week** | **In progress — to be confirmed post-IaC completion** |

**Complexity:** Already underway; remaining complexity is in completing and stabilizing the IaC pipeline.

**Dependencies:** Completion and stabilization of current IaC work; integration with monitoring and alerting.

**Success criteria:** Infrastructure changes can be deployed consistently and repeatably at scale without proportional manual effort; configuration drift is eliminated.

**WeVend/MonexGroup considerations:** Applies to both business units; implementation may differ by environment.

---

### Priority 7: PCI Evidence Gathering Coordination

**What to automate/improve:**
Automate the tracking, collection, and packaging of PCI compliance evidence throughout the year so that the annual assessment phase requires coordination effort rather than a chaotic evidence-gathering sprint. An agent could track what evidence is needed per control, send scheduled reminders to the appropriate owners, collect submissions, flag gaps, and maintain an always-current evidence repository.

**Current state:**
PCI recertification runs year-round and requires coordinating 8–12 people across Engineering, DevOps, Product, Finance, Leadership, and external parties. The most time-consuming phase is evidence gathering and reconciliation — proving that controls were consistently followed throughout the year. The coordination portion represents ~20% of the total 40–80 annual PCI hours (i.e., ~8–16 hours/year, or ~12 hours on average).

**Why it matters:**
Evidence gaps discovered late in the cycle are high-stakes — they can delay the AOC or require emergency remediation. Continuous, automated evidence collection converts an annual sprint into an always-current repository. Also applies to both WeVend and WeVend US, doubling the coordination burden.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time on evidence coordination (annual) | ~12 hours/year (~0.25 hrs/week) |
| Frequency | Year-round (ongoing) with annual spike |
| Total current time per week (averaged) | ~0.25 hours |
| Hidden/downstream time costs | Evidence gaps cause emergency coordination sprints and potential AOC delays |
| Realistic automation savings | 50% (conservative — compliance-sensitive material still requires human review) |
| **Net time saved per week** | **~0.1 hrs/week (~6 hours/year)** |

**Complexity:** Medium — requires integrating with existing documentation sources and building a lightweight evidence tracking workflow. Sensitive compliance context requires careful design.

**Dependencies:** Defined evidence requirements per PCI control mapped to responsible owners; structured storage location for evidence artifacts.

**Suggested approach:**
1. Build a PCI evidence tracker: list of required evidence items per DSS requirement, mapped to owner, due date, and current status
2. Automate reminder emails to evidence owners at defined intervals (e.g., 90 days, 60 days, 30 days before assessment)
3. Centralize evidence submissions into a structured repository (e.g., SharePoint folder with standardized naming)
4. Generate a real-time gap report: which controls have current evidence vs. which are outstanding
5. At assessment time, the repository is already populated — coordination effort is follow-up only

**Success criteria:** Evidence repository is >80% complete before the active assessment phase begins; emergency evidence chasing is eliminated.

**WeVend/MonexGroup considerations:** Two separate entities (WeVend and WeVend US) each require their own AOC and evidence set — the tracker should handle both in parallel.

---

## Quick Wins (Can be done in < 1 week)

1. **Incomplete Request Intake Template (Priority 3)** — configure required fields in Jira and draft a simple ad-hoc request guide. Zero custom development; immediate reduction in clarification loops.
2. **Alert Noise Reduction — Phase 1 (Priority 1)** — audit current alert rules and implement top-10 noise suppression rules in AWS EventBridge/SNS. Configuration-only; can be done in a focused afternoon.

---

## 30-Day Targets

1. **Alert Noise Reduction** — implement initial filtering and suppression rules; target 50% reduction in non-actionable alerts reaching Reza

---

## 90-Day Targets

1. **Alert Noise Reduction** — complete tuning; monitoring time below 1 hour/week
2. **Dev Team Coordination Framework** — async update format and Jira scheduling labels in place; coordination back-and-forth below 1 hour/week
3. **Incomplete Request Intake Standards** — Jira template enforced; ad-hoc request guide published; clarification loops below 1/week

---

## Scaling Risks to Address

| Risk | Current State | What Breaks at Scale | Recommended Action |
|---|---|---|---|
| Core systems architectural redesign | Both Dev and Infra & Compliance need to do this work; both already at capacity | Without redesign, adding terminals increases operational fragility | Carve out dedicated capacity for redesign work; treat as non-deferrable |
| DDQ/compliance support load | ~2 hrs/week average; up to 4 hrs/week during active sales | At 2–4 client launches/month, this becomes 4–8 hrs/week minimum | Build DDQ response library and AI-assisted drafting now, before the volume hits |
| Understaffing | Two-person department managing infrastructure, compliance, networking, IT support, PCI, AI governance | Workload will exceed capacity before 10,000 terminals without automation | Prioritize automation of low-leverage work; evaluate headcount needs at next planning cycle |
| PCI scope expansion | PCI obligations grow with terminal count and new integrations | Evidence gathering and control coverage become increasingly complex | Implement continuous evidence collection (Priority 7) before next assessment cycle |
| Alert volume growth | 1,500 terminals generating manageable alert volume today | At 10,000 terminals, unfiltered alert streams become unmanageable | Alert noise reduction (Priority 1) must be solved before scale, not after |

---

## Notes for Weekly Review

- **IaC status:** In progress and largely delivering — confirm completion milestone and any remaining manual gaps
- **Staffing risk:** If Ronit's role grows with MonexGroup (currently 70% MonexGroup), his capacity may be a constraint as MonexGroup scales
- **AI governance scope:** Infrastructure & Compliance has absorbed AI governance without a formal mandate — worth formalizing ownership before AI tool adoption accelerates
- **VMware vCenter and server hardware refresh:** Both on the wish list with budget implications; should be raised in resource planning
- **Two-entity PCI burden:** WeVend and WeVend US each require separate AOCs and evidence sets — this is a structural cost that should be factored into any compliance tooling investment

---

*This priority list was generated from a Department X-Ray session on March 26, 2026. It should be reviewed weekly and updated as items are completed or priorities shift.*
