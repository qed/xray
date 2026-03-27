# Accounting Department — Automation & Agent Priorities
**Date:** March 25–26, 2026
**Source:** Department X-Ray interview with Nancy ShuPan, Accounting Coordinator
**Phase 8 Time Savings Deep-Dive:** March 26, 2026
**Review Cadence:** Weekly with Peter Kuperman

---

## Priority Summary

| Rank | Opportunity | Est. Time Saved (weekly) | Complexity | Impact |
|---|---|---|---|---|
| 1 | Sales Orders & Invoicing — System-Generated POs | ~2–3 hrs/week (hands-on keyboard time only — dual entry in QBO + Clover, no email back-and-forth involved) — QBO savings TBD pending IT solution | Low | High |
| 2 | Corporate Credit Cards & Bank / VISA Statement Access | 1–2 week prep drag eliminated/month + ~8–10 mins/week manual chasing | Low | High |
| 3 | Clover Payment Notification Auto-Forwarding | ~8–10 min/week (100% elimination) | Low | Medium |
| 4 | Invoice & Expense Approval Workflow | Variable — daily tracking burden for Kylie eliminated | Medium | High |
| 5 | Commission Management Platform — MONEX | Variable per pay period — multi-hour process reduced to review step | High | Very High |
| 6 | Phorge Deal Closing — Automation or Streamlining | ~5 hrs/week (Kylie) — highest quantified saving | High | High |
| 7 | Employee Expense Management Platform | Not scoped in Phase 8 | Medium | Medium |
| 8 | Commission Management Platform — WeVend | Blocked — pending WeVend database | High | High (future) |
| 9 | Entity Separation — Accounting Readiness Plan | Owner/accountant level — not scoped | Medium | Critical |

---

## Phase 8: Time Savings Summary

*The following data was captured during the Phase 8 Time Savings Deep-Dive on March 26, 2026.*

**Calculation basis:** 230 business days/year (52 weeks − 4 weeks vacation − ~2 weeks Canadian statutory holidays × 5 days)

| Priority | Volume / Frequency | Current Time Cost | Automation Savings % | Net Time Saved | Notes |
|---|---|---|---|---|---|
| 1 — Sales Orders / POs | ~480 invoices/year = ~2/day = ~10/week | ~12–20 min/deal (hands-on keyboard time only — dual entry QBO + Clover, no email back-and-forth) = ~2–3 hrs/week | TBD | TBD | QBO side: Nancy handles all steps; IT working on simultaneous customer + invoice import. Clover integration not in current IT scope. |
| 2 — VISA Statement Access | 2 VISA statements/month (CAD + USD) | Preparation drag: 1–2 weeks/statement of broken time. QBD reconciliation: 2 hrs/statement × 2 = 4 hrs/month | Preparation drag: largely eliminated. QBD rec: unchanged (stays 4 hrs/month) | 1–2 weeks of monthly prep drag collapsed into daily real-time checks | Transactions currently 5–6 weeks old before Accounting sees them. With RBC Express daily access, flagged within 1–2 business days. |
| 3 — Clover Auto-Forward | ~400/year = ~2/day = ~10/week | 1 min/forward = ~10 min/week | 100% | ~10 min/week | Simple Outlook rule or Power Automate flow. No development required. |
| 4 — Invoice Approval Workflow | ~750 bills/year = ~4/day = ~20/week | 2–3 email rounds per bill, each round up to 1–2 weeks. Kylie's daily morning tracking task — time not quantifiable | Manager response time: unchanged. Kylie's tracking/chasing burden: significantly reduced | Variable — daily overhead eliminated | Tool won't speed up managers. Benefit is Kylie's dashboard visibility replacing manual email tracking. |
| 5 — Commission Platform MONEX | Semi-monthly, 8–15 reps per run | Multi-hour process per pay period — varies each run, not quantifiable | Majority of calculation time — reduced to review-and-approve | Variable | Time per run depends on active reps and deals. Not quantifiable at this stage. |
| 6 — Phorge Deal Closing | 3–5 deals/day, multiple terminals each | ~1 hr/day = ~5 hrs/week (Kylie) — broken/interrupted time | Majority saveable with bulk or automated closure | ~4–5 hrs/week | Clearest, most quantifiable saving in the department. |
| 7 — Expense Platform | Not scoped | Not scoped | Not scoped | Not scoped | Skipped in Phase 8. |
| 8 — WeVend Commission | Low volume — distributors + pilot deals only | Manual QBO pull — low volume, manageable now | Blocked | Blocked | Dependent on WeVend database rollout. |
| 9 — Entity Separation | N/A | N/A | Owner/accountant level | N/A | Leadership and external accountant decision. |

**Highest quantified weekly saving: Priority 6 (Phorge Deal Closing) — ~5 hrs/week for Kylie.**
**Biggest monthly drag eliminated: Priority 2 (VISA Statement Access) — 1–2 weeks of preparation delay per statement collapsed into daily real-time visibility.**

---

## Detailed Opportunities

---

### Priority 1: Sales Orders & Invoicing — System-Generated POs

**What to automate/improve:**
Build on the existing standard PO Excel template (with dropdown lists) to move toward system-generated sales POs that are rep-reviewed and QBO-ready before reaching Accounting. Eliminate the duplicate customer setup currently required in both QBO and Clover. IT is already working on creating a standard PO generated from the system for reps, importable into QBO — the Clover integration is not in scope at this stage.

**Current state:**
Accounting has built a standard PO template in Excel with dropdown lists for sales orders. Sales reps send completed POs to Accounting by email. Accounting then sets up the customer in both QBO and Clover separately — creating duplicate entry work. IT is currently working on creating a system-generated standard PO for reps that can be imported directly into QBO. The Clover integration is not part of this current IT scope.

**Phase 8 — Time breakdown:**
- **Volume:** ~480 invoices/year = ~2 per day = ~10 per week (based on 230 working days)
- **QBO side:** Nancy handles all steps — customer import + double-check + invoice import + review. IT and Nancy are working on how to import new customer and invoice simultaneously. Time savings TBD until IT's solution is confirmed.
- **Clover side:** Log into correct company Clover account → select correct entity → set up customer + invoice. ~3–5 min hands-on per setup. Not in current IT scope.
- **Total current dual-entry time:** ~12–20 min per deal × 10 deals/week = ~2–3 hrs/week (hands-on keyboard time only — no email back-and-forth in this process)
- **Net time saved:** TBD — dependent on IT's QBO solution. Clover savings deferred to a future phase.

**Why it matters:**
Even with the existing Excel PO template in place, Accounting must still set up the same customer twice (QBO and Clover) for every deal — creating duplicate entry work. As deal volume grows, this multiplies directly and increases the risk of invoicing errors.

**Complexity:** Low — primarily a process and template design fix, with IT already engaged.

**Dependencies:**
- Sales Directors to mandate rep review of PO before submission to Accounting
- IT to complete the system-generated PO solution that outputs QBO-ready data
- One-time Clover and QBO setup consolidation review

**Suggested approach:**
The standard Excel PO template with dropdowns is already in place — built by Accounting. IT is currently working on the next step: a system-generated PO for reps that feeds directly into QBO. The Clover duplicate entry remains a separate, unresolved issue not currently in IT's scope — to be addressed in a future phase once the QBO integration is stable.

**Success criteria:**
No duplicate customer setups required. PO data flows directly into QBO with no re-entry. Time from deal close to invoice sent reduced.

**WeVend/MONEX considerations:** Applies to both entities. QBO is used for U.S. entities; QBD for Canadian — PO format may need entity-specific variants.

---

### Priority 2: Corporate Credit Cards & Bank / VISA Statement Access for Accounting

**What to automate/improve:**
Issue corporate credit cards to replace the current use of John G.'s personal VISA cards for company-wide spending, and grant Accounting direct daily visibility into all card spend via the appropriate platform — RBC Express for Canadian entities (CAD and interim USD), and CNB platform for U.S. entities (USD) once U.S. entities are fully separated and operating independently.

**Current state:**
The whole company is currently spending on John G.'s personal VISA cards. Accounting has no direct access to these statements — each month, Accounting must wait on John G. to provide them before credit card reconciliation can begin. Statements are also already behind by design: for example, a March 23rd statement is not received until approximately April 2nd, meaning February 20–28 transactions have had zero Accounting visibility until April 2nd — a 5–6 week blind spot. Missing receipts are frequently discovered at month-end, requiring retroactive follow-up.

**Phase 8 — Time breakdown:**
- **Statements:** 2 per month (CAD VISA + USD VISA)
- **Current statement delay:** At least 1 week wait for John G. to provide statements, on top of statements already being 1–2 weeks behind in coverage — transactions can be 5–6 weeks old before Accounting sees them
- **Preparation phase (sorting, comparing to records, identifying missing transactions, grouping by department, emailing managers, chasing responses, saving receipts, posting to QBD):** 1–2 weeks of broken/interrupted time per statement — variable every month, not quantifiable as a fixed hour count
- **QBD reconciliation:** 2 hrs per statement × 2 statements = **4 hrs/month** hands-on for Kylie. This step remains regardless of card access improvement.
- **With daily RBC Express access:** Transactions flagged within 1–2 business days of occurrence. Preparation drag largely eliminated — replaced by small ongoing daily checks throughout the month. The 4 hrs/month QBD reconciliation step is unchanged.
- **Net time saved:** 1–2 weeks of monthly preparation drag collapsed per statement. QBD rec time unchanged.

**Why it matters:**
Transitioning to corporate cards and granting Accounting direct statement access removes a recurring monthly bottleneck, eliminates personal liability exposure, and allows Accounting to flag missing receipts in real time rather than at month-end. Improves cash flow visibility and reduces the risk of unauthorized or miscoded transactions going unnoticed for weeks.

**Complexity:** Low — CAD and interim USD access via RBC Express (Canadian entities); USD access via CNB platform once U.S. entities are independent. No system build required.

**Dependencies:**
- John G. to approve the transition from personal VISA cards to corporate VISA accounts for company-wide spending
- RBC to issue corporate VISA accounts for Canadian entities (CAD and USD) — managed via RBC Express; the USD card under Canadian entities is needed in the interim until U.S. entities are fully separated and operating independently
- CNB to issue corporate VISA accounts for U.S. entities (USD) — managed via CNB platform; to be issued only once U.S. entities are fully separated and operating independently
- Accounting to be granted direct access to all corporate VISA accounts in RBC Express (CAD and interim USD) and CNB platform (USD once U.S. entities are independent)
- Policy enforcement for receipt submission (ideally tied to Priority 7 — expense platform)

**Suggested approach:**
Transition company-wide spending from John G.'s personal VISA cards to dedicated corporate VISA accounts. For Canadian entities: issue both CAD and USD corporate VISA accounts through RBC, accessible via RBC Express — the USD card under Canadian entities serves as the interim solution until U.S. entities are fully separated and operating independently. For U.S. entities: corporate VISA accounts issued through CNB, accessible via the CNB platform, once U.S. entities are fully separated. Grant Accounting (Nancy at minimum) direct read access to all accounts on both platforms. Pair with a receipt submission policy (or expense platform — see Priority 7) so receipts are attached at time of purchase.

**Success criteria:**
Corporate VISA accounts in place — no company spending on personal cards. Nancy can pull CAD VISA statements independently via RBC Express and USD VISA statements via CNB platform on the first day of month-end close. No dependency on John G. for statement access. Missing receipts identified within days of purchase, not weeks.

---

### Priority 3: Clover Payment Notification Auto-Forwarding

**What to automate/improve:**
Configure an Outlook automation rule to automatically forward Clover payment confirmation emails to the relevant sales rep and Sales Director as soon as the payment is received, without any manual intervention from Accounting.

**Current state:**
Every time a customer pays via a Clover payment link, a confirmation email arrives in Accounting's inbox. Nancy manually forwards this email to the applicable sales rep and director.

**Phase 8 — Time breakdown:**
- **Volume:** ~400 confirmations/year = ~2 per day = ~10 per week (based on 230 working days)
- **Time per forward:** ~1 minute (Nancy logs into email, forwards to correct rep and director)
- **Total current time:** ~10 min/week
- **Automation savings:** 100% — Outlook rule or Power Automate flow handles it with zero human touch
- **Net time saved:** ~10 min/week for Nancy. Small per instance, but a daily interruption eliminated entirely.
- **Note:** Volume will grow beyond pilot stage — savings will scale with deal volume.

**Why it matters:**
This is a repetitive, zero-value administrative task consuming Nancy's time daily. It is also a risk — if the email is not forwarded promptly, the sales rep may not know the payment was received, potentially affecting their follow-up actions.

**Complexity:** Low — Outlook rule or Power Automate flow. Configuration only, no development required.

**Dependencies:**
- IT to configure the Outlook rule or Power Automate flow
- Mapping of Clover notification email format to recipient logic (which rep/director receives which notification)

**Suggested approach:**
Create an Outlook rule or Microsoft Power Automate flow: when an email from Clover arrives in the Accounting inbox matching the payment confirmation format, automatically forward it to the designated sales rep and director. If rep assignment varies by deal, a simple lookup table or rule-based routing can be implemented.

**Success criteria:**
Zero manual email forwards by Accounting for Clover payment confirmations. Sales reps and directors receive notifications automatically within minutes of payment.

---

### Priority 4: Centralized Invoice & Expense Approval Workflow

**What to automate/improve:**
Replace the current email-based approval process for vendor invoices and expense claims with a centralized approval workflow that includes automated reminders, approval visibility, and an audit trail.

**Current state:**
Managers are required to approve all bills before they reach Accounting for payment. In practice, managers are too busy to do this consistently, resulting in multiple rounds of back-and-forth email before approval is obtained. Kylie manually tracks what is outstanding and sends reminders daily as part of her morning routine. There is no system to show who has approved what, when, or what is still outstanding.

**Phase 8 — Time breakdown:**
- **Volume:** ~750 bills/year = ~4/day = ~20/week (based on 230 working days)
- **Approval rounds per bill:** 2–3 email exchanges, each round taking up to 1–2 weeks
- **Total elapsed time per bill:** Potentially 2–6 weeks from submission to final approval and filing
- **Kylie's tracking time:** Daily morning task — checks outstanding approvals, sends reminders, saves files. Time not quantifiable as it varies daily.
- **Automation savings:** A centralized tool will NOT speed up manager response times — managers are busy regardless of the tool. The benefit is eliminating Kylie's manual tracking, reminder-drafting, and email-based chasing — replaced by a dashboard and automated reminder triggers.
- **Net time saved:** Variable — daily overhead and mental load for Kylie significantly reduced.

**Why it matters:**
Approval delays cascade into payment delays, which affect vendor relationships and can trigger late fees. The manual tracking creates overhead for Accounting and introduces risk of invoices being lost or forgotten. As deal volume and headcount grow, the number of approvals will increase proportionally.

**Complexity:** Medium — requires selecting and implementing an approval workflow tool, or configuring one within an existing platform (e.g., Microsoft Teams Approvals, or a lightweight tool like ApprovalMax integrated with QBO).

**Dependencies:**
- IT to evaluate and implement a tool
- Directors and managers to adopt the new workflow
- Accounting to define the approval routing rules (which invoice type goes to which approver)

**Suggested approach:**
Evaluate ApprovalMax (which integrates with both QBO and QBD) or Microsoft Teams Approvals as a lightweight option. Key requirements: approval by email or Teams, automated reminders after X days, audit trail showing approval date and approver, dashboard view for Accounting showing outstanding approvals.

**Success criteria:**
No approval is tracked by email. Accounting has real-time visibility into all outstanding approvals. Kylie's daily manual tracking and chasing eliminated. Audit trail available for each approval.

---

### Priority 5: Commission Management Platform — MONEX

**What to automate/improve:**
Build or configure a centralized commission management platform for MONEX that: links commission eligibility to MONEX deal numbers in Phorge, automates the deal closure trigger for commission purposes, tracks approval status, stores the paid commission history centrally, and reduces manual Excel calculation.

**Current state:**
Commission for 8–15 reps per pay period is calculated entirely in Excel. Kylie manually pulls the "Qualified for Commission" report from Phorge, cross-references each rep's individual Schedule A, applies the lease score factor formula manually (÷ 0.0323 or ÷ 0.0416), calculates per deal, compiles a file, gets Nancy's approval, and issues invoices. Non-standard commissions require a separate Director/manager approval chain via email before reaching Accounting. There is no central record of what has been paid to whom for which deals.

**Phase 8 — Time breakdown:**
- **Frequency:** Semi-monthly (per pay period)
- **Volume:** 8–15 reps per run depending on sales activity
- **Time per run:** Multi-hour process — varies each period based on active reps and deal count. Not quantifiable as a fixed number.
- **Automation savings:** Majority of calculation and file preparation time reduced to a review-and-approve step. Exact % not quantifiable at this stage.
- **Net time saved:** Variable — significant reduction expected but not measured until a platform is in place.

**Why it matters:**
This is the highest-effort, highest-risk manual process in the department. It is error-prone (manual formula application), time-consuming (8–15 reps, multiple deals each), and completely undocumented in any system. As MONEX scales, the volume of eligible deals and reps will grow significantly.

**Complexity:** High — requires either a Phorge configuration (IT involvement) or a standalone platform with Phorge data integration. Schedule A rates must be maintained in the system and updated as they change.

**Dependencies:**
- Sales Directors to own and maintain Schedule A rates in the system
- IT to build or configure the platform (Phorge extension or external tool)
- Operations to ensure Phorge deal data is complete and accurate before commission runs

**Suggested approach:**
Phase 1 (short-term): Standardize the Excel commission template with locked formulas for the lease score factor calculation and Schedule A lookup — reduce calculation errors even before a platform exists.
Phase 2 (medium-term): Build or configure a commission tracking module in Phorge (or a lightweight external tool) where: deals marked as closed in Phorge automatically feed an eligible commission list; Kylie or the system applies the correct Schedule A rate; Nancy reviews and approves; the paid list is stored against each deal record.

**Success criteria:**
Commission calculation time reduced by at least 50%. Zero manual formula errors on lease score factor. Full audit trail of what was paid, to whom, for which deal, on which date. Directors can view commission status without emailing Accounting.

---

### Priority 6: Phorge Deal Closing — Automation or Streamlining

**What to automate/improve:**
Reduce or eliminate the manual multi-step, multi-layer Phorge navigation required to close each deal and each terminal within each deal. Either automate the closure trigger based on funding confirmation, or significantly streamline the number of steps required.

**Current state:**
Kylie receives 3–5 deals per day from the Admin approval list. For each deal, she logs into Phorge, navigates through multiple layers to reach each terminal, manually enters lease numbers or confirms purchase prices, checks the "Deal Closed" box, enters the closure date, presses Update and Submit — and then repeats for every terminal in the deal and every processing fee. This is documented in a Word file that Accounting itself has labeled "should be improved."

**Phase 8 — Time breakdown:**
- **Volume:** 3–5 deals/day, multiple terminals per deal
- **Kylie's time:** ~1 hr/day of broken/interrupted time adding up across daily tasks
- **Weekly total:** ~5 hrs/week for Kylie
- **Automation savings:** Majority of this time saveable — with a bulk closure tool or automated trigger, this could be reduced to a quick review step of under 15 minutes/day
- **Net time saved:** ~4–5 hrs/week for Kylie — the single largest quantified time saving in the department
- **Hidden cost:** Error risk — wrong closure date or missed terminal has downstream impact on commission eligibility and reporting

**Why it matters:**
With 3–5 deals per day, each containing multiple terminals, this process consumes approximately 1 hour of Kylie's daily capacity. It is entirely manual, error-prone, and produces no value beyond updating a status field in Phorge. At 10,000 terminals scale, it becomes unworkable.

**Complexity:** High — requires IT access to Phorge to build a batch closure function or API-based trigger from RBC funding confirmation.

**Dependencies:**
- IT access to Phorge backend or API
- Operations/Admin to ensure funding confirmation data is structured and machine-readable
- Accounting to define the exact closure criteria (payment received + terminal shipped)

**Suggested approach:**
Ideal state: When funding is confirmed in RBC Express AND terminal shipment is confirmed in the operations system, Phorge automatically marks the deal and all associated terminals as closed with the correct date — no manual action from Accounting required.
Interim state: Build a bulk closure tool in Phorge that allows Kylie to upload the day's closure list (from the Admin spreadsheet) and close all deals in one action, rather than navigating deal by deal.

**Success criteria:**
Phorge deal closing time reduced from ~1 hr/day to under 15 minutes. Zero instances of a deal being missed or closed with the wrong date due to manual error.

---

### Priority 7: Employee Expense Management Platform

**What to automate/improve:**
Implement a unified employee expense submission and approval platform (e.g., Ramp or Expensify) that replaces the current email-based system and connects receipts to transactions automatically.

**Current state:**
Employees submit expense claims by email with inconsistent documentation. Receipts are frequently missing. Approvals are obtained manually via email. Kylie reconciles credit card statements at month-end and frequently discovers missing receipts or unapproved charges, requiring retroactive follow-up with employees.

**Why it matters:**
A unified platform enforces receipt submission at the time of purchase, routes approvals automatically, and links receipts to specific transactions. This eliminates month-end surprises and significantly reduces Kylie's reconciliation time.

**Complexity:** Medium — requires selecting a platform, configuring approval workflows, and onboarding employees. Ramp or Expensify both integrate with QBO and QBD.

**Dependencies:**
- Operations/IT to select and implement the platform
- Management to mandate employee adoption
- Accounting to configure GL coding rules and approval routing

**Suggested approach:**
Evaluate Ramp (preferred for card-native receipt capture) or Expensify. Key requirements: mobile receipt capture at time of purchase, approval routing by department/amount, direct feed to QBO or QBD, audit trail. Pair with Priority 2 (card visibility) for complete coverage.

**Success criteria:**
Zero missing receipts at month-end reconciliation. Expense approval cycle time reduced to under 48 hours. Credit card reconciliation time cut by at least 50%.

---

### Priority 8: Commission Management Platform — WeVend

**What to automate/improve:**
Once the WeVend new database is in place, build a commission tracking platform linked to WeVend deal records that allows both Sales and Accounting to generate commission lists automatically, with Sales Directors approving and maintaining Schedule A rates in the system.

**Current state:**
WeVend commissions are currently issued only for distributors and pilot deals. Accounting manually pulls a paid invoice list from QBO (by sales rep name and invoice number) and calculates hardware commission (3.75% or 5% of retail price depending on pricing tier) and processing commission (based on avg net revenue multiplier tiers) using the 2025 Sales Compensation Plan. No commission database, no tracking platform, no automation.

**Phase 8 note:** Blocked — no action until the WeVend platform/database is ready. When the database is live and commission-related, this priority will be revisited and scoped.

**Why it matters:**
This is currently low volume and manageable. However, as WeVend scales toward 10,000 terminals and more distributors are onboarded, the manual QBO-pull method will break. Building the right infrastructure now — linked to the new WeVend database — is far easier than retrofitting after volume grows.

**Complexity:** High — depends on the WeVend database being built first. Cannot be scoped until that system is defined.

**Dependencies:**
- WeVend new database to be designed and deployed (IT / leadership)
- WeVend deal records to include the data fields needed for commission calculation (rep assignment, deal value, terminal type, activation date)
- Sales Directors to maintain Schedule A in the platform

**Suggested approach:**
Design the WeVend commission module in parallel with the new database, not after the fact. Accounting requirements (rep-linked invoicing, Schedule A rate application, approval workflow, paid commission history) should be defined as database requirements before build begins.

**Success criteria:**
Commission invoices for WeVend reps generated automatically from deal records. Zero manual QBO invoice pulls for commission calculation. Audit trail of all commissions paid per deal per rep.

---

### Priority 9: Entity Separation — Accounting Readiness Plan

**What to automate/improve:**
Create a structured project plan for completing the Wevend / MONEX entity separation in QBD and QBO, with clear task ownership, timelines, and a parallel-run strategy that does not collapse daily operations.

**Current state:**
WeVend employees are currently **fully under the POS (MONEX Canadian) entity in QBD**. Payroll has NOT been migrated to a separate WeVend entity. The timeline for when this move will happen has not been set by leadership — it is a future obligation with no confirmed date. When the move is triggered, it will require: setting up all WeVend employees in a dedicated Wevend QBD entity, creating new GL accounts, adjusting the chart of accounts, and mirroring the setup in QBO for U.S. entities. This work will happen on top of ongoing daily operations with a 2-person Accounting team. No formal project plan exists.

**Phase 8 note:** This is an owner and accountant level decision. Accounting will defer to the external accountants and ownership for scoping and timeline. No time savings estimate applicable.

**Why it matters:**
Without a managed plan, the entity separation will be absorbed into Accounting's daily workload reactively — creating a very high risk of errors in the new setup, disruption to existing records, and team burnout.

**Complexity:** Medium — primarily planning and coordination work, not technical development. However, the GL account design and CoA restructuring requires careful accounting judgment.

**Dependencies:**
- Leadership to define the target date for full separation
- IT to support QBD configuration changes
- External accountants to review the new GL structure before going live
- HR to provide the full WeVend employee list for new payroll setup

**Suggested approach:**
Build a project plan with discrete phases: (1) Chart of accounts design for Wevend QBD, reviewed by external accountants; (2) Employee record migration in payroll; (3) Opening balance entry and intercompany reconciliation; (4) Parallel run period; (5) QBO U.S. entity mirror setup. Schedule tasks during lower-volume periods where possible. Consider temporary additional accounting support during the transition.

**Success criteria:**
Entity separation completed without disruption to daily operations, payroll, or compliance filings. Clean opening balances in both new Wevend QBD and QBO entities. Zero missed CRA deadlines during the transition.

---

## Quick Wins (Can Be Done in Under 2 Weeks)

These are low-complexity items that should be addressed immediately:

1. **Corporate Credit Cards & VISA Statement Access (Priority 2)** — John G. to approve corporate card issuance via RBC (CAD). Grant Accounting direct access via RBC Express. Two Accounting department cards issued. Eliminates personal card usage and a recurring monthly bottleneck with no system build required.
2. **Clover Email Auto-Forwarding (Priority 3)** — A 30-minute Outlook rule or Power Automate flow. Eliminates a daily manual task for Nancy (~10 min/week, 100% automation savings).
3. **Commission Formula Lock in Excel (interim for Priority 5)** — Before a full platform is built, lock the lease score factor formula in the Excel commission template to prevent calculation errors.

---

## 30-Day Targets

Per Nancy's prioritization:

1. **Sales Orders & Invoicing** — IT continues progress toward system-generated POs for reps that can be imported into QBO. Target: sales reps generate POs from the system; Accounting imports directly into QBO with no re-entry. Clover duplicate entry to be addressed in a future phase.
2. **Corporate Credit Cards & VISA Statement Access** — John G. to approve corporate card issuance. RBC to issue CAD corporate VISA accounts; Accounting granted direct access via RBC Express. Two Accounting department cards issued. Target: no personal card usage and independent VISA statement access before next month-end close.
3. **Clover Email Auto-Forwarding** — IT configures the Outlook/Power Automate rule. Target: zero manual Clover forwards by Accounting.

---

## 90-Day Targets

1. **Commission Management – MONEX (Phase 1):** Standardized and formula-locked Excel template in use. Commission approval chain documented and enforced. Design spec for centralized platform drafted.
2. **Invoice & Expense Approval Workflow:** Tool selected (e.g., ApprovalMax or Teams Approvals), configured, and in use for all vendor invoice and expense approvals. No approval tracked by email.
3. **Corporate Credit Cards & VISA Statement Access:** Corporate VISA accounts issued (CAD via RBC, USD via CNB once U.S. entities are separated). Two Accounting department cards in use. Accounting has direct daily card spend visibility. Receipt policy communicated to all cardholders.
4. **Entity Separation Plan:** Formal project plan created with phases, owners, and target dates. External accountant review of new GL structure scheduled.
5. **Phorge Deal Closing – IT Scoping:** IT to assess whether bulk closure or automation is feasible within Phorge. Preliminary scoping complete.

---

## Scaling Risks to Address

| Risk | Current State | What Breaks at Scale | Recommended Action |
|---|---|---|---|
| Manual MONEX commission calculation | 8–15 reps, Excel-based | 20+ reps, deal volume multiplies — Excel will be unmanageable | Commission platform (Priority 5) |
| Manual Phorge deal closing | 3–5 deals/day, ~1 hr/day for Kylie | Daily volume doubles or triples — Kylie cannot keep up | Phorge automation (Priority 6) |
| Nancy as sole compliance officer | 1 person handles all CRA filings | More entities, more employees, more contractor types | Document all compliance processes; explore fractional or junior compliance support |
| Entity separation in QBD/QBO — timeline unknown | WeVend employees fully under POS (MONEX) in QBD; no timeline set for the move | When triggered mid-scale, full separation will disrupt records and burn the team | Entity Separation Plan (Priority 9) — build the plan now, before the date is set |
| WeVend commission — no platform | QBO manual pull, low volume (pilot stage) | High volume of distributor deals and terminal activations | WeVend commission platform (Priority 8), built into new database design |
| A/R volume growth | ~480 invoices/year, Nancy manages manually | Significantly more invoices, more collection follow-ups at scale | System-generated POs (Priority 1) + explore A/R automation in QBO |

---

## Notes for Weekly Review

- **Priority 2 (Corporate Cards & VISA Access) and Priority 3 (Clover Auto-Forward) are ready to act on this week** — no IT build required, just configuration and access approvals.
- **Priority 6 (Phorge Deal Closing) is the highest quantified time saving** — ~5 hrs/week for Kylie. IT scoping should begin as soon as possible.
- Commission Management (Priority 5) requires IT and Sales Director buy-in before scoping begins. This should be raised at the next leadership touchpoint.
- The entity separation (Priority 9) is deferred to owner and accountant level. No Accounting action required until leadership sets a date.
- WeVend commission (Priority 8) is blocked on the new WeVend database. Accounting's requirements should be submitted to IT/leadership now so they are included in the database design, not added after the fact.
- The team is **currently running behind**. Any automation that reduces Kylie's daily manual load (Priorities 3, 6) has an immediate quality-of-life impact on a team that is already stretched.

---

*This priority list was generated from a Department X-Ray session on March 25–26, 2026. Phase 8 Time Savings Deep-Dive completed March 26, 2026. It should be reviewed weekly and updated as items are completed or priorities shift.*
