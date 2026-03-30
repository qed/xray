# Monex IT — Department Profile
**Date:** March 26, 2026
**Interviewed:** Jeffrey Zhu, IT Manager
**Interviewer:** Claude (Department X-Ray)

---

## 1. Department Identity

### Mission
Monex IT provides the technical backbone for MonexGroup's business operations — managing the systems, data pipelines, and reporting infrastructure that enable the company to process transactions, manage customer relationships, and make data-driven decisions.

### Scope
- Receiving, parsing, and processing external credit provider reports into the MySQL database
- Operating and maintaining the internal CRM system and lead management system
- Supporting customers through the customer portal
- Generating company-level and departmental reports
- Providing ad hoc data pulls to internal departments on request
- Managing data integrity and performing cleanup/corrections across systems
- Implementing function enhancements requested by internal departments and customers

### Not In Scope
- Directly modifying source data at the point of entry (corrections should go back to the originating team)
- Managing terminal status — Monex IT does not manage terminals directly; terminal-related queries must be answered using merchant data instead
- **Gray area they end up handling anyway:** Dirty data cleanup — teams often assume IT can simply fix database records, bypassing the original data input source. IT ends up absorbing this work despite it not being their responsibility.

### WeVend / MonexGroup Split
- **90% MonexGroup / 10% WeVend**
- The 10% WeVend work is support-oriented. No team members are dedicated exclusively to one business unit; all three members work across both as needed.

### Contribution to 2026 Goals
Monex IT's report processing pipeline and billing infrastructure directly support revenue operations — without it, customer charges cannot be calculated, EFT files cannot be generated, and accounting cannot process payments. As Wevend scales toward 10,000 terminals, the volume of transaction data, customer accounts, and reporting requests will multiply. The department's ability to automate intake, reporting, and data validation will be a direct enabler of growth.

### Recent Changes
No significant changes to scope, structure, or responsibilities in the last 12 months.

---

## 2. People & Roles

### Team Roster

| Name | Title | Key Responsibilities | Time Allocation | WeVend/MonexGroup |
|---|---|---|---|---|
| Jeffrey Zhu | IT Manager | Daily operations management, customer charge processing (EFT releases), company-level reporting, ad hoc data requests, feature request intake & triage | Management 40%, Reporting 30%, Charge Processing 20%, Other 10% | Across both |
| Rojeen | Senior Developer | CRM system maintenance & configuration, lead management system operations, internal department support | CRM 35%, Lead Management 30%, Internal Support 25%, Ad hoc 10% | Across both |
| MengKai | Senior Developer | Customer portal development & maintenance, customer-facing support requests, internal coordination | Portal Dev & Maintenance 45%, Customer Requests 35%, Internal Coordination 10%, Ad hoc 10% | Across both |

### Reporting Structure
All three report to Jeffrey Zhu (IT Manager). Jeffrey is the single point of intake for all requests — both ad hoc data pulls and feature enhancements — before distributing work to the team.

### Single Points of Failure
The team has a strong knowledge-sharing culture and deliberately cross-trains. No single departure would cause a complete operational failure. However, there would be a ramp-up period for the person absorbing the departing team member's active context.

| Person | What Only They Know/Do | Risk If They Leave |
|---|---|---|
| Jeffrey Zhu | Deep system logic embedded in code — parsing rules, billing calculation logic, pipeline architecture | Team would need to reverse-engineer logic from code and logs; Jeffrey is actively mitigating this with AI-assisted documentation |
| Jeffrey Zhu | EFT file release process and exception handling for billing day | Short-term disruption to billing cycle; recoverable but time-sensitive |

### Communication Patterns
- **Primary channels:** Email and in-person conversation
- Work is assigned informally through direct communication — no formal ticketing system
- Team is small enough (3 people) that coordination happens organically
- No regular standups documented; coordination is ad hoc

---

## 3. Tools & Systems

### Tool Stack

| Tool | Purpose | Primary Users | Frequency | Notes |
|---|---|---|---|---|
| MySQL | Primary database — querying, reporting, data cleanup, billing calculations | All three | Daily | All critical data lives here; most manual workflows start with a MySQL query |
| Visual Studio | Development environment for CRM, lead management system, customer portals | All three | Daily | Primary coding environment |
| SVN (Subversion) | Version control for code collaboration | All three | Daily | Managing code across the team |
| Microsoft Excel | Ad hoc reporting, data formatting, quick analysis | Jeffrey primarily | Daily | Middle layer between MySQL and Outlook in many workflows |
| Microsoft Outlook | Communication and report delivery | All three | Daily | Final delivery channel for most reports and data outputs |
| GitHub Copilot | AI coding assistance — autocomplete, troubleshooting, reducing repetitive dev work | All three | Daily | Integrated into Visual Studio |
| Claude | AI planning and documentation — brainstorming, structuring solutions, writing docs | All three | Regular | Used for planning and tribal knowledge documentation |
| Internal CRM System | Customer relationship management | Rojeen (owner), all internal departments (users) | Daily | Built and maintained by Rojeen |
| Lead Management System | Lead tracking and flow management | Rojeen (owner), Sales | Daily | Integrated with CRM; built and maintained by Rojeen |
| Customer Portal(s) | Customer-facing self-service | MengKai (owner), customers | Daily | Multiple portals; built and maintained by MengKai |

### Missing Tools
Nothing specific identified at the time of interview — Jeffrey noted this will likely become clearer as workflows are analyzed further.

### Underused Tools
None identified.

### Data Locations
- **Transaction data:** MySQL (populated by the 5-service report processing pipeline)
- **Customer & fee structure data:** CRM system (MySQL-backed)
- **Lead data:** Lead management system
- **Reports:** Generated into Excel, distributed via Outlook
- **Code:** SVN repository

### Integration Gaps
Most data movement between systems is **manual**. The primary manual pipeline is:

> MySQL → Excel (formatting) → Outlook (delivery)

This applies to ad hoc reports, company-level reports, and most data pulls. There is no automated data bridge between MySQL and Excel or between reporting and communication tools.

### Access Risks
Not explicitly documented — follow-up recommended to confirm whether any tools or systems have single-admin-only access.

---

## 4. Workflows & Processes

### 4.1 Outside Report Processing

**Trigger:** Daily and monthly reports received from external credit providers
**Owner:** Jeffrey Zhu (pipeline management); automated services handle execution
**Frequency:** Daily (some providers) + monthly cycles | **Volume:** 7 providers
**Time:** Largely automated; manual intervention only on failures
**Tools Used:** Automated pipeline (5 services), MySQL

**Sources:**
- FiServ US, FiServ CA, Chase, Elavon, Everlink, TSYS, Wevend
- Format: Mostly CSV or Excel

**Automated Pipeline Steps:**
1. **Retrieving Service** — Downloads files from source (email attachments, FTP, etc.)
2. **Preparse Service** — Identifies and prepares each file for parsing
3. **Parse Service** — Converts data into MySQL
4. **Prereport Service** — Checks and identifies which reports need to be generated
5. **Report Service** — Creates final reports

**Inputs Required:** Files delivered by external providers on schedule
**Output/Deliverable:** Parsed transaction data in MySQL; reports generated and available for downstream use

**Common Exceptions:**

| Exception | Frequency | Manual Effort | Owner |
|---|---|---|---|
| Parse failure due to provider file format change | 3–5 times/year | 1–2 days of code modification to update parser | Jeffrey |
| File not received on time | ~Monthly | Contacting the provider, waiting for response and reprocessing | Jeffrey |
| File not received — resolution time | Variable | Several hours to several days depending on provider | Jeffrey |

**Documentation Status:** Pipeline architecture is known to Jeffrey; partially tribal knowledge. AI-assisted documentation in progress.
**WeVend vs MonexGroup Differences:** Wevend is one of the 7 report providers. Processing logic is the same; Wevend reports feed MonexGroup billing.

---

### 4.2 Customer Charge Processing (EFT Billing)

**Trigger:** Monthly billing cycle
**Owner:** Jeffrey Zhu
**Frequency:** Monthly | **Volume:** 4 EFT files per billing cycle
**Time:** Automated calculation; 1–2 hours review on a clean month; up to half a day when there are discrepancies
**Tools Used:** CRM (customer data), MySQL (transaction data), billing system (automated), Outlook (delivery to Accounting)

**Fee Types:**
- Per-transaction count fees
- Percentage-based transaction volume fees
- Fixed monthly fees

**Steps:**
1. **Read customer information** — Automated pull of customer data and fee structures from CRM
2. **Read transaction information** — Automated pull of parsed transaction data from the report pipeline
3. **Combine and calculate** — Automated matching of customer accounts with transaction activity; fee structure applied; total charge calculated
4. **Create EFT file** — System generates the electronic funds transfer file
5. **Jeffrey reviews exceptions** — Manual review of any discrepancies, data issues, or unexpected transaction volumes
6. **Release EFT files** — Jeffrey releases all 4 EFT files (must happen within one day)
7. **Send to Accounting** — EFT file delivered to accounting department for processing

**Inputs Required:** Processed transaction data from Step 4.1; complete and accurate customer fee structures in CRM
**Output/Deliverable:** 4 EFT files delivered to Accounting
**Common Exceptions:** Discrepancies between expected and actual transaction volumes; data issues from upstream; customers with unusual fee structures. These trigger investigation before release and can extend the process to half a day.
**Documentation Status:** Partially tribal knowledge — billing logic embedded in code.
**WeVend vs MonexGroup Differences:** Primarily a MonexGroup process.

---

### 4.3 Ad Hoc Report Requests

**Trigger:** Request received via email or in-person from any internal stakeholder
**Owner:** Jeffrey Zhu (intake and clarification); ~50% assigned to team after clarification
**Frequency:** ~7 requests/week | **Volume:** ~7/week
**Time:** 3–4 hours total per request (2 hours data work + 1–2 hours back-and-forth clarification); some requests take days (e.g., SIM card bill verification took 4 days)
**Tools Used:** MySQL, Excel, Outlook

**Steps:**
1. Request arrives via email or in-person — often underspecified
2. Jeffrey interprets the request and identifies what's actually needed
3. Back-and-forth with requester to clarify ambiguity, constraints, and scope
4. Jeffrey either executes the query himself OR assigns to a team member (~50/50 split)
5. Query run in MySQL
6. Data formatted in Excel
7. Sent via Outlook

**Inputs Required:** Clear understanding of what's being asked; access to relevant MySQL data
**Output/Deliverable:** Data file or formatted report delivered via email

**Common Exceptions:**
- Requesters ask for terminal status data (e.g., "how many active terminals") — Monex IT doesn't manage terminals; must redirect to merchant data instead
- Requests require cross-referencing multiple systems (e.g., SIM serial # → terminal ID → CRM → billing system)
- Test records mixed into production data (e.g., test SIMs not tracked separately)
- Data gaps where another provider handles billing (no record in Monex systems)

**Case Study — SIM Card Bill Verification:**
Scott (Operations Manager) requested help verifying the SIM card bill. This required:
1. Using SIM card serial numbers to identify terminal IDs
2. Checking CRM for customer information
3. Checking billing system for charge records
4. Investigating exceptions (test SIMs not tracked; some terminals billed by other providers)
5. Multiple meetings to work through exception types and root causes
**Total time: 4 days** (approximately half data work, half meetings)

**Documentation Status:** No standard templates or documented query library. Each request is handled from scratch.
**WeVend vs MonexGroup Differences:** Requests come from across both BUs; logic differs by context.

---

### 4.4 Function Enhancements

**Trigger:** Request from internal department (Admin, Operations, Sales) or customer
**Owner:** Jeffrey Zhu (intake, scoping, assignment); Rojeen or MengKai (execution)
**Frequency:** 3–5 requests/month | **Volume:** 3–5/month
**Time:** Days to weeks depending on complexity; 40% of total time spent on back-and-forth clarification, 30% coding, 30% testing
**Tools Used:** Visual Studio, SVN, communication via email/in-person

**Steps:**
1. Request arrives informally via email, instant messaging, or in-person conversation
2. Jeffrey interprets the request — requester typically presents a solution rather than a problem
3. Jeffrey identifies the real underlying need behind the request
4. Jeffrey explains system constraints and what's feasible
5. Back-and-forth to explore alternative approaches
6. Alignment on final approach
7. Jeffrey assigns to Rojeen (CRM/lead system) or MengKai (portal) depending on scope
8. Development, testing, and delivery

**Request Sources by System:**
- CRM features → Admin and Operations teams
- Lead system features → Sales team
- Portal features → Customers and customer-facing teams

**Inputs Required:** Clear understanding of what problem the requester is actually trying to solve (often requires discovery)
**Output/Deliverable:** Deployed feature or enhancement
**Common Exceptions:** Requesters don't understand system capabilities and ask for infeasible solutions; requirements change mid-development; testing reveals unexpected issues.
**Documentation Status:** No formal intake process or requirements documentation. Informal and conversational.

---

### 4.5 Data Management

**Trigger:** Ongoing — issues discovered through monitoring, or flagged by other departments
**Owner:** Jeffrey Zhu and team
**Frequency:** Ongoing / daily | **Volume:** Variable
**Time:** 6–8 hours/week across the team
**Tools Used:** MySQL

**Activities:**
- **Dirty data cleanup** — Correcting incorrect or misformatted data entries (primarily from internal data entry errors)
- **Data validation** — Verifying accuracy and completeness of data across systems
- **Manual adjustments** — Direct database corrections when required
- **Integrity monitoring** — Ongoing checks to ensure data remains accurate and usable

**Primary Source of Issues:** Internal data entry errors (majority); external report data issues (minority)

**Inputs Required:** Identification of data issue; access to relevant tables in MySQL
**Output/Deliverable:** Clean, accurate data in the database
**Common Exceptions:** Teams assume IT can modify database directly without going back to original data source — this creates a pattern where IT absorbs cleanup work that should be prevented upstream.
**Documentation Status:** No documented data quality standards or validation rules.

---

## 5. Handoffs & Dependencies

### Inbound (What Monex IT Receives)

| From Department | What | Format | How | Common Problems |
|---|---|---|---|---|
| Admin Team | Data, requests, source records for CRM and systems | Various | Email, in-person | Missing fields, typos, inconsistent formatting |
| Sales Team | Lead data, enhancement requests, data pull requests | Various | Email, in-person | Unclear requirements, incomplete context |
| External Providers (7) | Daily/monthly transaction report files | CSV, Excel | Email attachment, FTP | Late delivery (~monthly), format changes (3–5x/year) |

### Outbound (What Monex IT Delivers)

| To Department | What | Format | How | Cadence |
|---|---|---|---|---|
| Accounting | EFT billing files | EFT format | Email/file transfer | Monthly |
| Operations | Reports, data pulls, ad hoc requests | Excel, email | Outlook | On request |
| Sales | Reports, lead data, ad hoc requests | Excel, email | Outlook | On request |
| Marketing | Reports, data pulls | Excel, email | Outlook | On request |
| All departments | Ad hoc data requests | Excel, email | Outlook | On request (~7/week) |

### Blocking Dependencies
IT's billing cycle depends on clean, complete transaction data from the external report pipeline. If reports are late or malformed, the EFT billing cycle may be delayed. This is rare but happens approximately monthly.

### Cross-Functional Gaps
- Dirty data cleanup falls into a gray area — it originates from other teams' data entry but ends up being cleaned by IT
- Unclear request clarification is unowned — no standard form or process exists to force requesters to specify their actual needs before submitting

### Most Frequent Interactions (Ranked)
1. Operations (Scott's team — frequent ad hoc requests)
2. Sales (lead system requests, data pulls)
3. Admin (CRM data, feature requests)
4. Accounting (monthly EFT delivery)
5. Marketing (periodic reports)

---

## 6. Pain Points & Bottlenecks

### Time Sinks

| Pain Point | Time Cost (per week) | Who It Affects | Root Cause |
|---|---|---|---|
| Ad hoc report requests | ~14–18 hours/week total (Jeffrey + team) | Jeffrey (intake + ~50% execution), Rojeen & MengKai (~50% execution) | No self-serve reporting; requesters can't access data themselves; requests often underspecified |
| Feature request back-and-forth | ~4 hours/week (~16 hrs/month) | Jeffrey | Requesters don't understand system capabilities; no structured intake process |
| Dirty data cleanup | 6–8 hours/week | Full team | No data validation at point of entry; other teams create errors that IT must fix |
| Parse failure code fixes | ~3–10 days/year (3–5 incidents × 1–2 days each) | Jeffrey | External providers change file formats without notice |
| Late report follow-up | Several hours to days/month | Jeffrey | External providers miss delivery deadlines |

### Bottlenecks
- **Jeffrey as single intake point** — All ad hoc requests and enhancement requests flow through Jeffrey for clarification before being delegated. As volume grows, this becomes a personal bottleneck.
- **Back-and-forth clarification** — No intake validation means unclear requests waste time before work can start.
- **Manual MySQL → Excel → Outlook pipeline** — No automation between systems forces manual formatting and delivery of every report.

### Error-Prone Areas
- External report parsing: format changes cause parse failures that must be manually diagnosed and fixed
- Billing exceptions: discrepancies in transaction volumes or customer fee structures can delay EFT release
- Dirty data: internal entry errors propagate into reports and billing calculations if not caught

### Scaling Risks
As Wevend grows from ~1,500 to 10,000 terminals:

| Risk | Current Impact | Impact at Scale |
|---|---|---|
| Ad hoc report volume | 7 requests/week, 14–18 hrs/week | Requests will scale with terminal/customer count; could become unmanageable without automation |
| Back-and-forth on requests | 40% of feature time, ~16 hrs/month | More departments, more requesters, more ambiguous asks — the intake problem multiplies |
| Dirty data volume | 6–8 hrs/week | More transactions = more data quality issues entering the system |
| Jeffrey as intake bottleneck | Manageable now at 7/week | Will break at higher volume without a structured intake layer |
| Billing EFT processing | 4 EFT files, 1–2 hrs on clean month | More customers = more exceptions = longer review time per billing cycle |

### Tribal Knowledge Risks
- **Parsing logic** — The rules for how each provider's files are handled live primarily in code and Jeffrey's memory. A format change or new provider onboarding requires Jeffrey's direct involvement.
- **Billing calculation logic** — The fee structure application and exception rules are embedded in the billing code. Not fully documented.
- **System architecture** — The overall design of the 5-service pipeline and how the systems interact is partially undocumented.

Jeffrey is actively mitigating this using Claude to review code and generate documentation.

---

## 7. The Wish List

- **AI intake agent** that validates incoming requests (both ad hoc data requests and feature enhancement requests) before they reach the team — ensuring requests are clear, scoped, and achievable within current resources before any human time is spent on clarification
- Automated data validation at the point of entry to prevent dirty data from reaching the database in the first place
- Better automation between MySQL, reporting tools, and delivery (reduce or eliminate the manual MySQL → Excel → Outlook pipeline)

---

## 8. Upcoming Changes

No anticipated changes to team structure, tools, or scope were identified during this interview.

---

*This profile was generated during a Department X-Ray session on March 26, 2026. It should be reviewed quarterly and updated as the department evolves.*
