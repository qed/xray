# Operations — Department Profile
**Date:** March 25, 2026
**Interviewed:** Scott Scheirich, Director of Operations
**Interviewer:** Claude (Department X-Ray)

---

## 1. Department Identity

### Mission
The Operations department is responsible for turning strategy into execution by running the company's day-to-day activities efficiently and reliably. Its core mission is to ensure that people, processes, and systems work together to deliver products or services consistently, at scale, and with minimal friction.

### Scope
Operations owns the full execution layer of Wevend/MonexGroup, including:
- Merchant and partner onboarding intake, documentation, and system setup (Admin)
- Terminal programming, configuration, deployment, and swap execution (Deployment)
- Customer service and technical support for live merchants (CS/Support)
- Hardware inventory lifecycle: intake, tracking, reconciliation, and redeployment (Inventory Management)
- RMA processing, repair coordination, and hardware recovery (RMA)
- Collections: contract cancellation enforcement, payment recovery, and 3rd party agency management
- Legal: trademark management, superior court actions, and contract filing (currently held by Director)
- Field logistics: equipment delivery, supply pickups, and RMA returns (Jack Talany)

### Not In Scope
- Merchant and partner onboarding (post-sale intake through live readiness) — this process is being automated by another department and has been formally handed off
- Product engineering and development (escalated via WeVend Jira)
- Financial accounting (handled by Accounting; Nancy provides payment rejection files to Brian)

### WeVend / MonexGroup Split
The work is split approximately **50/50** between WeVend and MonexGroup. The work is similar in structure but differs in the following ways:

| Dimension | WeVend | MonexGroup (Monex) |
|---|---|---|
| **Customer Type** | ISVs, Distributors, multi-operator partners | Direct merchants, typically 1–2 locations |
| **Vertical Focus** | Vending, Smart Vending | Car Wash (heavy focus), Vending |
| **System of Record** | WeTrack | Monex Phorge |
| **Terminal Management** | CasHUB (WeVend enterprise) | CasHUB (MonexGroup enterprise — separate account) |
| **Ticketing** | WeVend Jira | MOTRS |
| **Processor (US)** | TSYS via ELAPP | Fiserv CoPilot |
| **Processor (CA)** | Fiserv Client360, Everlink | Fiserv Client360, Everlink, Fiserv MarketPlace, Fiserv MSO, Elavon SAT |

No team members focus exclusively on one business unit; all staff serve both.

### Contribution to 2026 Goals
Operations is the execution engine behind Wevend's 2026 targets (10,000 active terminals, $300K MRR). Specifically:
- **Terminal deployments** — Operations programs, configures, and deploys the hardware that generates MRR. Currently processing ~739 terminals/month across ~100 deals and 120+ MIDs.
- **Customer service** — Retaining merchants and resolving issues quickly prevents attrition and protects MRR.
- **Inventory management** — Ensuring sufficient, tracked stock enables the deployment pace required to hit 10,000 active terminals.
- **Collections** — Protecting the $30,000/month recovery target and enforcing contract terms safeguards margin.
- **Cross-departmental support** — Operations supports Sales, Finance, and Technical teams, removing friction from the growth engine.

### Recent Changes
- The paralegal role was vacated, and legal responsibilities (trademarks, superior court actions, contract filing) were absorbed by Scott Scheirich.
- Terminal programming has been centralized — distributors no longer program their own terminals. This was implemented to eliminate firmware and configuration errors caused by distributors not following pre-loading protocols.
- Castles has added resources to improve RMA SLAs from a historical 3–6 months to a target of 30–60 days.
- Castles has provided 100 spare terminals (50 Pay Pro, 50 Pay Pro Max) as a stop-gap RMA buffer, allowing merchants to receive replacement units while failed terminals are being repaired.
- A Zendesk daily issue digest (via Claude) is currently being developed to give leadership real-time visibility into recurring support issues.

---

## 2. People & Roles

### Team Roster

| Name | Title | Key Responsibilities | Est. Time Allocation | WeVend/MonexGroup |
|---|---|---|---|---|
| **Scott Scheirich** | Director of Operations | Department leadership, US deployment oversight, inventory management, legal (trademarks, court actions, contracts), cross-departmental support | Operations leadership: ~40%, US Deployment: ~20%, Legal: ~15%, Inventory: ~15%, Other: ~10% | 50/50 |
| **Laurie** | Admin Manager | US deployment orders (Castles shared folder), onboarding intake, documentation validation, system setup (CasHUB, Fiserv, Everlink), inventory tracking, cancellations, reconciliation, reporting | Admin: ~60%, Deployment: ~20%, Inventory: ~20% | 50/50 |
| **Suzy** | Admin | Onboarding intake, profile changes, terminal add requests, system setup, reporting | Admin: ~100% | 50/50 |
| **Ngan** | Admin | Onboarding intake, fillable forms (sole owner), Teleleads management, system setup | Admin: ~100% | 50/50 |
| **Robin Blair** | Customer Service Supervisor | Inbound/outbound CS, WeVend Support oversight, RMA intake and oversight (Jotform/Castles), SIM card status checks, process documentation, email template creation, training manuals, Canadian terminal programming backup | CS/Supervision: ~50%, WeVend Support: ~25%, RMA: ~15%, Programming: ~10% | 50/50 |
| **Janice Smikle** | Team Lead, Customer Service | Inbound calls (primary focus: billing and profile changes), courtesy calls, welcome calls, profile changes, billing inquiries | CS: ~100% | Primarily Monex |
| **Rajesh Chowdhury** | Lead Technical Support | Technical support (car wash, vending, kiosks), CasHUB configurations, firmware/application updates, distributor support, Canadian terminal programming, WeVend Jira escalations | Tech Support: ~80%, Programming: ~20% | Primarily WeVend |
| **Roxanne Felix** | Product Support Engineer | WeVend support (primary handler), inbound support tickets, technical coordination, Zendesk management | Support: ~100% | Primarily WeVend |
| **Brian Griffiths** | Collections & Deployment Manager | Collections (contract damages recovery, 3rd party agency management, payment rejections, invoice recovery), Canadian deployment oversight, RMA oversight | Collections: ~50%, Deployment: ~50% | 50/50 |
| **Jack Talany** | Onsite Technician | Equipment delivery, supply pickup, RMA returns (receiving, scanning SNs/ICCIDs), warehouse assistance | Field/Logistics: ~60%, Inventory/RMA intake: ~40% | 50/50 |

### Reporting Structure
All team members report to **Scott Scheirich**, Director of Operations.
- Robin Blair has supervisory responsibility over Janice Smikle, Rajesh Chowdhury, and Roxanne Felix.
- Brian Griffiths manages Collections independently and coordinates with Robin on RMA.
- Laurie manages Suzy and Ngan in Admin, and coordinates with Scott on deployment and inventory.

### Single Points of Failure

| Person | What Only They Know/Do | Risk If They Leave |
|---|---|---|
| **Ngan** | Fillable forms process | Forms-dependent onboarding steps stall completely |
| **Laurie** | US deployment orders (Castles shared folder process) | US terminal deployments stop — ~739 terminals/month at risk |
| **Brian Griffiths** | All of Collections, Canadian deployment oversight, RMA tracking coordination | Collections halts (no recovery of contract damages), Canadian deployments exposed, RMA pipeline unmanaged |
| **Scott Scheirich** | All legal responsibilities (trademarks, court actions, contract filing) | Legal matters unmanaged — no backup |
| **Scott Scheirich** | US deployment oversight and coordination | Coverage partially handled by Laurie, but strategic oversight lost |

### Tribal Knowledge
- How to process US deployment orders via Castles shared folder — known only by Laurie
- Fillable forms process — known only by Ngan
- Legal file management (trademark filings, court actions, contract folder structure) — known only by Scott
- Collections history, negotiation context, and merchant relationship nuances — held by Brian
- How to reconcile Castles' weekly RMA Excel against the internal Master RMA sheet — partially tribal; done by multiple people but no documented SOP

### Communication Patterns
- **Primary tool:** Microsoft Outlook (email is the dominant communication channel for external and cross-team coordination)
- **Internal:** Microsoft Teams (implied from Zendesk/MOTRS references); shared folders for operational documents
- **Ticketing:** MOTRS (Monex), Zendesk (WeVend Support), Castles Jira Portal (RMA), WeVend Jira (technical escalations)
- **Meetings:** Regular calls with partners (Castles, Fiserv CA/US), weekly calls with Sales team to review pending applications
- **Reporting:** Shared Excel files for deployment tracking, inventory, RMA status; email distribution for reports

---

## 3. Tools & Systems

### Tool Stack

| Tool | Purpose | Primary Users | Frequency | Notes |
|---|---|---|---|---|
| **CasHUB (Castles TMS)** | Terminal management system — setup, configuration, assignment, parameter management | Robin, Rajesh, Roxanne, Brian, Scott | Daily | WeVend and MonexGroup run as separate enterprises within the same platform |
| **Monex Phorge** | Merchant/partner onboarding and compliance — core account records, agreements, documentation; feeds downstream systems | Admin, CS | Daily | Upstream system for Monex-side accounts |
| **WeTrack** | System of record for WeVend — ISOs, ISVs, merchants, pricing, billing, contractual data | Admin, CS, Operations | Daily | Governs how WeVend accounts are set up and billed |
| **WeCenter** | Customer-facing management portal — transactions, device management, pricing, reports, user admin for post-deployment merchants | CS, Support | Daily | Merchant/partner self-service portal |
| **MOTRS** | Monex internal ticketing system | CS, Support | Daily | Monex-side ticket management |
| **Zendesk** | WeVend support ticketing | Roxanne, Robin | Daily | Used for inbound calls, welcome calls, courtesy calls |
| **Fiserv CoPilot** | US payment processor portal (Fiserv) | Admin, CS | Daily | Profile changes, closures, risk inquiries |
| **Fiserv Client360** | Canadian payment processor portal (Fiserv) | Admin, CS | Daily | Profile changes, AirServ/Coinamatic management |
| **Fiserv MarketPlace (CA)** | Canadian Fiserv marketplace management | Admin | Regular | — |
| **Fiserv MSO (CA)** | Canadian Fiserv MSO management | Admin | Regular | — |
| **ELAPP-TSYS (US)** | TSYS processor system for US accounts | Admin, CS | Daily | Profile changes submitted via email to TSYS |
| **Elavon SAT (CA)** | Elavon processor portal for Canadian accounts | Admin | Regular | — |
| **Everlink System (CA)** | Canadian payment gateway | Admin | Daily | MID/TID management, AirServ/Coinamatic |
| **Microsoft Outlook** | Primary communication — email, calendar, team coordination | All staff | Daily | Dominant communication channel |
| **Shared Folders** | Internal document storage — master deployment chart, inventory files, RMA logs, temp live merchant folders | All Operations | Daily | No integrated system; shared folder structure is critical operational infrastructure |
| **WeVend Jira** | Technical escalation ticketing to WeVend product/engineering | Roxanne, Robin, Rajesh | As needed | For issues that exceed frontline support capability |
| **Castles Jira Portal** | RMA request submission to Castles | Robin | As needed | Robin creates all RMA requests via Jotform into Castles |
| **KPN Portal** | SIM card status verification | Robin, Roxanne | As needed | ICCID/SIM connectivity checks |
| **KLM Portal** | KioSoft programming (ownership changes) | Tech Support | As needed | — |
| **Castles Shared Folder (Excel)** | US terminal order management and deployment tracking | Laurie | Daily | US deployment orders submitted via Excel in shared folder |
| **SharePoint** | Canadian terminal order management | Admin | Daily | Canadian deployment orders submitted via SharePoint folder |

### Missing Tools
No specific missing tools were identified. However, the following automation gaps represent unmet needs:
- A real-time operational dashboard (deployment status, RMA pipeline, inventory health, support ticket trends)
- An automated serial number validation tool that checks SNs against inventory in real time before deployment forms are submitted
- An automated cross-system reconciliation tool to sync Castles' inventory/RMA Excel reports with internal master sheets

### Underused Tools
None identified.

### Data Locations

| Data Type | Lives In |
|---|---|
| WeVend merchant/account records | WeTrack |
| Monex merchant/account records | Monex Phorge |
| Terminal assignments and configurations | CasHUB |
| US inventory status | Castles shared Excel workbook (external) |
| Canadian inventory | Office warehouse + shared internal Excel chart |
| Master deployment tracking (all shipments) | Internal shared folder (Excel) — Scott, Laurie, Robin have access |
| RMA status | Master RMA Excel (internal) + Castles weekly RMA Excel (external) + Jack's intake log |
| Support tickets (Monex) | MOTRS |
| Support tickets (WeVend) | Zendesk |
| Collections history | Brian's internal database/files |
| Legal documents | Scott's files (structure not documented) |
| SIM/ICCID data | KPN Portal + Jack's inventory intake scans |

### Integration Gaps
- **No automated sync** between Castles' weekly Excel reports and the internal Master RMA sheet — manual copy/paste required
- **No automated sync** between Castles' inventory workbook and Wevend's master deployment/inventory chart
- **No real-time serial number validation** — SNs are manually cross-referenced across systems
- **No automated deployment form enforcement** — invalid/missing SNs are caught manually after submission, requiring follow-up with Sales/Admin
- **No automated reconciliation** between physical inventory counts, manufacturer reports, and deployment records
- **CasHUB ↔ WeTrack/Phorge** — no automated bidirectional sync; system records require manual updating across platforms

### Access Risks
- Legal files (trademarks, court actions, contracts) — accessed only by Scott; no documented structure or backup
- Castles shared folder (US deployment orders) — managed primarily by Laurie; Robin is backup for Castles orders only

---

## 4. Workflows & Processes

### 4.1 Terminal Deployment & Swap Execution

**Trigger:** Receipt of a completed Deployment Form with valid serial numbers. Four types: (1) new merchant deployment, (2) add-on terminals to existing merchant, (3) terminal swap/replacement, (4) partner/ISV pre-staged deployment.
**Owner:** Scott Scheirich (US), Brian Griffiths (Canada); Laurie assists with Admin side; Robin provides backup on Castles orders
**Frequency:** Daily | **Volume:** ~739 terminals/month across ~100 deals and 120+ MIDs
**Time:** 15–20 minutes hands-on per terminal (when no issues); up to 60+ minutes if firmware update required
**Tools Used:** CasHUB, WeTrack, Castles shared folder (US), SharePoint (CA), email, shared deployment Excel chart

**Steps:**
1. Deployment Form received with serial number(s), merchant name, model, and deployment type
2. Ops validates serial numbers — confirms SNs exist in inventory, are not already assigned or duplicated
3. Ops confirms MID/TID exists and is synced to the gateway (VAR sheet must exist)
4. Terminal is assigned or transferred into the correct merchant enterprise in CasHUB
5. Correct application profile and parameters applied (or cloned from existing terminal for swaps)
6. Terminal is programmed — application loaded, merchant-specific parameters applied, gateway connectivity confirmed
7. Validation checks: terminal appears under correct merchant, parameters match, no duplicate assignments
8. Terminal packaged and shipped to merchant, or released for partner pickup/drop-ship, or activated remotely
9. Serial number tied to shipment; tracking number recorded; merchant/partner notified
10. Go-live confirmed when terminal connects, appears correctly in WeCenter, and can process a transaction
11. For swaps: failed terminal flagged for RMA; inventory state updated; replacement becomes the active asset

**Inputs Required:** Completed Deployment Form (SN, merchant name, model, deployment type), approved MID/TID, VAR sheet, available terminal in inventory
**Output/Deliverable:** Live terminal processing transactions under the correct merchant in WeCenter
**Common Exceptions:** Invalid/reused SNs (historically caused by distributors; mitigated by centralized programming), firmware update required (~45 additional minutes), missing deployment form elements requiring re-request from Sales/Admin
**Documentation Status:** Partially documented; CasHUB training recording exists (Sandstar training video). No comprehensive written SOP.
**WeVend vs MonexGroup Differences:** Same core process; managed under separate CasHUB enterprise accounts. Canadian orders submitted via SharePoint; US orders via Castles shared folder.

---

### 4.2 RMA & Hardware Recovery Management

**Trigger:** Merchant reports a terminal issue that cannot be resolved through frontline troubleshooting (firmware check, app version check, network connectivity check)
**Owner:** Robin Blair (intake and Castles coordination); Brian Griffiths (oversight and tracking); Jack Talany (physical receipt of returned terminals in Canada)
**Frequency:** Ongoing | **Volume:** Not quantified (tracked in Master RMA sheet)
**Time:** Variable — Robin creates RMA in Jotform/Castles (minutes); physical return transit varies; Castles repair/replace SLA: target 30–60 days (historically 3–6 months)
**Tools Used:** Jotform (RMA request to Castles), Castles Jira Portal, Master RMA Excel (internal), Castles weekly RMA Excel (external), Jack's intake log, email

**Steps:**
1. Merchant calls CS; frontline troubleshooting begins (firmware, app, network)
2. If unresolved, merchant is directed to complete a Jotform to initiate RMA
3. Robin submits the RMA request directly to Castles via Jotform; receives RMA number
4. Robin provides RMA number to merchant
5. Merchant labels terminal with RMA case number
6. Merchant ships terminal:
   - US: directly to Castles
   - Canada: to Wevend head office first, then forwarded to Castles US
7. Jack receives and logs returned Canadian terminals; scans SNs and ICCIDs; updates Jack's intake log
8. Castles receives terminal; logs it in their RMA Excel (weekly reporting provided to Wevend)
9. Wevend team manually copies/pastes Castles report + Jack's log into Master RMA Excel
10. Castles repairs or replaces terminal (if in warranty — 1 year); quotes additional cost if out of warranty
11. If in warranty: repaired/replacement unit returned to merchant (or to Wevend's RMA refurb pool)
12. If out of warranty: cost presented to merchant; merchant decides whether to proceed
13. Replacement terminal programmed and deployed from 100-unit stop-gap buffer (if available) while repair is in progress
14. Repaired units returned to RMA refurb pool for future deployments

**Inputs Required:** Failed terminal, completed Jotform, RMA number from Castles
**Output/Deliverable:** Repaired or replaced terminal live with merchant; Master RMA sheet updated
**Common Exceptions:** Out-of-warranty situations (cost recovery process not yet formalized — will become more frequent as warranties expire); delays in Castles processing (historically 3–6 months, improving to 30–60 days); SNs not logged correctly on return
**Documentation Status:** Partially documented. No comprehensive end-to-end SOP. Process largely tribal.
**WeVend vs MonexGroup Differences:** Same process; Canada has additional step (returns go to Wevend head office first before Castles).

---

### 4.3 Inventory Lifecycle Management

**Trigger:** Continuous — triggered by PO placement, hardware receipt, deployment assignment, RMA return, or redeployment
**Owner:** Scott Scheirich (strategic oversight, PO tracking, US), Brian Griffiths (Canada), Laurie (shipment tracking), Robin Blair (inventory chart access)
**Frequency:** Daily | **Volume:** 739+ terminals/month in/out, plus accessories
**Time:** Ongoing; varies by activity. Physical inventory checks and reconciliation: 30 minutes to several hours depending on discrepancies
**Tools Used:** Castles shared Excel workbook (US inventory), internal shared Excel master deployment chart, Jack's SN/ICCID intake log, shared folders, email

**Steps (US):**
1. Scott places PO with Castles; manually tracks PO status to confirm order placed and delivery timeline
2. Scott manually checks Castles' shared Excel workbook to verify current US inventory (terminals + accessories)
3. On shipment: Laurie tracks shipping details and tracking numbers from Castles workbook; copies into master deployment chart
4. Master deployment chart updated with: what was shipped, to whom, when, tracking number

**Steps (Canada):**
1. Castles ships inventory to ITS (3rd party storage facility)
2. Jack (and sometimes Scott) picks up hardware from ITS and transports to Wevend head office
3. Jack scans all serial numbers and ICCIDs; provides count to Scott
4. Scott cross-references received inventory against expected quantities per PO
5. If counts match, hardware is moved into office warehouse
6. Inventory added to shared chart; state tracked (in warehouse, assigned for programming, deployed, in transit, in RMA, available for redeployment)
7. Nothing leaves warehouse without Laurie or Robin adjusting the inventory chart

**Inputs Required:** PO records, Castles inventory report, physical inventory count, shipment records
**Output/Deliverable:** Accurate master deployment chart; confirmed inventory levels; availability data for deployment team
**Common Exceptions:** Count discrepancies between expected and received quantities; delayed PO fulfillment; incorrect SN/ICCID scans; items removed without chart update
**Documentation Status:** No documented SOP. Highly manual and tribal. Process depends on individual discipline.
**WeVend vs MonexGroup Differences:** Same master chart covers both. US inventory stored at Castles; Canadian inventory at Wevend head office.

---

### 4.4 Collections & Contract Recovery

**Trigger:** (1) Cancellation request received from merchant; (2) Fiserv Deactivation Report; (3) Attrition notification; (4) MOTRS ticket; (5) Accounting provides list of merchants in arrears; (6) Bank rejection files received from Nancy (Accounting)
**Owner:** Brian Griffiths (sole owner)
**Frequency:** Daily | **Volume:** Monthly recovery target: $30,000
**Time:** Varies — from minutes (uploading payment rejections) to hours (demand letters, agency handoffs, dispute resolution)
**Tools Used:** Monex Phorge, MOTRS, internal collections history database, email, Kingston Data and Credit (3rd party agency)

**Steps (Contract Cancellation with Damages):**
1. Cancellation request received via one of four sources
2. CS applies retention efforts; if unsuccessful, request passed to Brian
3. Brian reviews contract(s), revenue reports, and dashboard to calculate contract damages
4. Brian issues cancellation document for merchant to execute
5. If terms remaining: Brian calculates cost based on agreement terms (terms vary by contract)
6. Brian makes multiple collection efforts; issues 30-day deadline for payment
7. If unpaid: account transferred to Kingston Data and Credit; merchant listed on bureau

**Steps (Rejected Payments):**
1. Bank rejection file received from Nancy (Accounting)
2. Brian uploads rejections to Phorge — automatic notifications sent to merchants
3. *Opportunity identified: no automated follow-up for prior unpaid rejections*

**Steps (Outstanding Invoices):**
1. Accounting provides list of invoices 45+ days past due
2. Brian issues demand for payment with hard deadline
3. If unpaid: contract enforcement, PPSA, or legal action considered

**Inputs Required:** Contract documents, revenue reports, cancellation requests, bank rejection files (from Nancy), arrears list (from Accounting)
**Output/Deliverable:** Collected funds, cancellation documents executed, accounts transferred to agency as needed
**Common Exceptions:** Complaint/compliance escalations related to billing disputes or warranty misperceptions (Brian educates and resolves); out-of-warranty equipment cost disputes
**Documentation Status:** Partially documented internally. Process is largely tribal — Brian is the sole owner with no documented backup.
**WeVend vs MonexGroup Differences:** US cancellation/contract damage recovery is currently not pursued — intentional strategic decision given growth stage. Kingston Data and Credit is being evaluated to take over US collections.

---

### 4.5 Customer Service — Inbound Request Handling

**Trigger:** Merchant or partner contacts CS via phone or ticket (MOTRS/Zendesk)
**Owner:** Robin Blair (supervisor); Janice Smikle (billing/profile changes focus); Roxanne Felix (WeVend support focus); Rajesh Chowdhury (technical escalations)
**Frequency:** Daily | **Volume:** Not quantified (daily call and ticket volume not currently tracked in real-time)
**Time:** Not formally tracked; varies by issue type
**Tools Used:** MOTRS, Zendesk, Fiserv CoPilot, Fiserv Client360, Fiserv Commerce Center, Cardpointe, TransLink (TSYS), WeCenter, Monex Portal, CasHUB, email

**Steps:**
1. Inbound call or ticket received
2. Identity verification performed
3. Issue categorized: billing inquiry, profile change, portal access, technical issue, cancellation, risk inquiry, etc.
4. If resolvable at first contact: resolved and documented
5. If not: escalated to appropriate team (Technical Support → WeVend Jira; Risk → Fiserv/processor portals; Collections → Brian; Deployment → Robin/Brian)
6. Profile changes executed across applicable systems (Fiserv CA/US, TSYS, Everlink, Phorge, WeTrack, WeCenter)
7. Courtesy calls and welcome calls performed proactively via MOTRS

**Inputs Required:** Merchant identity verification, account details in relevant system
**Output/Deliverable:** Resolved issue or correctly routed escalation; ticket updated
**Common Exceptions:** Same questions asked repeatedly by different merchants ("how do I read my statement," "why was I charged," "when is my terminal arriving"); profile change requests with incomplete information; merchants unclear on WeCenter vs Monex portal
**Documentation Status:** Robin has created email templates and a WeVend Tech Support Guide. Training manuals exist. SOPs partially documented.
**WeVend vs MonexGroup Differences:** Janice focuses primarily on Monex inbound; Roxanne handles primarily WeVend support. Systems differ (MOTRS vs Zendesk; Phorge vs WeTrack).

---

## 5. Handoffs & Dependencies

### Inbound (What Operations Receives)

| From | What | Format | Channel | Common Problems |
|---|---|---|---|---|
| Sales | Deployment Forms with SNs | Form/email | Email | Missing/invalid SNs; incomplete deployment type; form arrives without prior system setup |
| Sales | Merchant applications for review | Email/system notification | Email, WeTrack notification | Incomplete applications; pends requiring clarification |
| Accounting (Nancy) | Bank rejection files | Excel/file | Email | Timing dependency; no automated follow-up |
| Accounting | Arrears list (merchants 45+ days overdue) | Excel | Email | Periodic; frequency not confirmed |
| Castles | Weekly RMA Excel report | Excel | Shared folder/email | Manual consolidation required; no automated sync |
| Castles | US inventory report | Excel | Shared folder | Manual reconciliation required |
| ITS (3rd party, CA) | Hardware inventory | Physical | Jack pickup | Count discrepancies; timing of shipment notifications |
| Merchants | RMA Jotforms | Jotform | Web form | Incomplete submissions; incorrect SNs on returned hardware |
| WeVend Product/Engineering | Technical issue resolution | Jira ticket updates | WeVend Jira | Response time variability |

### Outbound (What Operations Delivers)

| To | What | Format | Channel | Common Problems |
|---|---|---|---|---|
| Merchants | RMA numbers, status updates, portal credentials, welcome calls | Email/phone | Outlook, phone | Repeat inquiries for status updates; no self-service status visibility |
| Sales | Deployment status updates | Email | Outlook | Ad hoc; no automated reporting |
| Leadership (Scott) | Deployment charts, inventory status, RMA status | Excel | Shared folder | Manual; no real-time dashboard |
| Kingston Data and Credit | Collection accounts + contract backup | Email/files | Email | Manual handoff; no automated tracking |
| Castles | RMA requests, terminal orders | Jotform, Excel (shared folder) | Jotform, email | Dependency on Castles processing times |
| Accounting | Funding request approvals consolidation | Excel | Email | Manual consolidation across team files |

### Blocking Dependencies
- Operations **cannot proceed with a deployment** until: application is approved, MID/TID is created, and a valid Deployment Form with SNs is received
- Operations **cannot close an RMA** until Castles reports back on repair/replacement status
- Operations **cannot pursue US collections** until Accounting provides arrears list or cancellation source triggers Brian

### Cross-Functional Gaps
- **US contract damage recovery** — currently unaddressed due to strategic focus on growth; Kingston Data and Credit being evaluated to fill this gap
- **Out-of-warranty hardware cost recovery** — no formalized process yet; will become critical as warranties expire in the near term
- **Real-time deployment visibility for Sales** — Sales does not have self-service access to deployment status; inquiries come to Ops manually

### Most Frequent Interactions (Ranked)
1. Sales (deployment forms, app pends, deal status)
2. Castles (terminal orders, RMA, inventory)
3. Merchants (support, billing, profile changes, RMA status)
4. Accounting (payment rejections, arrears lists, funding approvals)
5. WeVend Product/Engineering (technical escalations via Jira)
6. Fiserv / Processor partners (profile changes, risk inquiries, billing)
7. Kingston Data and Credit (collections escalations)
8. ITS (Canadian inventory)

---

## 6. Pain Points & Bottlenecks

### Time Sinks

| Pain Point | Time Cost (est.) | Who It Affects | Root Cause |
|---|---|---|---|
| Manual copy/paste across deployment, inventory, and RMA Excel sheets | 1–5 hrs/day across team | Laurie, Scott, Robin, Brian, Jack | No automated sync between Castles systems and internal tracking |
| Chasing missing/invalid deployment inputs (SNs, deployment forms) | 30–90 min/day | Scott, Laurie, Admin | No upstream enforcement; form validation happens after submission |
| RMA status chasing and explanation | 30–60 min/day | Robin, CS team | No self-service RMA status visibility for merchants or internal teams |
| Manual cross-system reconciliation (SN validation across CasHUB, WeTrack, Phorge) | 1–3 hrs/day | Admin, CS | No real-time SN lookup tool; manual verification across multiple systems |
| Re-explaining the same process to merchants and internal staff | 30–60 min/day | All CS/Support | No self-service knowledge base; same questions answered repeatedly |
| Exception handling (wrong account types, access mistakes, permissions issues) | Variable | Robin, Ops | No upstream guard-rails preventing incorrect setup |
| US Inventory reconciliation (PO tracking, Castles workbook vs internal chart) | 1–2 hrs/week | Scott, Laurie | No automated sync with Castles; manual verification required |
| Legal administration (trademarks, court actions, contract filing) | ~5–10 hrs/week | Scott | No dedicated legal resource; absorbed by Director after paralegal departure |

### Bottlenecks
- **Invalid deployment forms** block the highest-volume process (739 terminals/month). Every form with a missing or invalid SN creates a stop-and-chase cycle.
- **Castles RMA SLA** (historically 3–6 months, improving to 30–60 days) — the single biggest external dependency causing merchant dissatisfaction
- **Brian Griffiths** is a single-person bottleneck for all of Collections AND Canadian Deployment — no backup exists
- **Real-time inventory visibility** — Operations cannot immediately confirm whether a specific SN exists, is available, or is already assigned without manual lookup across multiple systems

### Error-Prone Areas
- **SN validation** — invalid, reused, or unscanned SNs are submitted on deployment forms; caught manually after the fact
- **Multi-system profile changes** — changes must be executed across 4–6 systems (Fiserv CA/US, TSYS, Everlink, Phorge, WeTrack, WeCenter); manual errors occur when any system is missed
- **Inventory count discrepancies** — physical counts vs. Castles workbook vs. internal chart frequently don't match; reconciliation required
- **RMA terminal labeling** — merchants occasionally label terminals incorrectly or ship without proper RMA case numbers

### Scaling Risks
At current volume (739 terminals/month), the manual processes are straining. At 10,000 active terminals, the following will break without intervention:
- **Deployment form chasing** — SN validation and form enforcement must be automated before volume grows further; manual chasing doesn't scale
- **Inventory reconciliation** — manual cross-checking of Castles workbook + internal charts will become impossible at higher volume
- **RMA pipeline management** — Master RMA sheet consolidation (3 sources, daily copy/paste) cannot support higher RMA volume
- **CS volume** — inbound calls and emails will grow proportionally with terminal count; without self-service tools and automated responses, CS team will be overwhelmed
- **Brian as single point of failure** — Collections and Canadian Deployment cannot remain a one-person operation at scale
- **Real-time operational visibility** — leadership is currently flying blind on daily metrics; this becomes more dangerous as complexity grows

### Tribal Knowledge Risks
- **Ngan (fillable forms)** — undocumented; only she knows the process
- **Laurie (US deployment orders)** — undocumented; the specific Castles shared folder workflow is not written down
- **Brian (Collections)** — contract terms, negotiation history, agency relationship management — entirely in Brian's head
- **Scott (Legal)** — trademark filing processes, court action status, contract folder structure — undocumented, no backup

---

## 7. The Wish List

- An AI agent or automation that produces a **daily operational digest** covering: Zendesk issue volume and trends, open tickets, who's resolving what, how fast, what's outstanding and why, bottlenecks by category — without any manual effort
- **Automated deployment form validation** — a tool that checks SNs against inventory in real time before the form reaches Ops, blocking invalid submissions upstream
- **Automated cross-system reconciliation** — auto-sync between Castles' Excel workbooks (inventory + RMA) and Wevend's internal master sheets
- **Self-service RMA status portal** — merchants can check RMA status themselves without calling CS
- **Automated payment rejection follow-up** in Collections — when a rejection is uploaded to Phorge, automatic follow-up sequences are triggered for prior unpaid rejections
- **Customer self-service support** — reduce inbound call and email volume by enabling merchants to resolve common issues (portal access, billing questions, statement reading) without contacting CS
- Automated reporting for leadership covering **call stats, KPI, deployment metrics, ticket trends, inventory health, and collections status** — one dashboard, no manual effort
- A tool that allows Ops to **instantly confirm SN status** (exists, assigned, available, in RMA) across all systems without manual lookup
- Documentation of **all tribal knowledge** as formal SOPs — especially fillable forms (Ngan), US deployment orders (Laurie), legal files (Scott), and collections processes (Brian)

---

## 8. Upcoming Changes

- **Out-of-warranty cost recovery** will become a live operational challenge in the near term as the first cohort of terminals (deployed ~1 year ago) comes off warranty. A formal process for quoting and collecting these costs from merchants does not yet exist.
- **Kingston Data and Credit** is in evaluation to take over US collections/contract damage recovery — decision pending.
- **Zendesk daily issue digest** (AI-generated) is currently in development — first automation initiative underway.
- **RMA SLA improvement** — Castles has committed to 30–60 day SLAs (vs historical 3–6 months) and has added resources to support this.
- **100-unit RMA stop-gap buffer** (50 Pay Pro + 50 Pay Pro Max) is being deployed — will change how replacements are handled (merchant keeps replacement; refurb goes into pool).
- **Legal responsibilities** remain absorbed by Scott pending any future hire of a paralegal or legal resource.

---

*This profile was generated during a Department X-Ray session on March 25, 2026. It should be reviewed quarterly and updated as the department evolves.*
