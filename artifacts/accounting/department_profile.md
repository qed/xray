# Accounting Department — Department Profile
**Date:** March 25, 2026
**Interviewed:** Nancy ShuPan, Accounting Coordinator
**Interviewer:** Claude (Department X-Ray)

---

## 1. Department Identity

### Mission
The Accounting department is responsible for recording all business transactions, maintaining accurate financial records across all Wevend and MONEX entities, and ensuring full compliance with Canadian and U.S. government reporting and tax obligations.

### Scope
- Full-cycle bookkeeping for all Canadian and U.S. entities (CAD and USD, multi-currency)
- Accounts receivable: customer invoicing, payment collection support, A/R aging
- Accounts payable: vendor invoice review, GL entry, payment setup and authorization
- Payroll processing (Canada) and U.S. contractor payments — semi-monthly
- All CRA remittances: PD7A, EHT, WSIB, HST
- Year-end filings: T4, T4A preparation, PIER Review, U.S. 1099
- Sales rep commission calculation and invoicing (MONEX and WeVend)
- Banking platform management: RBC Express (CAD) and City National Bank (USD)
- EFT file management for both entities
- Phorge deal closing and reporting (MONEX system)
- Daily checking list maintenance for MONEX deal approvals and funding confirmations
- Extended Warranty chart distribution (monthly)
- Cross-department coordination with Sales, Operations, HR, IT, and Management

### Not In Scope
- WeVend deal-level commission tracking — no database or system is in place yet. Direction is pending the WeVend new database rollout.

### WeVend / MONEX Split
The department serves both MONEX (Money Express POS Solutions) and WeVend (Inc. and US Inc.) simultaneously every day. A precise time split cannot be calculated because many tasks — particularly bookkeeping, payroll, and compliance — apply to both entities concurrently and involve intercompany transactions. Work is similar across both entities because the nature of accounting (recording business transactions) does not fundamentally change between them. Where the work differs is in the tools: QBD is used for Canadian entities and QBO for U.S. entities.

**Entities served:**
- MONEX (Money Express POS Solutions) — Canadian
- Wevend Inc. — Canadian
- Wevend US Inc. — U.S.
- Money Express POS Solutions US Inc. — U.S.

Neither team member is dedicated exclusively to one business unit.

---

## 2. People & Roles

### Team Roster

| Name | Title | Key Responsibilities | Frequency |
|---|---|---|---|
| Nancy ShuPan | Accounting Coordinator / Senior Bookkeeper | Banking platform management (RBC Express, CNB), full-cycle bookkeeping, payroll processing, all CRA/government remittances, year-end filings (T4, PIER, 1099), multi-currency reporting, A/R management, EFT file management, commission review and approval, cross-department coordination | Daily + recurring |
| Kylie Nguyen | Accounting Clerk | Accounts payable (invoice review, GL entry, PO generation), timesheet data entry, commission file management and invoicing, Phorge deal closing, daily checking list updates, Extended Warranty chart distribution, credit card reconciliation, month-end COGS/expense support | Daily + recurring |

### Reporting Structure
Nancy reports to John G. Kylie's work flows to Nancy for review and authorization before final execution (particularly payroll, commissions, and banking).

### Single Points of Failure

| Person | What Only They Know / Do | Risk If They Leave |
|---|---|---|
| Nancy | All CRA remittances (PD7A, EHT, WSIB, HST), bank reconciliations (RBC + CNB), payroll processing and bank file creation, year-end filings (T4, PIER, 1099), multi-currency reporting, RBC Express final authorization, EFT file management | All government filings stop. Payroll cannot be processed. Bank payments cannot be authorized. Risk of CRA penalties and missed deadlines. |
| Nancy | Commission review and approval process | Commissions cannot be issued without Nancy's sign-off. |
| Nancy | Intercompany transaction recording across all entities | Records become inconsistent across entities. |
| Kylie | Daily Phorge deal closing process and checking list maintenance | Daily MONEX operational record falls behind. Commission eligibility tracking breaks. |
| Kylie | Commission file management and invoice issuance for reps | Sales rep commissions are delayed. |

**Current situation:** The department is already running behind. If either person is absent, the remaining person must absorb the full workload of both. Nancy can fully cover Kylie's duties, but Kylie cannot cover Nancy's high-level compliance and banking functions. There is no formal backup or documented knowledge transfer.

---

## 3. Tools & Systems

### Tool Stack

| Tool | Purpose | Primary Users | Frequency | Notes |
|---|---|---|---|---|
| QuickBooks Desktop (QBD) | Full-cycle bookkeeping for all Canadian entities — GL, payroll, A/R, A/P, bank rec | Nancy (primary), Kylie (A/P entries) | Daily | Used for MONEX and Wevend Inc. (Canadian entities). |
| QuickBooks Online (QBO) | Bookkeeping for U.S. entities — GL, A/R, invoice reports | Nancy (primary), Kylie (A/P support) | Daily | Used for Wevend US Inc. and other U.S. entities. Source for WeVend commission invoice pull. |
| RBC Express | Canadian banking: payroll file import, vendor payment authorization, EFT management, funding confirmation | Nancy (final authorization), Kylie (payment setup) | Daily / Per pay run | Nancy is the final approver. Kylie sets up payments; Nancy releases. |
| City National Bank (CNB) | U.S. banking: USD transactions, EFT files, contractor payments, sub ISO payments, reconciliations | Nancy | Daily | U.S. operations only. |
| Clover | Customer payment links for A/R collection | Nancy | Daily / As needed | Payment confirmation emails are manually forwarded — automation opportunity flagged. |
| Phorge | MONEX internal deal management system: deal closing, report extraction (Qualified for Commission, Revenue Commission, PAP) | Kylie (deal closing, report exports), Nancy/IT (chargeback uploads) | Daily | Multi-step manual process to close each deal. 3–5 deals per day, each deal may contain multiple terminals requiring individual navigation. |
| Excel / Spreadsheets | Commission files, checking list, Extended Warranty chart, A/R aging report, payroll input tracking | Kylie (commission files, checking list), Nancy (A/R aging) | Daily / Weekly | Commission calculations done manually in Excel based on Schedule A. No automated commission system exists. |
| MSC System / First Data | Lease funding submissions | No longer used by Accounting — Admin team handles | N/A | Process transferred out of Accounting. |

### Missing Tools (Wish List)
- Centralized commission management platform (Phorge-integrated or standalone) for MONEX
- Commission platform for WeVend (pending new WeVend database)
- Unified employee expense management platform (e.g., Ramp or Expensify)
- System-generated Sales POs with QBO-ready output
- Direct Accounting access to RBC VISA statements (CAD and USD) via RBC Express

### Underused / Inaccessible Tools
- RBC Express VISA module: Accounting does not currently have direct access to credit card statements, creating a dependency on others for monthly reconciliation.

### Data Locations
| Data | Location |
|---|---|
| Canadian entity financials (GL, payroll, A/R, A/P) | QuickBooks Desktop |
| U.S. entity financials | QuickBooks Online |
| MONEX deal records | Phorge and Checking List (Excel) |
| Commission files | Excel spreadsheets (locally stored) |
| Funding reports | Excel chart / lease numbers recorded in Phorge — maintained by Nancy & Kylie |
| Daily checking list (deal approvals, closures) | Excel workbook with multiple sheets |
| Extended Warranty chart | Excel workbook (distributed monthly) |
| Employee timesheets | Received from HR, entered into QBD by Kylie |
| Bank statements | RBC Express (CAD), CNB platform (USD) |

### Integration Gaps
- **QBD ↔ QBO**: No integration. All intercompany transactions between Canadian and U.S. entities are entered manually in both systems. This is intentional to maintain clean records and is accepted as current practice.
- **Phorge → Excel**: Commission eligibility data must be exported from Phorge and manually worked in Excel. No automated feed.
- **Clover → QBO/QBD**: Payment confirmations from Clover are manually forwarded by email. No automated notification or GL posting.
- **QBO/QBD → Clover**: After invoices are issued in QBO/QBD and sent to customers, Accounting must manually set up the customer and invoice again in Clover to generate a payment link — duplicated work.
- **HR (timesheets) → QBD**: Timesheets are received from HR and manually keyed into QBD by Kylie.
- **Sales POs → QBO**: No system-generated PO process. Non-standard POs are sent to Accounting manually, requiring duplicate setup in both QBO and Clover.

### Access Risks
- RBC Express: Nancy holds final authorization. If Nancy is unavailable, no payments can be released.
- Phorge: Deal closing is performed by Kylie. Commission report extraction is performed by Kylie (and Nancy for PAP). No documented cross-training for backup.

---

## 4. Workflows & Processes

### 4.1 Payroll Processing (Canadian)

**Trigger:** Semi-monthly pay period calendar
**Owner:** Kylie (input) → Nancy (processing and payment)
**Frequency:** Semi-monthly | **Volume:** All Canadian employees + applicable contractor adjustments
**Time:** Not quantified during session
**Tools Used:** HR system (timesheets), QBD, RBC Express

**Steps:**
1. Kylie receives employee timesheets from HR each pay period.
2. Kylie enters hours into QBD.
3. Kylie calculates commissions for applicable sales reps (see Workflow 4.3).
4. Kylie enters commission amounts, bonuses, and any other additional compensation into QBD.
5. Kylie sends confirmation to Nancy for review.
6. Nancy reviews all payroll entries in QBD.
7. Nancy pulls the payroll report and generates paystubs.
8. Nancy creates the RBC bank-formatted payroll EFT file.
9. Nancy imports the file into RBC Express and releases payment after review.

**Inputs Required:** HR timesheets, commission approvals, bonus/reward directives from management
**Output/Deliverable:** Paystubs distributed to employees; EFT file processed via RBC Express; PD7A remittance to CRA generated per pay run
**Common Exceptions:** Missing or late timesheets from HR; special commissions or bonuses requiring Director approval; employee lifecycle changes (new hire, termination, promotion) affecting the pay run
**Documentation Status:** Process is known to Nancy and Kylie from practice. RBC file format requirements are tribal knowledge held by Nancy.
**WeVend vs MONEX Differences:** Wevend employees are currently under the POS (MONEX Canadian) entity in QBD. Migration to a separate Wevend QBD entity is in progress but not complete. Once fully separated, a parallel payroll setup will be required.

---

### 4.2 U.S. Contractor Payments

**Trigger:** Semi-monthly pay period calendar
**Owner:** Nancy
**Frequency:** Semi-monthly | **Volume:** All U.S.-based contractors
**Tools Used:** QBO, City National Bank (CNB) platform

**Steps:**
1. Commission and expense data for U.S. contractors compiled (mirrors Canadian commission process where applicable).
2. Nancy processes payments via the CNB Business Platform.
3. Transactions recorded in QBO.

**Output/Deliverable:** Contractor payments released; 1099 data accumulated for year-end filing
**Documentation Status:** Tribal knowledge held by Nancy.

---

### 4.3 Commission Calculation and Invoicing — MONEX

**Trigger:** Semi-monthly (per pay period); tied to deal closure confirmation
**Owner:** Kylie (calculation and invoice) → Nancy (review and approval) → Directors/Managers (non-standard approvals pre-submission)
**Frequency:** Semi-monthly | **Volume:** 8–15 reps per pay period depending on sales activity
**Tools Used:** Phorge (report export), Schedule A (Excel/PDF per rep), QBD, Excel

**Steps:**
1. Kylie logs into Phorge and pulls the "Qualified for Commission" report for each relevant MONEX number.
2. Kylie identifies deals eligible for commission in the current period.
3. For each eligible deal, Kylie references the rep's individual Schedule A to find their commission rate.
4. For **lease deals**: Terminal cost = lease price ÷ lease score factor
   - Score 1 (A, B, C ratings): divide by 0.0323
   - Score 2 (D rating): divide by 0.0416
5. For **purchase deals**: Terminal price = cost of sale (admin-entered sales price).
6. Kylie calculates commission per deal, per rep, and compiles the commission file in Excel.
7. For any non-standard or special commission requests, the sales rep's direct manager must approve before submitting to Accounting.
8. Nancy reviews and approves the commission file.
9. Kylie issues commission invoices to reps after Nancy's approval.
10. Commission amounts entered into QBD payroll for the pay run.

**Inputs Required:** Phorge "Qualified for Commission" report, individual Schedule A files for each rep, funding confirmation, any special approval emails
**Output/Deliverable:** Commission invoices issued to reps; amounts entered into payroll
**Common Exceptions:** Missing Schedule A for a rep; deals in Phorge not yet closed or not yet funded; special commission structures not covered by standard Schedule A; Phorge data discrepancies requiring Admin follow-up
**Documentation Status:** Schedule A files exist per rep but are stored separately. The calculation formula (lease score factor) is documented in reference files but not in a system.
**Scaling Risk:** Currently manageable at 8–15 reps. As WeVend and MONEX scale and separate, this process will need a centralized platform. No commission database exists.

---

### 4.4 Commission Calculation and Invoicing — WeVend

**Trigger:** Semi-monthly
**Owner:** Nancy/Kylie
**Frequency:** Semi-monthly | **Volume:** Currently low (distributors and pilot deals only)
**Tools Used:** QBO (paid invoice report), Schedule A (Sales Compensation Plan 2025 deck)

**Steps:**
1. Accounting pulls the paid invoice list from QBO, filtered by sales rep name and invoice number.
2. For each paid invoice, commission is calculated per the WeVend Schedule A:
   - Hardware: 3.75% of retail price; or 5% if retail price exceeds $340 (PayPro), $390 (PayProPlus), or $175 (PayQR)
   - Processing: One-time commission based on avg net revenue per unit × accelerator multiplier (1x for <$20, 1.5x for $21–$74, 3x for >$75)
3. Commission invoices are issued to reps.

**Current Limitations:** No WeVend deal database has been set up. No commission tracking platform exists for WeVend. Direction is pending the WeVend new database rollout. This process is manual and based solely on QBO invoice reports.
**Scaling Risk:** High. As WeVend sales volume grows (more distributor deals, terminal activations), this manual pull-and-calculate method will not scale. A dedicated platform will be required.

---

### 4.5 Phorge Deal Closing (MONEX Daily)

**Trigger:** Daily — Accounting receives the approval deals list and funding requests from Operations/Admin
**Owner:** Kylie
**Frequency:** Daily | **Volume:** 3–5 deals per day; each deal may contain multiple terminals
**Tools Used:** Phorge, Excel (checking list workbook)

**Steps:**
1. Accounting receives the approval deals list and funding requests list from Operations/Admin.
2. Kylie adds new approvals to the accounting checking list (Excel workbook).
3. One-time Setup Fees are extracted to a separate sheet; Nancy receives this sheet on the 1st business day of each month for the prior month's setups (CAD and USD).
4. For each financially closed deal (payment/funding received AND terminal shipped):
   a. Kylie logs into Phorge.
   b. Enters the MONEX or merchant number → Submit.
   c. Presses "Revise."
   d. Scrolls to locate the relevant deal (purchase or lease).
   e. Double-clicks the product/terminal.
   f. For leases: enters the lease number from the FD funding report.
   g. For purchases: sales price is pre-entered by Admin.
   h. Checks "Deal Closed" and enters the "Closure Date."
   i. Presses "Update" then "Submit."
   j. Repeats for processing fees: marks "Processing/Service Fee Paid" and enters "Pay Date."
   k. Repeats for each terminal within the deal.
5. Kylie updates the daily checking list with the Phorge closure date and required comments for each deal.
6. Nancy saves the funding reports in the Funding Report chart and confirms receipt of funds via RBC Express.

**Inputs Required:** Daily approval deals list from Operations/Admin; FD funding reports (for lease numbers)
**Output/Deliverable:** Deals closed in Phorge; checking list updated; funding confirmed in RBC
**Common Exceptions:** Deals on the approval list that are not yet funded; discrepancies between Admin list and Phorge data; terminals not yet shipped; missing lease numbers from FD funding reports
**Documentation Status:** Process is documented in a Word file ("Phorge -- manually process for accounting -- should be improved"). The document itself flags this as a process that should be automated.
**Tribal Knowledge Flag:** This multi-step, multi-layer Phorge navigation is highly manual and is currently performed only by Kylie. Nancy/IT handle chargeback uploads separately.

---

### 4.6 Accounts Receivable and A/R Aging Report

**Trigger:** Ongoing; aging report distributed weekly
**Owner:** Nancy
**Frequency:** Daily (invoicing) / Weekly (aging report) | **Volume:** All customer invoices across entities
**Tools Used:** QBD, QBO, Clover

**Steps:**
1. Nancy prepares and sends customer invoices as deals are completed or on a recurring schedule.
2. Nancy sends payment links to customers via Clover to facilitate collection.
3. Nancy maintains the weekly A/R aging report and distributes it to sales reps and management.
4. Sales reps are responsible for following up with customers for payment.
5. Payment confirmations from Clover are manually forwarded to sales reps and Directors by Accounting.

**Common Exceptions:** Overdue accounts; disputed invoices; customers requiring multiple follow-ups from sales reps
**Documentation Status:** Standard workflow; not separately documented.

---

### 4.7 Accounts Payable

**Trigger:** Vendor invoices received
**Owner:** Kylie (entry and setup) → Nancy (authorization)
**Frequency:** Daily | **Volume:** All vendor invoices across entities
**Tools Used:** QBD, QBO, RBC Express, CNB

**Steps:**
1. Kylie reviews vendor invoices for proper documentation.
2. Kylie enters transactions to the GL (QBD or QBO depending on entity).
3. Kylie prepares vendor payment setups in RBC Express.
4. Invoices and expense claims requiring approval are submitted to relevant Directors/managers before processing.
5. Nancy reviews and authorizes final payment release in RBC Express and CNB.

**Common Exceptions:** Missing receipts; invoices without proper approval; credit card expenses submitted without documentation
**Documentation Status:** Standard process; not separately documented.

---

### 4.8 Tax Remittances and Government Filings

**Owner:** Nancy exclusively
**Frequency:** Per pay run (PD7A), Monthly (EHT, WSIB, HST), Annual (T4, T4A prep, PIER, 1099)
**Tools Used:** QBD, CRA online portals, Service Ontario, RBC Express

| Filing | Frequency | Description |
|---|---|---|
| PD7A | Per pay run | Source deductions remitted to CRA after each payroll |
| EHT | Monthly + Annual reconciliation | Employer Health Tax filed with Service Ontario |
| WSIB | Monthly + Annual reconciliation | Filed online |
| HST | Monthly or Quarterly | Filed in compliance with CRA requirements |
| T4 | Annual | Issued to employees and filed with CRA by Nancy |
| T4A | Annual | Nancy prepares draft; external accountants complete filing |
| PIER Review | Annual | CRA pensionable and insurable earnings review, coordinated by Nancy |
| U.S. 1099 | Annual | Prepared and issued by Nancy for all U.S. contractors |

**Critical Risk:** Nancy is the sole person who performs all of these filings. There is no documented backup or cross-training. Missed deadlines result in CRA penalties.

---

### 4.9 Month-End and Year-End Close

**Owner:** Nancy leads; Kylie supports
**Frequency:** Monthly (close) / Annual (year-end)

**Steps:**
1. Nancy finalizes all GL entries; Kylie's A/P transactions are reviewed and locked.
2. Nancy finalizes all bank reconciliations (RBC CAD, RBC USD, CNB USD).
3. Kylie completes credit card reconciliations.
4. Kylie submits timesheets → Nancy processes final payroll for the period.
5. Commission approvals obtained → Kylie issues final commission invoices.
6. Nancy prepares draft multi-currency financials, payroll reports, and A/R aging.
7. Kylie prepares expense and COGS documentation.
8. All draft reports submitted to external accountants and law firms as required.
9. Year-end: Nancy files T4, PIER, EHT/WSIB reconciliations, and 1099 directly. T4A drafts prepared by Nancy, filed by accountants.

---

### 4.10 Extended Warranty Chart Distribution

**Owner:** Kylie (preparation & submission) → Nancy (review & distribution)
**Trigger:** Last business day of each month
**Recipients:** Tina, John G., Scott
**Tools Used:** Excel

**Steps:**
1. Kylie maintains and updates the Extended Warranty chart in Excel throughout the month.
2. On the last business day of each month, Kylie submits the updated chart to Nancy for review.
3. Nancy reviews the chart for accuracy.
4. Nancy sends the finalized chart to the three recipients: Tina, John G., and Scott.

---

## 5. Handoffs & Dependencies

### Inbound (What Accounting Receives)

| From | What | Format | How | Common Problems |
|---|---|---|---|---|
| HR | Employee timesheets | Unknown format | Sent to Kylie each pay period | Late or missing timesheets delay payroll processing |
| Operations / Admin | Daily approval deals list + funding requests | Email / Excel list | Daily | Discrepancies between list and Phorge data; missing lease numbers |
| Sales Reps | Non-standard commission requests | Email | Ad hoc | Approvals not obtained before submission; missing Schedule A context |
| Directors / Managers | Invoice and expense approvals | Email | As needed | Delayed approvals due to competing priorities; repeated follow-ups required |
| Admin | FD (First Data) funding reports | Report / file | Per deal | Needed for lease number entry in Phorge; delays when not provided promptly |
| Sales | Non-standard / manual POs | Email | As needed | Not QBO-ready; require duplicate setup in QBO and Clover |

### Outbound (What Accounting Delivers)

| To | What | Format | How | Notes |
|---|---|---|---|---|
| Sales Reps | A/R aging report | Excel / Email | Weekly | Reps responsible for customer follow-up |
| Sales Reps | Commission invoices | Invoice / Email | Semi-monthly | After Nancy approval |
| Sales Reps / Directors | Clover payment confirmations | Email (forwarded manually) | As payments arrive | Currently manual; no automation |
| Management / Directors | Payroll reports | Report | Per pay run | |
| Management / Directors | Draft multi-currency financials, A/R aging | Report | Monthly | |
| Tina, John G., Scott | Extended Warranty chart | Excel | Last business day of month | Reviewed by Nancy before distribution |
| External Accountants / Law Firms | Draft financial reports, T4A drafts, year-end documentation | Various | As required | |
| CRA / Service Ontario | PD7A, EHT, WSIB, HST, T4, PIER | Government portal submissions | Per schedule | Exclusively handled by Nancy |

### Blocking Dependencies
- Accounting cannot finalize commission invoices until Directors/managers approve non-standard commissions.
- Accounting cannot confirm funding until RBC Express shows the deposit — requires Nancy's access to the platform.
- Accounting cannot reconcile VISA statements without direct access to RBC VISA — currently a bottleneck.
- Payroll cannot be processed until timesheets are received from HR.

### Most Frequent Interactions (Ranked)
1. Operations / Admin (daily — deal lists, funding requests)
2. Sales Reps (weekly — A/R, commissions, invoice queries)
3. Directors / Managers (recurring — approvals)
4. HR (semi-monthly — timesheets)
5. External Accountants (monthly/annual — draft reports)
6. IT (ad hoc — system issues, Phorge, access)

### Cross-Functional Gaps
- Sales POs are generated manually and sent to Accounting without a standardized format, creating duplicate entry in QBO and Clover.
- Clover payment notifications are not automatically routed to the right parties — Accounting manually forwards them.
- No centralized expense submission platform exists; all expense claims travel by email with inconsistent documentation.
- Accounting lacks visibility into Marketing, IT, and Sales card spend in real time — month-end surprises are common.

---

## 6. Pain Points & Bottlenecks

### Time Sinks

| Pain Point | Who It Affects | Root Cause |
|---|---|---|
| Manual Phorge deal closing (multi-step, multi-layer navigation per terminal per deal) | Kylie — daily | No automated deal closure; Phorge requires manual entry for every terminal in every deal |
| Commission calculation in Excel (per rep, per deal, per period) | Kylie — semi-monthly | No commission management platform; all calculations reference Schedule A manually |
| Manual forwarding of Clover payment confirmation emails | Nancy — daily | No Outlook automation rule or integration exists |
| Following up on delayed invoice/expense approvals from managers | Kylie (follow-up) + Nancy (oversight) — ongoing | No centralized approval workflow; approvals tracked manually by email |
| Duplicate customer setup in QBO and Clover (non-standard POs) | Nancy / Kylie | No system-generated PO process; reps send non-standard POs to Accounting |
| VISA statement reconciliation bottleneck | Nancy — monthly | Accounting does not have direct access to RBC VISA statements; dependent on others |
| Intercompany transaction reconciliation | Nancy — ongoing | Manual entry in both QBD and QBO; accepted as necessary for now |
| Missing receipts at month-end credit card reconciliation | Kylie — monthly | No unified expense platform; receipts submitted inconsistently by email |

### Bottlenecks
- Director/manager invoice approvals are frequently delayed due to competing priorities — Accounting must chase approvals manually and repeatedly.
- RBC VISA access: Accounting cannot initiate reconciliation independently; requires statement access from someone else.
- HR timesheet delivery: any delay cascades directly into payroll processing timing.

### Error-Prone Areas
- Commission calculation using the lease score factor — manual formula application with no system validation.
- Checking list updates — manual cross-referencing between the Admin approval list and Phorge deal status creates opportunities for missed or incorrect closures.
- Duplicate customer setups in QBO and Clover when non-standard POs arrive.

### Scaling Risks

| Risk | What Breaks at Scale (10,000 Terminals) |
|---|---|
| Manual Phorge deal closing | At current volumes (3–5 deals/day with multiple terminals each), Kylie's time is already consumed. Volume growth will make this unmanageable. |
| Manual commission calculation | 8–15 reps today. As MONEX and WeVend both scale and separate, the number of reps and deals will grow significantly. Excel-based manual calculation will not hold. |
| Nancy as sole compliance officer | More entities, more employees, more contractor types, more CRA filings. No backup. |
| Entity separation (QBD/QBO) — timeline unknown | WeVend employees are currently fully under the POS (MONEX) entity in QBD. When leadership sets a date for the move, a full parallel setup for WeVend (new GL accounts, employee records, chart of accounts in both QBD and QBO) must be completed on top of daily operations with a 2-person team. Team describes the eventual transition as "mentally and physically burned." |
| WeVend commission — no platform | Once WeVend moves beyond pilot/distributor deals, the current QBO-invoice-pull method will be insufficient. |
| A/R volume | More terminal activations = more invoices, more collection follow-ups, more aging management. Current 2-person capacity is already stretched. |

### Tribal Knowledge Risks
- RBC Express payroll file format and import process: Nancy only.
- Lease score factor formula and application: Nancy/Kylie working knowledge, not in any system.
- Entity-to-GL mapping across 4+ Canadian entities and 2+ U.S. entities: Nancy only.
- Multi-step Phorge deal closing process: Kylie only (with reference document).

---

## 7. The Wish List

- System-generated sales POs that are QBO-ready and pre-reviewed by sales reps before reaching Accounting — eliminates duplicate setup
- Direct Accounting access to CAD and USD RBC VISA statements via RBC Express
- Centralized commission management platform for MONEX: Phorge-integrated or custom; deal linkage by MONEX number; automated deal closure; commission approvals tracked centrally; paid commission list stored in one place
- Commission platform for WeVend: linked to the future WeVend database; shared access for Sales and Accounting; auto-generate commission lists from invoice data
- Outlook automation to auto-forward Clover payment confirmation emails to the correct sales reps and directors — eliminates manual forwarding
- Centralized approval workflow for invoices and expenses: automated reminders, approval visibility, audit trail
- Unified employee expense platform (e.g., Ramp or Expensify): single submission point, approval workflow, receipt linkage, audit trail
- Real-time visibility into Marketing, IT, and Sales card spend via RBC Express daily — eliminates month-end surprises

---

## 8. Upcoming Changes

- **Entity separation (QBD / QBO):** The full separation of Wevend from MONEX in both QuickBooks Desktop (Canadian entities) and QuickBooks Online (U.S. entities) is in progress, but the timeline for completion is unknown. **WeVend employees are currently fully under the POS (MONEX Canadian) entity in QBD — payroll has NOT been migrated to a separate WeVend entity.** When the decision is made to move WeVend employees to their own WeVend QBD setup, it will require: setting up all WeVend employees in Wevend QBD, creating new GL accounts, adjusting the chart of accounts, and mirroring the setup in QBO for U.S. entities. No timeline has been set by leadership. This will happen on top of normal daily operations with a 2-person team.
- **WeVend new database:** A new WeVend deal management database is planned but not yet in place. Once available, it will define the commission workflow and tracking structure for WeVend. Accounting has no visibility into this yet.
- **New hires:** Anticipated as Wevend scales. Each new hire adds payroll setup, employee records, and lifecycle management work.
- **More sales volume:** Growth in terminal activations will directly increase invoice volume, commission calculations, A/R management, and year-end filing complexity.
- **System changes:** Expected as part of the scale-up and entity separation — specifics not yet defined for Accounting.

---

*This profile was generated during a Department X-Ray session on March 25, 2026. It should be reviewed quarterly and updated as the department evolves.*
