# Accounting Department — Automation & Agent Priorities
**Date:** March 25, 2026
**Source:** Department X-Ray interview with Nancy ShuPan, Accounting Coordinator
**Review Cadence:** Weekly with Peter Kuperman

---

## Priority Summary

| Rank | Opportunity | Est. Effort | Complexity | Impact |
|---|---|---|---|---|
| 1 | Sales Orders & Invoicing — System-Generated POs | Low | Low | High |
| 2 | Corporate Credit Cards & Bank / VISA Statement Access for Accounting | Low | Low | High |
| 3 | Clover Payment Notification Auto-Forwarding | Low | Low | Medium |
| 4 | Invoice & Expense Approval Workflow | Medium | Medium | High |
| 5 | Commission Management Platform — MONEX | High | High | Very High |
| 6 | Phorge Deal Closing — Automation or Streamlining | High | High | High |
| 7 | Employee Expense Management Platform | Medium | Medium | Medium |
| 8 | Commission Management Platform — WeVend | High | High | High (future) |
| 9 | Entity Separation — Accounting Readiness Plan | Medium | Medium | Critical |

---

## Detailed Opportunities

---

### Priority 1: Sales Orders & Invoicing — System-Generated POs

**What to automate/improve:**
Build on the existing standard PO Excel template (with dropdown lists) to move toward system-generated sales POs that are rep-reviewed and QBO-ready before reaching Accounting. Eliminate the duplicate customer setup currently required in both QBO and Clover. IT is already working on this.

**Current state:**
Accounting has built a standard PO template in Excel with dropdown lists for sales orders. Sales reps send completed POs to Accounting by email. Accounting then sets up the customer in both QBO and Clover separately — creating duplicate entry work. IT is currently working on moving this toward a system-generated solution.

**Why it matters:**
Even with the existing Excel PO template in place, Accounting must still set up the same customer twice (QBO and Clover) for every deal — creating duplicate entry work. As deal volume grows, this multiplies directly and increases the risk of invoicing errors.

**Estimated time savings:**
Not quantified — but impacts every deal processed. Even saving a few minutes per deal at current volume adds up significantly.

**Complexity:** Low — primarily a process and template design fix, with IT already engaged.

**Dependencies:**
- Sales Directors to mandate rep review of PO before submission to Accounting
- IT to complete the system-generated PO solution that outputs QBO-ready data
- One-time Clover and QBO setup consolidation review

**Suggested approach:**
The standard Excel PO template with dropdowns is already in place — built by Accounting. IT is currently working on the next step. The goal is for the system-generated PO to feed directly into QBO so that Accounting only needs to set up a customer once, with the Clover payment link generated from QBO automatically — eliminating the current duplicate entry in both systems.

**Success criteria:**
No duplicate customer setups required. PO data flows directly into QBO with no re-entry. Time from deal close to invoice sent reduced.

**WeVend/MONEX considerations:** Applies to both entities. QBO is used for U.S. entities; QBD for Canadian — PO format may need entity-specific variants.

---

### Priority 2: Corporate Credit Cards & Bank / VISA Statement Access for Accounting

**What to automate/improve:**
Issue corporate credit cards to replace the current use of John G.'s personal VISA cards for company-wide spending, and grant Accounting direct daily visibility into all card spend via the appropriate platform — RBC Express for Canadian entities (CAD and interim USD), and CNB platform for U.S. entities (USD) once U.S. entities are fully separated and operating independently.

**Current state:**
The whole company is currently spending on John G.'s personal VISA cards. Accounting has no direct access to these statements — each month, Accounting must wait on John G. to provide them before credit card reconciliation can begin, creating a bottleneck in month-end close and an inappropriate reliance on a personal card for business expenses. Missing receipts are frequently discovered at month-end, requiring retroactive follow-up.

**Why it matters:**
Transitioning to corporate cards and granting Accounting direct statement access removes a recurring monthly bottleneck, eliminates personal liability exposure, and allows Accounting to flag missing receipts in real time rather than at month-end. Improves cash flow visibility and reduces the risk of unauthorized or miscoded transactions going unnoticed for weeks.

**Estimated time savings:**
Eliminates time lost to follow-up and waiting each month-end. Estimated to shave 1–3 days off the reconciliation start date monthly. Missing receipts identified within days of purchase, not weeks.

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
Every time a customer pays via a Clover payment link, a confirmation email arrives in Accounting's inbox. Nancy (or the team) manually forwards this email to the applicable sales rep and director. This happens multiple times per day.

**Why it matters:**
This is a repetitive, zero-value administrative task consuming Nancy's time daily. It is also a risk — if the email is not forwarded promptly, the sales rep may not know the payment was received, potentially affecting their follow-up actions.

**Estimated time savings:**
Low per instance (2–5 minutes), but it happens daily. Estimated 30–60 minutes per week recovered for Nancy.

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
When vendor invoices or expense claims require Director or manager approval before payment, Accounting submits them by email and then manually tracks whether approval has been received. Follow-ups are done manually. There is no system to show who has approved what, when, or what is still outstanding. Delays are common because approvers have competing priorities.

**Why it matters:**
Approval delays cascade into payment delays, which affect vendor relationships and can trigger late fees. The manual tracking creates overhead for Accounting and introduces risk of invoices being lost or forgotten. As deal volume and headcount grow, the number of approvals will increase proportionally.

**Estimated time savings:**
Difficult to quantify precisely, but follow-up and tracking time is estimated at several hours per week across the team.

**Complexity:** Medium — requires selecting and implementing an approval workflow tool, or configuring one within an existing platform (e.g., Microsoft Teams Approvals, or a lightweight tool like ApprovalMax integrated with QBO).

**Dependencies:**
- IT to evaluate and implement a tool
- Directors and managers to adopt the new workflow
- Accounting to define the approval routing rules (which invoice type goes to which approver)

**Suggested approach:**
Evaluate ApprovalMax (which integrates with both QBO and QBD) or Microsoft Teams Approvals as a lightweight option. Key requirements: approval by email or Teams, automated reminders after X days, audit trail showing approval date and approver, dashboard view for Accounting showing outstanding approvals.

**Success criteria:**
No approval is tracked by email. Accounting has real-time visibility into all outstanding approvals. Average approval turnaround time reduced. Audit trail available for each approval.

---

### Priority 5: Commission Management Platform — MONEX

**What to automate/improve:**
Build or configure a centralized commission management platform for MONEX that: links commission eligibility to MONEX deal numbers in Phorge, automates the deal closure trigger for commission purposes, tracks approval status, stores the paid commission history centrally, and reduces manual Excel calculation.

**Current state:**
Commission for 8–15 reps per pay period is calculated entirely in Excel. Kylie manually pulls the "Qualified for Commission" report from Phorge, cross-references each rep's individual Schedule A, applies the lease score factor formula manually (÷ 0.0323 or ÷ 0.0416), calculates per deal, compiles a file, gets Nancy's approval, and issues invoices. Non-standard commissions require a separate Director/manager approval chain via email before reaching Accounting. There is no central record of what has been paid to whom for which deals.

**Why it matters:**
This is the highest-effort, highest-risk manual process in the department. It is error-prone (manual formula application), time-consuming (8–15 reps, multiple deals each), and completely undocumented in any system. As MONEX scales, the volume of eligible deals and reps will grow significantly.

**Estimated time savings:**
Commission calculation and file preparation is currently a multi-hour process per pay period. Automation could reduce this to a review-and-approve step.

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

**Why it matters:**
With 3–5 deals per day, each containing multiple terminals, this process consumes a significant portion of Kylie's day. It is entirely manual, error-prone (wrong closure date, missed terminal), and produces no value beyond updating a status field in Phorge. At 10,000 terminals scale, it becomes unworkable.

**Estimated time savings:**
Estimated to represent 1–2 hours of Kylie's daily time. Annual impact is significant.

**Complexity:** High — requires IT access to Phorge to build a batch closure function or API-based trigger from RBC funding confirmation.

**Dependencies:**
- IT access to Phorge backend or API
- Operations/Admin to ensure funding confirmation data is structured and machine-readable
- Accounting to define the exact closure criteria (payment received + terminal shipped)

**Suggested approach:**
Ideal state: When funding is confirmed in RBC Express AND terminal shipment is confirmed in the operations system, Phorge automatically marks the deal and all associated terminals as closed with the correct date — no manual action from Accounting required.
Interim state: Build a bulk closure tool in Phorge that allows Kylie to upload the day's closure list (from the Admin spreadsheet) and close all deals in one action, rather than navigating deal by deal.

**Success criteria:**
Phorge deal closing time reduced from 1–2 hours daily to under 15 minutes. Zero instances of a deal being missed or closed with the wrong date due to manual error.

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

**Why it matters:**
Without a managed plan, the entity separation will be absorbed into Accounting's daily workload reactively — creating a very high risk of errors in the new setup, disruption to existing records, and team burnout. Nancy has described this upcoming transition as "mentally and physically burned."

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

1. **Corporate Credit Cards & VISA Statement Access (Priority 2)** — John G. to approve corporate card issuance via RBC (CAD and interim USD). Grant Accounting direct access via RBC Express. Eliminates personal card usage and a recurring monthly bottleneck with no system build required.
2. **Clover Email Auto-Forwarding (Priority 3)** — A 30-minute Outlook rule or Power Automate flow. Eliminates a daily manual task for Nancy.
3. **Commission Formula Lock in Excel (interim for Priority 5)** — Before a full platform is built, lock the lease score factor formula in the Excel commission template to prevent calculation errors.

---

## 30-Day Targets

Per Nancy's prioritization:

1. **Sales Orders & Invoicing** — IT continues progress toward system-generated POs that feed directly into QBO, eliminating the duplicate customer setup in QBO and Clover. Target: no dual manual entry required by Accounting.
2. **Corporate Credit Cards & VISA Statement Access** — John G. to approve corporate card issuance. RBC to issue CAD and USD (interim) corporate VISA accounts for Canadian entities; Accounting granted direct access via RBC Express. Target: no personal card usage and independent VISA statement access before next month-end close.
3. **Clover Email Auto-Forwarding** — IT configures the Outlook/Power Automate rule. Target: zero manual Clover forwards by Accounting.

---

## 90-Day Targets

1. **Commission Management – MONEX (Phase 1):** Standardized and formula-locked Excel template in use. Commission approval chain documented and enforced. Design spec for centralized platform drafted.
2. **Invoice & Expense Approval Workflow:** Tool selected (e.g., ApprovalMax or Teams Approvals), configured, and in use for all vendor invoice and expense approvals. No approval tracked by email.
3. **Corporate Credit Cards & VISA Statement Access:** Corporate VISA accounts issued (CAD and interim USD via RBC; USD via CNB once U.S. entities are separated). Accounting has direct daily card spend visibility. Receipt policy communicated to all cardholders.
4. **Entity Separation Plan:** Formal project plan created with phases, owners, and target dates. External accountant review of new GL structure scheduled.
5. **Phorge Deal Closing – IT Scoping:** IT to assess whether bulk closure or automation is feasible within Phorge. Preliminary scoping complete.

---

## Scaling Risks to Address

| Risk | Current State | What Breaks at Scale | Recommended Action |
|---|---|---|---|
| Manual MONEX commission calculation | 8–15 reps, Excel-based | 20+ reps, deal volume multiplies — Excel will be unmanageable | Commission platform (Priority 5) |
| Manual Phorge deal closing | 3–5 deals/day, multiple terminals each | Daily volume doubles or triples — Kylie cannot keep up | Phorge automation (Priority 6) |
| Nancy as sole compliance officer | 1 person handles all CRA filings | More entities, more employees, more contractor types | Document all compliance processes; explore fractional or junior compliance support |
| Entity separation in QBD/QBO — timeline unknown | WeVend employees fully under POS (MONEX) in QBD; no timeline set for the move | When triggered mid-scale, full separation will disrupt records and burn the team | Entity Separation Plan (Priority 9) — build the plan now, before the date is set |
| WeVend commission — no platform | QBO manual pull, low volume | High volume of distributor deals and terminal activations | WeVend commission platform (Priority 8), built into new database design |
| A/R volume growth | Nancy manages invoicing and aging manually | Significantly more invoices, more collection follow-ups | System-generated POs (Priority 1) + explore A/R automation in QBO |

---

## Notes for Weekly Review

- **Priority 2 (Corporate Cards & VISA Access) and Priority 3 (Clover Auto-Forward) are ready to act on this week** — no IT build required, just configuration and access approvals.
- Commission Management (Priority 5) requires IT and Sales Director buy-in before scoping begins. This should be raised at the next leadership touchpoint.
- The entity separation (Priority 9) has no formal plan yet. The longer this goes without a project plan, the higher the risk of it being done reactively under pressure.
- WeVend commission (Priority 8) is blocked on the new WeVend database. Accounting's requirements should be submitted to IT/leadership now so they are included in the database design, not added after the fact.
- The team is **currently running behind**. Any automation that reduces Kylie's daily manual load (Priorities 3, 6) has an immediate quality-of-life impact on a team that is already stretched.

---

*This priority list was generated from a Department X-Ray session on March 25, 2026. It should be reviewed weekly and updated as items are completed or priorities shift.*
