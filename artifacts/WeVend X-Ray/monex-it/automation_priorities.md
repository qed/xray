# Monex IT — Automation & Agent Priorities
**Date:** March 26, 2026
**Source:** Department X-Ray interview with Jeffrey Zhu, IT Manager
**Review Cadence:** Weekly with Peter Kuperman

---

## Total Time Savings Summary

| Metric | Value |
|---|---|
| **Total current time spent on automatable tasks (weekly)** | ~24–30 hours/week |
| **Total realistic time savings (weekly)** | ~17–21 hours/week |
| **Total realistic time savings (monthly)** | ~68–84 hours/month |
| **Total realistic time savings (annually)** | ~884–1,092 hours/year |
| **Number of automation opportunities identified** | 5 |
| **Number of quick wins (< 1 week to implement)** | 1 |

*All figures confirmed with Jeffrey Zhu during Phase 8 time savings deep-dive.*

---

## Priority Summary

| Rank | Opportunity | Current Time (weekly) | Automation Savings % | Net Time Saved (weekly) | Complexity | Impact |
|---|---|---|---|---|---|---|
| 1 | AI Request Intake & Ad Hoc Report Automation | ~14–18 hrs | ~70% | **10–12 hrs** | Medium | High |
| 2 | AI Feature Request Intake & Scoping | ~4 hrs | ~75% | **3 hrs** | Low–Medium | High |
| 3 | Data Validation at Point of Entry | ~6–8 hrs | ~63–75% | **4–6 hrs** | Medium | High |
| 4 | Parse Failure Early Warning & Auto-Recovery | ~3–10 days/year | ~50–70% | **1.5–7 days/year** | Medium | Medium |
| 5 | AI-Assisted Tribal Knowledge Documentation | Ongoing | Reduces key-person risk | N/A (risk reduction) | Low | High |
| | **TOTAL** | **~24–30 hrs/week** | | **~17–21 hrs/week** | | |

---

## Detailed Opportunities

### Priority 1: AI Request Intake & Ad Hoc Report Automation

**What to automate/improve:**
Build an AI intake agent that sits between requesters and the IT team. When a data request comes in, the agent: (1) interprets what the requester actually needs, (2) identifies whether the request is answerable from Monex IT's resources, (3) asks clarifying questions if needed before routing to the team, and (4) handles standard/repeatable queries automatically (e.g., active MID/TID counts, customer transaction summaries) without any human involvement.

**Current state:**
~7 ad hoc data requests arrive per week via email or in-person. Jeffrey is the single intake point for all of them. He interprets each request, handles back-and-forth clarification (1–2 hours per request), then either executes the MySQL query himself or assigns it to a team member (~50/50 split). The data is formatted in Excel and sent via Outlook. The full pipeline is manual: MySQL → Excel → Outlook. Some requests span multiple systems and take days (e.g., SIM card bill verification took 4 days, half of which was meetings to work through exceptions).

**Why it matters:**
This is the single largest time consumer in the department — 14–18 hours per week across the team, or roughly 35–45% of total weekly capacity. It will scale directly with company growth: more terminals, more customers, more departments asking questions. Without automation, this becomes unmanageable. An AI intake layer also shifts the burden of clarification away from Jeffrey, removing the personal bottleneck he currently represents.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time per occurrence — data work (querying, formatting, sending) | ~2 hours |
| Time per occurrence — back-and-forth clarification | ~1–2 hours |
| Total time per occurrence | ~3–4 hours |
| Frequency | ~7 requests/week |
| Total current time per week (full team) | ~14–18 hours/week |
| Jeffrey's share | ~8–10 hours/week (clarification for all 7 + data work on ~3–4) |
| Team's share | ~6–8 hours/week (data work on ~3–4) |
| Hidden/downstream time costs | Meetings for complex exceptions (e.g., 2 days of meetings for the SIM card request); requesters waiting longer than necessary for answers |
| Realistic automation savings | ~70% — standard queries automated fully; complex multi-system investigations still need humans |
| **Net time saved per week** | **10–12 hours/week** |

*Confirmed with Jeffrey Zhu, March 26, 2026.*

**Complexity:** Medium. Requires: (1) cataloguing which query types are common and repeatable, (2) building a natural language → MySQL query layer for standard requests, (3) building an intake validation layer that catches infeasible requests (e.g., "terminal status" when Monex doesn't manage terminals), and (4) integrating with email/IM for request intake. The MySQL query library and exception taxonomy need to be built first.

**Dependencies:**
- MySQL access for the automated query layer
- A catalogued library of common request types and their SQL equivalents
- Documentation of what Monex IT *cannot* answer (e.g., terminal status) to train the intake filter
- Email or IM integration for request routing

**Suggested approach:**
1. Audit the last 3 months of ad hoc requests — categorize by type, frequency, and complexity
2. Build a query library for the top 10–15 repeatable request types
3. Build an intake agent (Claude-powered or similar) that: validates requests, identifies the correct query template, and executes automatically for standard requests; escalates complex or novel requests to Jeffrey with a pre-filled context summary
4. Add a "not in scope" filter to catch common misdirected requests (e.g., terminal status queries) and redirect with an explanation

**Success criteria:**
- Ad hoc request volume handled without human touch: ≥50% of weekly requests
- Jeffrey's personal time on ad hoc requests reduced from ~8–10 hrs/week to ≤2–3 hrs/week
- Average response time for standard requests: same day or faster
- Requester satisfaction maintained or improved

**WeVend/MonexGroup considerations:**
Applies to both, though 90% of requests are MonexGroup-related. The "not in scope" filter must be aware of which data lives where across both BUs.

---

### Priority 2: AI Feature Request Intake & Scoping

**What to automate/improve:**
Build a structured AI intake layer for feature enhancement requests. When a department (Admin, Operations, Sales) or customer submits a feature request, the intake agent: (1) asks structured questions to understand the underlying problem (not just the proposed solution), (2) checks whether the request is feasible within current system architecture, (3) drafts a scoped requirements summary for Jeffrey to review, and (4) routes the pre-scoped request to Jeffrey — who only needs to approve and assign rather than conduct a full discovery conversation.

**Current state:**
3–5 feature enhancement requests arrive per month, informally via email or conversation. Jeffrey spends 40% of total feature time (approximately 16 hours/month) just on back-and-forth clarification before any development begins. The core problem: requesters come with a specific solution in mind rather than a problem description, and don't understand the system's capabilities or constraints. Jeffrey must discover the real need, explain constraints, propose alternatives, and align — all before assigning the work to a developer.

**Why it matters:**
Clarification overhead is taking more time than the actual coding. As the team takes on more requests from more departments, this communication bottleneck will grow. An AI intake agent would standardize the intake process, ensure requirements are complete before reaching Jeffrey, and reduce the back-and-forth to a review-and-approve step rather than a full discovery conversation.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time per occurrence — clarification | Case by case; significant |
| Total clarification time per month | ~16 hours/month |
| Total clarification time per week | ~4 hours/week |
| Hidden/downstream time costs | Developer idle time waiting for requirements to be finalized; delayed deliveries |
| Realistic automation savings | ~75% — AI handles initial intake and scoping; Jeffrey still does final review and assignment |
| **Net time saved per week** | **~3 hours/week (~12 hours/month)** |

*Confirmed with Jeffrey Zhu, March 26, 2026.*

**Complexity:** Low–Medium. The intake questionnaire and validation logic can be built relatively quickly. The harder part is training the intake agent to understand Monex IT's system capabilities well enough to flag infeasible requests — this requires documenting what the CRM, lead system, and portal can and cannot do.

**Dependencies:**
- Documentation of CRM, lead management system, and portal capabilities and constraints
- Structured intake form or conversational agent integrated with the team's communication channel (email or IM)
- Jeffrey's time to review and approve the initial intake templates

**Suggested approach:**
1. Document the most common "root problems" behind past feature requests — build a taxonomy of request types
2. Build a structured intake form (or AI-driven intake conversation) that asks: "What problem are you trying to solve? What outcome do you need? Have you checked whether X already exists in the system?"
3. Add a feasibility filter that flags requests outside current system capabilities before they reach Jeffrey
4. Output a pre-filled requirements brief for Jeffrey to review — 10-minute review replaces 2-hour discovery session

**Success criteria:**
- Feature request clarification time reduced from ~16 hours/month to ≤4 hours/month
- Zero requests assigned to developers before requirements are confirmed
- Requesters report clearer expectations about what IT can and cannot deliver

**WeVend/MonexGroup considerations:**
CRM and lead system enhancements are primarily MonexGroup. Portal enhancements may have WeVend/MonexGroup crossover depending on the portal.

---

### Priority 3: Data Validation at Point of Entry

**What to automate/improve:**
Implement automated data validation rules at the point of entry (wherever internal teams are entering data that flows into Monex IT's systems) to catch missing fields, typos, and formatting errors before they reach the database. When an error is detected, the system rejects the entry and returns it to the originating team with a clear explanation — rather than allowing it to propagate to IT for cleanup.

**Current state:**
The team spends 6–8 hours per week on dirty data cleanup. The majority of dirty data originates from internal data entry errors (missing fields, typos, inconsistent formatting). IT absorbs this cleanup work despite it being a gray-area responsibility. The root cause is that no validation happens at the point of entry — errors are only discovered downstream when they cause issues in reports, billing, or CRM operations.

**Why it matters:**
Data quality issues are a compounding problem: they affect reports, billing accuracy, and customer operations. Fixing them downstream takes more time than preventing them upstream. As transaction volumes grow toward 10,000 terminals, the volume of dirty data will scale proportionally. This is the highest-leverage preventative automation — fixing the source rather than the symptom.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Current time per week on dirty data cleanup | 6–8 hours/week |
| Team members affected | All three (Jeffrey, Rojeen, MengKai) |
| Human review time preserved for edge cases | ~2 hours/week |
| Hidden/downstream time costs | Dirty data causes downstream issues in reports and billing that require additional investigation |
| Realistic automation savings | ~63–75% — validation catches most issues; ~2 hours/week preserved for genuine edge cases |
| **Net time saved per week** | **4–6 hours/week** |

*Confirmed with Jeffrey Zhu, March 26, 2026.*

**Complexity:** Medium. Requires: (1) auditing which fields are most commonly dirty and what the valid formats/ranges are, (2) implementing validation rules at the data entry points in the CRM and other input systems (Rojeen's domain), (3) building clear error messages that explain what's wrong and how to fix it, and (4) building a feedback loop so the originating team corrects the data at source.

**Dependencies:**
- Access to the CRM and other data entry systems (Rojeen's involvement required)
- Documentation of what "valid" data looks like for each key field
- Cooperation from Admin and Sales teams (who are the primary source of dirty data) to accept returned entries and correct them

**Suggested approach:**
1. Audit 2–3 months of dirty data cleanup — document which fields fail most often and what patterns of errors appear
2. Build validation rules for the top 10 most common error types
3. Implement validation in the CRM at point of entry (Rojeen to implement)
4. Build a notification system that returns invalid entries to the originating user with a specific explanation
5. Track dirty data volume over time to measure impact

**Success criteria:**
- Dirty data cleanup time reduced from 6–8 hours/week to ≤2 hours/week
- Reduction in downstream data quality issues in reports and billing
- Admin and Sales teams handling corrections at source rather than routing to IT

**WeVend/MonexGroup considerations:**
Primarily MonexGroup (90% of data volume). Data validation rules must account for both BUs if any fields differ between them.

---

### Priority 4: Parse Failure Early Warning & Auto-Recovery

**What to automate/improve:**
Build a monitoring system that detects when an external provider's file format has changed (before a full parse failure crashes the pipeline) and either: (a) alerts Jeffrey with a detailed diagnostic so he can fix it faster, or (b) attempts auto-recovery by applying known alternative parsing rules before escalating.

**Current state:**
When an external provider changes their file format, the Parse Service fails silently or with a generic error. Jeffrey must diagnose which provider changed what, understand the new format, and manually modify the parsing code. This happens 3–5 times per year and takes 1–2 days each time — entirely Jeffrey's time. Additionally, files arrive late approximately monthly, requiring Jeffrey to chase the provider.

**Why it matters:**
Parse failures block the entire downstream pipeline — no parsed data means no reports, no billing. Each incident is a 1–2 day disruption that lands entirely on Jeffrey. Better diagnostics alone could cut resolution time in half. Auto-detection of format changes before they cause failures would be even more valuable.

**Time Savings Breakdown:**

| Component | Value |
|---|---|
| Time per parse failure incident | 1–2 days (Jeffrey) |
| Frequency | 3–5 times/year |
| Total current time per year | ~3–10 days/year |
| Late file follow-up time | Several hours to days/month |
| Hidden/downstream time costs | Downstream pipeline blocked; billing may be delayed |
| Realistic automation savings | ~50–70% — auto-detection and diagnostics cut investigation time; some manual code fixes will always be needed for novel format changes |
| **Net time saved per year** | **~1.5–7 days/year on parse failures + hours/month on late file follow-up** |

**Complexity:** Medium. The monitoring layer can be built on top of the existing pipeline. Auto-recovery requires a library of known format variations — more valuable over time as the library grows.

**Dependencies:**
- Access to the existing 5-service pipeline to add monitoring hooks
- Historical parse failure logs to build the diagnostic patterns
- Jeffrey's time to document the format variations seen to date

**Suggested approach:**
1. Add pre-parse validation step that compares incoming file schema against expected schema and flags deviations before attempting to parse
2. Build an alerting system that sends Jeffrey a specific diagnosis: "FiServ US file has 3 new columns and the date format changed from MM/DD/YYYY to YYYY-MM-DD"
3. Build a late-file detection system that alerts Jeffrey proactively when a file hasn't arrived by its expected time — rather than discovering the gap downstream
4. Over time, build a format-variation library so the system can attempt auto-recovery for previously-seen format changes

**Success criteria:**
- Parse failure detection time: immediate alert vs. discovering failure after the fact
- Average resolution time for format-change failures reduced by ≥50%
- Late file alerts sent proactively before downstream pipeline is affected

**WeVend/MonexGroup considerations:**
Applies to all 7 providers. Wevend (as a provider) is part of this pipeline and subject to the same monitoring.

---

### Priority 5: AI-Assisted Tribal Knowledge Documentation

**What to automate/improve:**
Complete the systematic documentation of Monex IT's tribal knowledge — specifically the business logic embedded in the parsing, billing, and system architecture code — using AI to review code and generate plain-language documentation. This is already in progress; the goal is to complete it and establish it as a regular practice.

**Current state:**
Critical business logic (parsing rules per provider, billing calculation logic, exception handling, system architecture) lives primarily in Jeffrey's head and in code. The team has a knowledge-sharing culture and good cross-training, but documented references don't exist for most of this. Jeffrey has started using Claude to review code and generate documentation, but it is incomplete. If Jeffrey were unavailable, the team would need to reverse-engineer logic from code and logs.

**Why it matters:**
This is a key-person risk and a scaling risk. As the team grows, new members need documentation to onboard. As the system grows more complex, tribal knowledge becomes exponentially harder to reconstruct. Documentation also enables better automation — you can't automate a process you haven't fully mapped.

**Time Savings Breakdown:**
This priority is a risk-reduction investment, not a direct time saving. The payoff is: faster onboarding, faster incident resolution, and enabling the other automation priorities (especially Priority 4 — parse failure recovery requires documented format libraries).

**Complexity:** Low. Jeffrey has already started this using Claude. The work is well underway — the goal is to systematize it and finish it.

**Dependencies:**
- Jeffrey's time to review and validate AI-generated documentation
- Commitment to updating documentation when code changes

**Suggested approach:**
1. Prioritize documenting the parse logic for each of the 7 providers (most operationally critical)
2. Document the billing calculation logic and fee structure application rules
3. Document the 5-service pipeline architecture end-to-end
4. Store documentation alongside the code in SVN
5. Make documentation updates a required step whenever code is modified

**Success criteria:**
- Any team member can understand and debug the parsing pipeline without asking Jeffrey
- Billing exception investigation can be performed by Rojeen or MengKai without Jeffrey's involvement
- New team member onboarding time to productive contribution reduced

**WeVend/MonexGroup considerations:**
Documentation should explicitly note which logic applies to which business unit where relevant.

---

## Quick Wins (Can be done in < 1 week)

1. **Late file alert system (Priority 4, partial)** — A simple scheduled check that compares expected file arrivals against actual arrivals and emails Jeffrey if a file is overdue. Low technical complexity, immediate operational value — eliminates the monthly discovery-after-the-fact scenario.

---

## 30-Day Targets

1. **Begin AI Request Intake for ad hoc reports** — Start with an intake validation layer that catches the most common misdirected requests (e.g., terminal status queries) and routes them correctly before reaching Jeffrey. Even a simple email triage layer would recover hours immediately.
2. **Audit ad hoc request types** — Categorize the last 3 months of requests to identify the top 10 repeatable query types; this feeds both Priority 1 automation and Priority 2 intake.
3. **Implement late file detection** — Quick win from Priority 4; can be live within days.

---

## 90-Day Targets

1. **Priority 1 — Ad Hoc Report Automation (v1):** Automated handling of top 10 standard query types; AI intake for clarification; target: 50%+ of requests handled without human touch
2. **Priority 2 — Feature Request Intake Agent:** Structured intake form or agent live; all new feature requests go through it before reaching Jeffrey
3. **Priority 3 — Data Validation v1:** Top 10 validation rules implemented in CRM at point of entry; dirty data volume measurably reduced
4. **Priority 5 — Tribal Knowledge Documentation:** Parsing logic and billing calculation logic fully documented

---

## Scaling Risks to Address

| Risk | Current State | What Breaks at Scale | Recommended Action |
|---|---|---|---|
| Ad hoc request volume | 7 requests/week, 14–18 hrs/week (team) | At 10K terminals, customer/department count multiplies; request volume could easily reach 20–30+/week — becomes a full-time job | Priority 1: Automate standard queries; implement intake validation before scaling hits |
| Jeffrey as intake bottleneck | All requests flow through Jeffrey for clarification | One person cannot handle 3x the intake volume without dropping response quality | Priority 1 + 2: Remove Jeffrey from the intake loop for standard requests |
| Dirty data volume | 6–8 hrs/week at current scale | More transactions = more entry points = more dirty data; could scale to 15–20+ hrs/week | Priority 3: Prevent dirty data at source before volume grows |
| Back-and-forth on feature requests | 16 hrs/month clarification overhead | More departments making requests as company grows = more intake noise | Priority 2: Structured intake eliminates discovery overhead |
| Tribal knowledge concentration | Logic lives in Jeffrey's head and code | Team growth makes knowledge transfer harder; Jeffrey's availability becomes a constraint on incident resolution | Priority 5: Document now, before complexity increases further |

---

## Notes for Weekly Review

- **Biggest opportunity:** Priorities 1 and 2 both address the same root problem (unclear requests reaching Jeffrey). Solving intake — whether for ad hoc reports or feature requests — unlocks the most time and removes the key bottleneck.
- **Open question:** No ticketing or request tracking system currently exists. Implementing even a lightweight one (even just a shared inbox or form) would improve visibility into request volume and backlog.
- **Data dependency:** Priority 1 automation requires a query library. Before building the automation, audit 90 days of past requests to understand which are repeatable.
- **Quick start:** Late file detection (Priority 4 partial) can be shipped in under a week with minimal effort — recommend as first deliverable to build momentum.
- **Jeffrey's AI documentation work** is already producing value — ensure it's formalized and scheduled so it doesn't get deprioritized when urgent requests pile up.

---

*This priority list was generated from a Department X-Ray session on March 26, 2026. It should be reviewed weekly and updated as items are completed or priorities shift.*
