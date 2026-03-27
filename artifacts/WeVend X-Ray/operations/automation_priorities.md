# Operations — Automation & Agent Priorities
**Date:** March 25, 2026
**Source:** Department X-Ray interview with Scott Scheirich, Director of Operations
**Review Cadence:** Weekly with Peter Kuperman

---

## Priority Summary

| Rank | Opportunity | Who Saves Time | Weekly Time Saved | Monthly Time Saved | Complexity | Impact |
|---|---|---|---|---|---|---|
| 1 | Daily Operational Digest | Scott, Robin, Brian | ~12.5 hrs | ~50 hrs | Low–Med | High |
| 2 | Deployment Form Validation & Auto-Chase (full) | Laurie, Suzy, Ngan | ~5 hrs | ~20 hrs | Medium | High |
| 3 | RMA Master Sheet Auto-Consolidation | Robin, Jack, Brian, Scott | ~5 hrs | ~20 hrs | Medium | High |
| 4 | Inventory Reconciliation Automation | Laurie, Robin, Scott | ~12 hrs | ~48 hrs | Medium | High |
| 5 | Self-Service RMA Status Notifications | CS team (scaling play) | ~0 now | ~0 now | Low | Medium |
| 6 | Collections Outreach Automation | Brian | ~10 hrs | ~40 hrs | Low–Med | Medium |
| 7 | Customer Self-Service / FAQ Automation | Robin, Janice, Roxanne | ~10–30 hrs | ~40–120 hrs | Medium | High |
| 8 | US Collections — Kingston Data and Credit Handoff | Brian | ~0.5–1 hr | ~2–4 hrs | Low | Medium |
| 9 | Out-of-Warranty Cost Recovery Process | Scott, Brian | ~0 now → ~10–17 hrs/month arriving in 90 days | Risk/Revenue | Low | High |
| 10 | Tribal Knowledge Documentation | Risk reduction, all | N/A | N/A | Low | Critical |
| 11 | Billing Reconciliation (SIM, Castles/LazyIOS, KioSoft/PayRange) | Scott | ~1–2 hrs | ~4–8 hrs | Medium | High |

**Total verified automatable time (current, weekly): ~55–75 hrs/week across the Operations team**
**Total verified automatable time (current, monthly): ~220–300 hrs/month**

---

## Detailed Opportunities

### Priority 1: Daily Operational Digest

**What to automate/improve:**
An AI agent runs every morning and compiles a single consolidated daily briefing for Scott (and leadership) covering: Zendesk issue volume and trends by category, open tickets and who owns them, ticket resolution times, outstanding issues and why they're stuck, deployment status (forms received, in progress, completed, blocked), RMA pipeline status, and any anomalies or spikes in volume.

**Current state:**
Scott has no real-time visibility into what's happening operationally. Information lives across Zendesk, MOTRS, the Master RMA sheet, the master deployment chart, and individual inboxes. There is no consolidated view. Scott is currently reactive — learning about issues when they escalate. A Zendesk daily report via Claude is already in development; this priority expands that initiative into a full operational digest.

**Why it matters:**
Without visibility, Scott cannot manage proactively. Every hour spent hunting for status updates, asking team members what's open, or getting surprised by escalations is time not spent leading. A daily digest is also the prerequisite for every other improvement — you can't fix what you can't see.

**Verified time savings:**

| Person | Current Daily Time Spent | Weekly | Monthly |
|---|---|---|---|
| Scott Scheirich | ~1 hr avg (up to 2 hrs heavy days) hunting status across Zendesk, MOTRS, RMA sheet, deployment chart, inboxes | ~5 hrs | ~20 hrs |
| Robin Blair | Up to 1 hr/day fielding internal status questions and compiling support status | ~5 hrs | ~20 hrs |
| Brian Griffiths | ~30 min/day on status communication and check-ins | ~2.5 hrs | ~10 hrs |
| **Total** | | **~12.5 hrs/week** | **~50 hrs/month** |

**Complexity:** Low–Medium
The Zendesk component is already in progress. Extending to deployment and RMA requires either API access to Zendesk/MOTRS or reading from the existing Excel sheets. The Excel-based sources (master deployment chart, Master RMA sheet) can be read directly if placed in an accessible location.

**Dependencies:**
- Zendesk API access (already in progress)
- MOTRS data access (API or export)
- Master RMA sheet and master deployment chart must be consistently maintained and accessible
- Agreement on what metrics matter (KPIs to track)

**Suggested approach:**
1. Complete the Zendesk daily digest (already underway) — prove the model
2. Add deployment metrics: forms received today, terminals deployed, blocked deployments, SNs chased
3. Add RMA metrics: open RMAs, newly received, Castles status updates, merchant-facing delays
4. Deliver via email to Scott (and optionally Robin, Brian) every morning at 8am
5. Expand to a weekly leadership summary (rolled-up metrics, trends, risks)

**Success criteria:**
- Scott receives a daily briefing with zero manual effort
- Scott can identify recurring issues and assign resources proactively within the same day
- CS/Support escalations to Scott for status updates decrease by 50%+

**WeVend/MonexGroup considerations:**
Digest should clearly separate WeVend (Zendesk) and Monex (MOTRS) metrics. Both business units need coverage.

---

### Priority 2: Deployment Form Validation & Auto-Chase (Full Scope)

**What to automate/improve:**
An automated validation layer that checks submitted deployment forms for: (1) valid and unique SN that exists in inventory, (2) SN not already assigned or in RMA, (3) all required fields present (merchant name, model, deployment type), (4) required supporting documents attached (acquirer-mandated documentation, proof of payment), (5) accessories correctly specified. If the form fails validation, an automated message is sent to the submitter explaining exactly what's missing.

**Current state:**
The problem is broader than serial numbers. The Admin team (Laurie, Suzy, Ngan) spends significant daily time chasing Sales reps — especially on the Monex side — for: missing or invalid SNs, missing supporting documents (acquirer-mandated compliance docs), proof of payment, and accessory clarification. Each invalid submission triggers 2–3 email exchanges, typically resolved same day but occasionally stretching multiple days. The invalid form rate was ~50% historically; now ~20–30% (2–3 in 10) following the centralized programming initiative and mandatory SN policy.

**Why it matters:**
At 739 terminals/month (~25 forms/week), a 20–30% problem rate means 5–7 forms/week requiring a chase cycle. Each cycle burns 10–30 minutes of Admin time. As volume grows toward 10,000 terminals, this does not scale. The issue is compounded by the Monex side specifically, where supporting document requirements (set by banking acquirers) are complex and frequently incomplete.

**Verified time savings:**

| Person | Current Daily Time Spent | Weekly | Monthly |
|---|---|---|---|
| Laurie + Suzy + Ngan (combined) | ~1 hr/day combined chasing forms, SNs, supporting docs, accessories | ~5 hrs | ~20 hrs |
| **Total** | | **~5 hrs/week** | **~20 hrs/month** |

*Note: Does not include downstream deployment delays caused by blocked forms — the elapsed time cost to merchants and Sales is higher than the Admin labour cost alone.*

**Complexity:** Medium
Requires integration between the deployment form submission (currently Excel/email) and inventory systems (CasHUB, master inventory chart) to validate SNs in real time. The form itself may need to be rebuilt as a smart form (Jotform, Typeform, or custom) rather than an Excel file.

**Dependencies:**
- CasHUB API access or data export to enable real-time SN lookup
- Agreement on a standardized deployment form format (currently split between Excel/shared folder for US and SharePoint for Canada)
- Sales and Admin buy-in on the new submission process

**Suggested approach:**
1. Replace the Excel-based deployment form with a smart online form (Jotform or similar)
2. On submission, validate SN against a daily-refreshed inventory list (pulled from CasHUB or master inventory)
3. If SN is invalid/missing/duplicate: auto-reject the form and send a templated follow-up to the submitter
4. If valid: route to Ops queue automatically with all required data pre-populated

**Success criteria:**
- Zero deployment forms reaching Ops with invalid SNs
- Manual chase emails from Scott/Laurie to Sales/Admin eliminated
- Average time from form submission to Ops intake reduced by 50%+

**WeVend/MonexGroup considerations:**
Both BUs use the same deployment process. A single smart form can serve both with a business unit selector field.

---

### Priority 3: RMA Master Sheet Auto-Consolidation

**What to automate/improve:**
An automated process that pulls data from three sources — Castles' weekly RMA Excel report, Jack's terminal intake log, and the internal Master RMA sheet — and consolidates them into a single, always-current RMA tracking sheet. Discrepancies are flagged automatically for human review.

**Current state:**
Daily copy/paste from three separate Excel files into the Master RMA sheet. Takes anywhere from a few minutes to an hour per day depending on volume. Operated by multiple people (Brian, Robin, Jack) with no single documented owner. Risk of human error, missed updates, and stale data is high.

**Why it matters:**
The Master RMA sheet is the only source of truth for where every terminal is in the repair/replacement lifecycle. Stale or inaccurate data leads to incorrect merchant communications, missed warranty deadlines, and delayed redeployments. As RMA volume grows (more terminals in the field = more failures), this manual process will become unmanageable.

**Verified time savings:**

| Person | Role in Current Process | Weekly | Monthly |
|---|---|---|---|
| Robin Blair | Updates master chart with all RMA requests made directly with Castles | ~1–2 hrs | ~4–8 hrs |
| Jack Talany | Updates separate chart tracking broken terminals received + repaired terminals returned from Castles | ~1–2 hrs | ~4–8 hrs |
| Brian Griffiths | Transfers Jack's chart data into master chart; incorporates Castles' weekly Excel report | ~1–2 hrs | ~4–8 hrs |
| Scott Scheirich | Reviews consolidated master chart to understand pipeline status | ~0.5–1 hr | ~2–4 hrs |
| **Total** | | **~5 hrs/week** | **~20 hrs/month** |

*All four steps are sequential relay of the same data — none add value beyond what automation would deliver instantly.*

**Complexity:** Medium
Requires reading Castles' Excel report (delivered weekly via email or shared folder) and Jack's log, then auto-populating the Master RMA sheet. Can be implemented with a Python script or Power Automate workflow triggered on file receipt.

**Dependencies:**
- Consistent format of Castles' weekly RMA report (confirm stability of column structure)
- Jack's intake log must be maintained in a consistent, machine-readable format
- Master RMA sheet must be in a shared, accessible location (already is)

**Suggested approach:**
1. Standardize Jack's intake log format (if not already standardized)
2. Build a script that: reads Castles weekly report on arrival, reads Jack's latest log, matches SNs to existing Master RMA entries, updates status fields, and flags any SNs not found in the master (potential discrepancy)
3. Script runs automatically when Castles report is received (or on a daily schedule)
4. Human reviews flagged discrepancies only — no routine copy/paste

**Success criteria:**
- Master RMA sheet is updated within 1 hour of Castles report receipt, with zero manual copy/paste
- Discrepancies are flagged and routed for review within the same day
- Team spends 0 hours on routine RMA data consolidation

**WeVend/MonexGroup considerations:**
RMA process is the same for both BUs. Master sheet should clearly indicate BU per terminal.

---

### Priority 4: Inventory Reconciliation Automation

**What to automate/improve:**
An automated reconciliation that compares Wevend's internal master inventory/deployment chart against Castles' US inventory workbook, flags discrepancies (count mismatches, SNs in one system but not the other), and generates a weekly reconciliation report for Scott.

**Current state:**
Scott manually checks Castles' shared Excel workbook to verify US inventory counts, then manually reconciles against the internal chart. Laurie separately tracks shipments and tracking numbers. There is no automated comparison. Discrepancies are caught inconsistently.

**Why it matters:**
Inventory accuracy is a prerequisite for reliable deployments. If the internal chart shows stock that isn't there — or Castles has stock that isn't tracked — deployments fail, merchants are delayed, and cash is unaccounted for. This risk grows linearly with terminal volume.

**Verified time savings:**

| Person | Current Activity | Weekly | Monthly |
|---|---|---|---|
| Laurie | Data entry into master deployment chart (multiple fields per terminal, same info entered repeatedly on bulk orders) + updating tracking numbers after Castles processes orders | ~5–15 hrs (1–3 hrs/day; bulk order days hit the top of range) | ~20–60 hrs |
| Robin Blair | Updates master chart for all terminal replacements | ~1.25–2.5 hrs (15–30 min/day) | ~5–10 hrs |
| Scott Scheirich | Weekly manual reconciliation of Castles' shared workbook vs. internal chart | ~0.5–1 hr | ~2–4 hrs |
| **Total** | | **~7–18.5 hrs/week (avg ~12 hrs)** | **~28–74 hrs/month (avg ~48 hrs)** |

*Laurie's data entry burden is the single largest individual time sink in the department. On bulk order days she may spend the majority of her workday on manual data entry alone.*

**Complexity:** Medium
Requires reading Castles' shared workbook (Excel) and comparing against the internal master chart. Can be automated with a Python script or Power Automate. The challenge is maintaining access to Castles' workbook (shared folder dependency).

**Dependencies:**
- Stable access to Castles' shared Excel workbook
- Internal master deployment chart in consistent, machine-readable format
- Defined reconciliation rules (what counts as a discrepancy, what tolerance is acceptable)

**Suggested approach:**
1. Script reads both files on a weekly schedule (or on demand)
2. Compares SN-by-SN: what's in Castles' workbook vs. what's in the internal chart
3. Flags: SNs in Castles but not internal chart; SNs in internal chart but not Castles; count mismatches by model
4. Generates a clean reconciliation report emailed to Scott and Laurie
5. Humans resolve flagged discrepancies only

**Success criteria:**
- Weekly reconciliation report delivered automatically with zero manual effort
- Count discrepancies identified within 24 hours of Castles workbook update
- Manual inventory cross-checking by Scott and Laurie eliminated

**WeVend/MonexGroup considerations:**
US inventory is at Castles; Canadian inventory is at Wevend head office. Canadian reconciliation is currently manual (Jack's count vs. internal chart) — can be addressed in a second phase.

---

### Priority 5: Self-Service RMA Status Notifications

**What to automate/improve:**
Automated outbound status notifications sent to merchants at each stage of the RMA process: (1) RMA number confirmed, (2) terminal received by Castles, (3) repair/replacement decision made, (4) replacement shipped, (5) estimated return date. Merchants can check status without calling CS.

**Current state:**
Robin manually communicates RMA status to merchants and internal teams when asked. CS fields regular "where is my terminal?" calls that could be eliminated with proactive notifications. No automated status updates exist.

**Why it matters:**
Every "where is my terminal?" call is 5–15 minutes of CS time that adds zero value. At scale, these calls will drown the CS team. Proactive notifications also improve merchant satisfaction.

**Verified time savings:**
Currently minimal — merchant RMA status inquiries are low in volume at present. Verified with Scott: essentially zero inbound "where is my terminal?" calls right now. **This is a scaling play, not a current time saver.**

However, RMA volume is growing: 64 terminals in January, 57 in February, 82 in March. As volume climbs toward 10,000 active terminals, proactive status notifications will become a prerequisite for keeping CS manageable. The time to build this is before the volume arrives, not after.

**Estimated future savings (at scale):** 2–5 hrs/week for CS team once RMA volume reaches 150–200+ terminals/month.

**Complexity:** Low
Requires reading Master RMA sheet status changes and triggering email notifications to merchants when status updates. Can be built as a simple script or Power Automate flow watching the Master RMA sheet.

**Dependencies:**
- Master RMA sheet must include merchant email addresses
- Consistent status field values in the Master RMA sheet (requires standardization)
- Dependent on Priority 3 (RMA auto-consolidation) for accurate, timely status data

**Suggested approach:**
1. Standardize RMA status values in Master RMA sheet (5–7 defined stages)
2. Script monitors the sheet for status changes
3. On status change: send templated email to merchant with plain-language update
4. Optionally: build a simple status lookup page where merchants enter their RMA number and see current status

**Success criteria:**
- Merchants receive automatic status updates at each RMA stage without any CS involvement
- "Where is my terminal?" inbound calls to CS decrease by 60%+

**WeVend/MonexGroup considerations:**
Applies to both BUs. Email templates should reference the correct brand (Wevend or MonexGroup) based on merchant's BU.

---

### Priority 6: Collections Outreach Automation

**What to automate/improve:**
Two components: (1) Automated escalation sequences for merchants who have broken contracts or have outstanding rejected payments — replacing Brian's manual outreach with structured, logged, auto-triggered follow-up emails and reminders. (2) Automated follow-up for payment rejections uploaded to Phorge — triggering Day 7, Day 14 follow-ups for merchants with prior unpaid rejections, routing to Brian only when human intervention is required.

**Current state:**
Brian spends approximately half his working day (~4 hours/day) on Collections, split roughly 50/50 between manual outreach/chasing and administrative work (damage calculations, document preparation, record updates). The manual outreach side — writing follow-up emails, making calls, tracking where each merchant is in the recovery process — is almost entirely a candidate for automation. He is currently managing 25–50 active collection accounts per month with a $30,000/month recovery target.

The payment rejection upload itself is trivial (5 minutes/week). The gap is that there is no automated follow-up sequence after the first Phorge notification — merchants with prior unpaid rejections receive no structured escalation unless Brian manually acts.

**Why it matters:**
Brian is a one-person operation covering both Collections AND Canadian Deployment. Every hour freed from routine outreach is an hour available for higher-value work (damage calculations, agency management, deployment oversight). Automated escalation sequences also ensure no account falls through the cracks when Brian is managing high volume.

**Verified time savings:**

| Person | Current Activity | Weekly | Monthly |
|---|---|---|---|
| Brian Griffiths | Manual outreach and follow-up chasing (calls, emails, tracking escalation status per merchant) — ~50% of his collections time | ~10 hrs | ~40 hrs |
| **Total** | | **~10 hrs/week** | **~40 hrs/month** |

*The remaining ~10 hrs/week of Brian's collections time (damage calculations, document prep, agency management) is not automatable and remains with Brian.*

**Complexity:** Low
If Phorge supports automated workflows or API triggers, this is a low-complexity add. If not, a script monitoring Phorge rejection uploads and triggering email sequences (via Outlook or SendGrid) can achieve the same result.

**Dependencies:**
- Phorge API access or webhook capability
- Brian's approval of escalation thresholds and email templates
- Accounting's agreement on rejection file delivery timing/format (from Nancy)

**Suggested approach:**
1. Define escalation sequence: Day 1 (auto notification via Phorge), Day 7 (automated follow-up), Day 14 (second follow-up with warning), Day 21 (Brian notified to take manual action)
2. Flag merchants with 2+ prior unpaid rejections for immediate elevated escalation
3. All communications logged automatically to collections history

**Success criteria:**
- 100% of rejected payments receive follow-up without Brian manually tracking each one
- Prior unpaid rejection follow-up rate increases from ~0% to 100% automated coverage
- Brian's time on rejection management reduced by 50%+

**WeVend/MonexGroup considerations:**
Currently applies to Monex-side (Phorge). WeVend payment rejection process should be confirmed and addressed in a follow-up.

---

### Priority 7: Customer Self-Service / FAQ Automation

**What to automate/improve:**
A self-service knowledge base or AI-assisted chat tool that allows merchants to resolve common inquiries without contacting CS: how to read a statement, portal access steps, common billing questions, how to request a profile change, RMA initiation, terminal troubleshooting basics.

**Current state:**
CS (Janice, Roxanne, Robin) repeatedly answers the same questions from different merchants. There is no self-service portal or FAQ resource. Every inquiry — no matter how basic — requires a live CS interaction via phone or ticket.

**Why it matters:**
At 1,500 active terminals, repeat inquiries are manageable. At 10,000, without self-service, the CS team will be overwhelmed. This is a scaling prerequisite.

**Verified time savings:**

Current CS contact volume (verified):
- Monex inbound calls: ~25/day
- WeVend inbound calls: ~10/day
- Monex outbound calls: ~10/day (technical support)
- Email inquiries: 50–100+/day combined (some go directly to agents, bypassing ticketing)
- **Total: ~95–145 contacts/day**

At Scott's estimate of 25% deflectable via self-service, at 5–10 minutes per routine contact:

| Scenario | Deflectable Contacts/Day | Time Saved/Day | Weekly | Monthly |
|---|---|---|---|---|
| Conservative (25% of 95, 5 min each) | ~24 | ~2 hrs | ~10 hrs | ~40 hrs |
| High (25% of 145, 10 min each) | ~36 | ~6 hrs | ~30 hrs | ~120 hrs |
| **Best estimate** | **~30** | **~4 hrs** | **~20 hrs** | **~80 hrs** |

*The Zendesk daily digest (Priority 1) will refine the deflection rate once top inquiry categories are visible. 25% is Scott's floor estimate — the real number may be higher.*

*This is also the single largest scaling protection in the list: at 10,000 active terminals, an unmitigated CS inbound volume would require 3–5x the current team.*

**Complexity:** Medium
Requires identifying the top 20 most common CS inquiries (can be derived from Zendesk/MOTRS ticket data), building a knowledge base or FAQ, and optionally deploying an AI assistant that answers these questions before a human is contacted.

**Dependencies:**
- Zendesk/MOTRS data to identify top inquiry categories (supported by Priority 1 daily digest)
- Robin's existing email templates and WeVend Tech Support Guide as content source
- WeCenter or Monex portal as the deployment vehicle (or a standalone FAQ page)

**Suggested approach:**
1. Pull top 20 inquiry categories from Zendesk/MOTRS (use daily digest data)
2. Expand Robin's existing templates into a structured FAQ/knowledge base
3. Add a searchable FAQ to WeCenter and Monex portal (or link from login screens)
4. Phase 2: Deploy an AI chat assistant on the portal to answer questions before a ticket is created

**Success criteria:**
- Top 20 inquiry types resolvable without CS contact
- Inbound CS call and ticket volume decreases by 20–30% within 90 days of launch
- CS team's time is redirected from repetitive answers to complex escalations

**WeVend/MonexGroup considerations:**
WeCenter (WeVend) and Monex Portal are separate — content must be tailored for each BU's merchant base.

---

### Priority 8: US Collections — Kingston Data and Credit Handoff Process

**What to automate/improve:**
Formalize and partially automate the process of identifying US merchants with contract damages upon cancellation, packaging the required documentation, and submitting to Kingston Data and Credit for recovery.

**Current state:**
US cancellation contract damage recovery is currently not pursued — explicitly identified as an untapped opportunity. Kingston Data and Credit is in evaluation to take this over. There is no defined process or workflow for this.

**Why it matters:**
Every US cancellation with remaining contract terms represents revenue that is currently written off. Even modest recovery rates on a growing US merchant base could materially impact cash flow. Brian already manages this for Canada — extending to the US is a replication exercise.

**Verified time savings:**
Minimal ongoing time cost once the process is operational — Brian estimates 30 minutes to 1 hour per week to manage US accounts handed to Kingston Data and Credit. **This is primarily a revenue recovery opportunity, not a time saver.**

The revenue opportunity has not been quantified (number of US cancellations with remaining contract terms is not tracked), but every cancellation going unrecovered is currently 100% written off.

**Complexity:** Low
Process already exists for Canada (Brian's workflow). The US version is a replication with adjusted systems (Fiserv CoPilot for closures, TSYS). Kingston Data and Credit relationship is already established.

**Dependencies:**
- Decision on Kingston Data and Credit engagement for US
- Access to US contract records and revenue reports
- Brian (or a designated owner) having capacity to manage US accounts

**Suggested approach:**
1. Confirm Kingston Data and Credit engagement for US
2. Document the existing Canadian cancellation/recovery process as an SOP (captures tribal knowledge)
3. Apply same process to US: Fiserv CoPilot closure → contract review → damage calculation → 30-day demand → agency handoff
4. Automate the documentation packaging step (pull contract, revenue report, calculation) to reduce Brian's manual effort per account

**Success criteria:**
- US contract damage recovery process operational within 60 days
- First US accounts submitted to Kingston Data and Credit within 90 days
- Monthly US recovery target defined and tracked

**WeVend/MonexGroup considerations:**
US accounts primarily WeVend-side (TSYS/Fiserv CoPilot). Monex US accounts should be reviewed as a secondary step.

---

### Priority 9: Out-of-Warranty Cost Recovery Process

**What to automate/improve:**
Design and implement the end-to-end process for handling out-of-warranty RMA situations: Castles quotes a repair/replacement cost → Ops presents to merchant → merchant accepts or declines → payment collected or terminal retired.

**Current state:**
No process exists. The first out-of-warranty situations have not yet occurred but are imminent as the initial terminal cohort (deployed ~1 year ago) comes off warranty. Without a defined process, these situations will be handled ad hoc, inconsistently, and with risk of merchant disputes.

**Why it matters:**
Without a defined process, out-of-warranty situations will fall to whoever is available, be handled inconsistently, and create merchant dissatisfaction. Formalizing this now — before it becomes a crisis — is significantly easier than fixing it reactively.

**Verified time savings:**
Zero today — no OOW situations have occurred yet. **This is an imminent risk and revenue protection play.**

30–50 out-of-warranty situations are expected in the next 90 days as the first terminal cohort (deployed ~1 year ago) comes off warranty. Without a defined process, each case will require ad hoc handling estimated at ~1 hour per case across Ops, Collections, and CS.

| Timeline | Expected Volume | Est. Time if Ad Hoc | Est. Time with Process |
|---|---|---|---|
| Next 90 days | 30–50 cases | 30–50 hrs | ~10–15 hrs (templated, defined flow) |
| Monthly ongoing (steady state) | 10–17 cases/month | 10–17 hrs/month | ~3–5 hrs/month |

Building the process now (a few hours of SOP and template creation) saves 30–50 hours of ad hoc handling in the next quarter alone.

**Complexity:** Low
Primarily a process design exercise (SOP) with a templated merchant communication and a simple decision tree. The collections component (payment if merchant accepts) can be handled by Brian using existing processes.

**Dependencies:**
- Castles' confirmed out-of-warranty cost structure (how they quote, what they charge)
- Management approval of the merchant-facing cost pass-through policy
- Brian's collections process for recovering OOW costs if merchant agrees to pay

**Suggested approach:**
1. Confirm Castles' OOW cost structure and typical cost range
2. Define internal policy: who approves merchant communication, cost markup (if any), what happens if merchant declines
3. Create SOP and email template for OOW notification to merchant
4. Route accepted payments through Brian's existing collections process
5. Track OOW cases in Master RMA sheet with a dedicated status field

**Success criteria:**
- First out-of-warranty RMA handled via defined process (not ad hoc)
- 100% of OOW situations generate a merchant communication within 5 business days of Castles quote
- OOW cost recovery rate tracked monthly

**WeVend/MonexGroup considerations:**
Applies to both BUs. Communication templates should be BU-branded.

---

### Priority 10: Tribal Knowledge Documentation

**What to automate/improve:**
Formal documentation of the four critical tribal knowledge risks identified in the Department X-Ray: Ngan's fillable forms process, Laurie's US deployment order workflow, Brian's Collections process, and Scott's Legal file management.

**Current state:**
All four of these processes exist only in individual team members' heads. If any one of these people left tomorrow with no notice, the associated function would stop completely. No written SOPs, no documented backup procedures, no cross-training.

**Why it matters:**
These are not edge cases — they are core operational functions. The fillable forms and US deployment order processes run daily at high volume. The Collections process protects $30,000+/month in recovery. The Legal process governs trademark and litigation risk. The cost of not documenting these is a single departure away.

**Verified time savings:**
Not a time-saving exercise — this is pure risk reduction. Value is measured in what doesn't break.

Updated risk assessment based on interview clarification:

| Person | Process | Risk Level | Backup Exists? |
|---|---|---|---|
| Ngan | Fillable forms (Monex acquirer documentation updates, 1–2x/year) | **Medium** — Layal can cover, but formatting knowledge is not documented | Partial (Layal) |
| Laurie | US deployment orders via Castles shared folder | **Critical** — sole owner of highest-volume daily process | None |
| Brian | All of Collections (Canada) | **Critical** — $30,000+/month recovery, sole owner | None |
| Scott | Legal (trademarks, court actions, contract filing) | **High** — no documentation, no backup | None |

**Complexity:** Low
This is a documentation exercise, not a technical one. Can be done via structured interviews (similar to this X-Ray) with each person. Estimated 2–3 hours per person to document fully.

**Dependencies:**
- Dedicated time from Ngan, Laurie, Brian, and Scott
- A consistent SOP format (template to be created or adopted from existing Operations documentation)
- A designated place to store and maintain the SOPs (shared folder, Notion, Confluence, or similar)

**Suggested approach:**
1. Schedule 2-hour documentation sessions with each person (Ngan, Laurie, Brian, Scott)
2. Walk through each process step-by-step; document in SOP format
3. Have a second person attempt to follow the SOP from scratch to validate completeness
4. Store in a shared, accessible location (not just someone's personal folder)
5. Review SOPs quarterly; update when processes change

**Success criteria:**
- All four processes documented in SOP format within 30 days
- A second person has successfully executed each process from the SOP alone
- No single person is the only one who can execute any critical daily process

**WeVend/MonexGroup considerations:**
Several of these processes cover both BUs (deployment orders, collections). SOPs should explicitly address both where applicable.

---

### Priority 11: Billing Reconciliation Automation (SIM Fees, Castles/LazyIOS Invoices, KioSoft/PayRange)

**What to automate/improve:**
Three related reconciliation tasks currently performed manually by Scott:
1. **Invoice validation (Castles/LazyIOS):** AR provides invoices for terminals and accessories; Scott manually validates whether the equipment was received before approving payment
2. **SIM fee reconciliation:** Castles charges monthly for SIM card usage; Scott currently has no way to confirm that every SIM-enabled merchant is being billed the correct SIM fee on Wevend's side — cross-validating against monthly residual files provided by IT
3. **KioSoft/PayRange reconciliation:** KioSoft/PayRange charges monthly KLEO access fees and annual modem usage; Scott must reconcile these charges against residual reports to confirm accurate billing

**Current state:**
All three reconciliations are performed manually by Scott, working from files provided by IT (residual reports), AR (invoices), and vendors (Castles, KioSoft/PayRange). There is currently no automated cross-validation — meaning SIM billing gaps, invoice discrepancies, and KioSoft/PayRange overcharges or under-billings are only caught when Scott manually reviews the files.

The SIM fee gap is the most significant: Monex's terminal base is ~85% SIM-enabled (car wash, air vac), while WeVend is predominantly hardwired. With no automated reconciliation, it is unknown whether all SIM-enabled merchants are being correctly billed — representing potential revenue leakage of unknown scale.

**Why it matters:**
- Invoice validation prevents paying for equipment never received
- SIM fee reconciliation could be recovering revenue currently left unbilled — magnitude unknown but likely material given Monex's SIM concentration
- KioSoft/PayRange reconciliation protects margin on third-party software costs
- Scott's time is the most expensive in the department; these reconciliations do not require a Director to perform them

**Verified time savings:**

| Person | Current Activity | Weekly | Monthly |
|---|---|---|---|
| Scott Scheirich | Manual reconciliation of all three billing streams against IT residual files and vendor invoices | ~1–2 hrs | ~4–8 hrs |
| **Total** | | **~1–2 hrs/week** | **~4–8 hrs/month** |

*Note: Revenue leakage from SIM billing gaps is unquantified but could exceed the time savings in dollar terms. Reconciliation should be treated as both a cost reduction (Scott's time) and a revenue recovery exercise.*

**Complexity:** Medium
Requires reading IT residual files, Castles SIM billing reports, and KioSoft/PayRange invoices, then cross-validating against internal merchant records. Once the data formats are mapped, the reconciliation logic is straightforward. The challenge is data access and format consistency across vendors.

**Dependencies:**
- IT residual files in consistent, machine-readable format
- Castles SIM billing report format confirmed
- KioSoft/PayRange invoice format confirmed
- Internal merchant records indicating which merchants have SIM vs. hardwired terminals (currently tracked in CasHUB)

**Suggested approach:**
1. Map the data formats for all three reconciliation streams
2. Build a script that cross-validates: Castles SIM billing → IT residual report (is each SIM-billed merchant being charged on our side?)
3. Same logic for KioSoft/PayRange: vendor invoice → residual report
4. Invoice validation: AR invoice line items → confirmed receipt records (master deployment chart)
5. Generate a weekly discrepancy report flagging: merchants billed by vendor but not billing on our side (revenue leakage), merchants billed on our side but not by vendor (overcharge risk), invoice line items with no matching receipt
6. Scott reviews flagged discrepancies only — not raw data

**Success criteria:**
- Scott spends 0 hours on routine reconciliation; only reviews flagged exceptions
- First SIM fee reconciliation identifies any billing gaps and quantifies revenue leakage
- 100% of vendor invoices validated against receipt records before AP processes payment

**WeVend/MonexGroup considerations:**
SIM fee reconciliation is primarily a Monex concern (~85% SIM-enabled). WeVend is predominantly hardwired. KioSoft/PayRange may apply to both BUs — confirm scope with Scott.

---

## Quick Wins (Can be done in < 1 week)

1. **Zendesk daily digest (already in progress)** — Complete and ship this first. It's the foundation for everything else and proves the model. Extend to include a basic deployment and RMA summary. Saves ~12.5 hrs/week once live.
2. **Out-of-warranty SOP and email template** — Pure document creation. 30–50 OOW cases are arriving in 90 days with no process. A few hours now saves 30–50 hours of ad hoc handling next quarter.
3. **Automated payment rejection follow-up sequence** — If Phorge supports it, configure Day 7 and Day 14 follow-up triggers. Brian defines thresholds; implementation is minimal. Frees Brian from manually tracking each rejection.
4. **Start tribal knowledge documentation with Laurie** — Laurie's US deployment order process is the highest-risk undocumented item (critical daily process, no backup). Schedule a 2-hour session and document it first.
5. **Map the billing reconciliation data formats** — Spend 1 hour with IT and Scott to map the SIM fee, Castles invoice, and KioSoft/PayRange data formats. This is the prerequisite for automating Priority 11 and may reveal SIM billing gaps immediately.

---

## 30-Day Targets

1. **Complete and expand the daily operational digest** — Zendesk + deployment status + RMA pipeline summary delivered to Scott every morning, zero manual effort. This is the single highest-ROI thing to deliver in 30 days.
2. **Document the four tribal knowledge processes** — Ngan (fillable forms), Laurie (US deployment orders), Brian (Collections), Scott (Legal). Schedule and complete all four sessions.
3. **Design and pilot the out-of-warranty RMA process** — Define policy, create SOP and template, validate with Castles on their cost structure before the first OOW case arrives.

---

## 90-Day Targets

1. **Deploy deployment form SN validation** — Replace Excel-based deployment forms with a smart form that validates SNs in real time and auto-chases invalid submissions. Eliminate the daily SN-chasing loop.
2. **Automate RMA Master Sheet consolidation** — Script to auto-sync Castles' weekly report + Jack's intake log into the Master RMA sheet. Eliminate daily copy/paste.
3. **Launch RMA self-service status notifications** — Merchants receive automatic updates at each RMA stage. Reduce "where is my terminal?" CS calls by 60%+.
4. **Launch US collections process with Kingston Data and Credit** — Formalize the handoff process; submit first batch of US contract damage recovery accounts.
5. **Build and launch merchant self-service FAQ** — Top 20 CS inquiry types available for self-service via WeCenter and Monex Portal. Begin reducing inbound CS volume in preparation for scaling.

---

## Scaling Risks to Address

| Risk | Current State | What Breaks at Scale | Recommended Action |
|---|---|---|---|
| **Deployment form SN chasing** | Manual validation and re-request; 30–90 min/day | At 3–5x volume, manual chasing becomes a full-time job; deployments back up | Automate SN validation at submission (Priority 2) |
| **Manual RMA tracking** | Daily copy/paste from 3 Excel sources | At higher terminal count, RMA volume grows; daily consolidation takes hours, errors increase | Automate RMA consolidation (Priority 3) |
| **Inventory reconciliation** | Manual weekly check of Castles workbook vs. internal chart | Inventory discrepancies become invisible at scale; deployment failures increase | Automate inventory reconciliation (Priority 4) |
| **CS inbound volume** | All inquiries handled by humans; no self-service | At 10,000 terminals, inbound call/ticket volume overwhelms current 4-person CS team | Self-service FAQ + AI assistant (Priority 7) |
| **Brian as single point of failure** | Brian owns 100% of Collections + CA Deployment — no backup | One absence halts both functions; at scale, workload becomes unmanageable for one person | Document processes (Priority 10); evaluate staffing; automate routine collection follow-ups (Priority 6) |
| **Real-time operational visibility** | No dashboard; Scott learns about issues reactively | At 10,000 terminals, reactive management becomes impossible | Daily operational digest (Priority 1) — address immediately |
| **Legal coverage** | Scott handles all legal solo; no documentation | One escalation or absence creates legal risk with no continuity | Document legal processes; evaluate paralegal hire when justified by scale |

---

## Total Verified Time Savings Summary

| Category | Weekly | Monthly | Notes |
|---|---|---|---|
| Priority 1: Daily Operational Digest | ~12.5 hrs | ~50 hrs | Scott + Robin + Brian |
| Priority 2: Deployment Form Validation | ~5 hrs | ~20 hrs | Laurie + Suzy + Ngan |
| Priority 3: RMA Master Sheet | ~5 hrs | ~20 hrs | Robin + Jack + Brian + Scott |
| Priority 4: Inventory Reconciliation | ~12 hrs | ~48 hrs | Laurie (bulk of it) + Robin + Scott |
| Priority 5: RMA Status Notifications | ~0 now | ~0 now | Scaling play |
| Priority 6: Collections Outreach | ~10 hrs | ~40 hrs | Brian |
| Priority 7: Customer Self-Service | ~20 hrs | ~80 hrs | CS team (Robin, Janice, Roxanne) |
| Priority 8: US Collections Handoff | ~0.5 hrs | ~2 hrs | Revenue play primarily |
| Priority 9: Out-of-Warranty Process | ~0 now → ~10–17 hrs/month | Risk/revenue — imminent | |
| Priority 10: Tribal Knowledge | N/A | N/A | Risk reduction |
| Priority 11: Billing Reconciliation | ~1–2 hrs | ~4–8 hrs | Scott + unquantified revenue leakage |
| **TOTAL (current automatable)** | **~65–67.5 hrs/week** | **~262–270 hrs/month** | |

**To put this in perspective:** the Operations team is currently spending the equivalent of 1.5–2 full-time employees per month on work that is automatable with the tools and technology available today.

---

## Notes for Weekly Review

- **Zendesk daily digest** is already in progress — confirm scope, delivery format, and launch timeline. This is the first deliverable.
- **Kingston Data and Credit evaluation** for US collections is active — decision point needed before the US collections process can be designed and automated.
- **Out-of-warranty process** needs to be designed proactively — 30–50 cases expected in 90 days, zero process exists. This is urgent.
- **Brian Griffiths capacity** is a recurring risk — he covers Collections + CA Deployment + RMA oversight solo. As terminal volume grows, this will need a staffing or automation solution.
- **Tribal knowledge documentation** requires executive prioritization — start with Laurie (US deployment orders, highest risk), then Brian, then Scott, then Ngan.
- **Billing reconciliation / SIM fee gap** — the SIM billing discrepancy may represent material revenue leakage on the Monex side. Recommend quantifying this as a first step.
- **Open question:** Does Operations have a preferred system for SOPs and knowledge management (Notion, Confluence, SharePoint)? The tribal knowledge documentation effort needs a home.
- **Open question:** What is the timeline and decision criteria for the Kingston Data and Credit US engagement?

---

*This priority list was generated from a Department X-Ray session on March 25, 2026. It should be reviewed weekly and updated as items are completed or priorities shift.*
