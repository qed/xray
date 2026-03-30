# Monex Sales — Automation & Agent Opportunities

**Priority-Ordered Action List**

*Derived from Department X-Ray Interview + Phase 8 Time Savings Deep-Dive | March 26, 2026*

---

## How to Read This Document

Each opportunity is ranked by **impact × feasibility**. Items at the top deliver the most value with the least resistance. Complexity ratings are:

- 🟢 **Low** — Can be done quickly with existing tools or simple scripts

- 🟡 **Medium** — Requires integration work or new tooling

- 🔴 **High** — Significant technical lift, likely requires vendor coordination

---

## Priority 1 — Automated Lead Assignment (Teleleads)

**What:** Build rule-based auto-assignment in Teleleads so that when a new lead is created (from web form, marketing, or manual entry), it is automatically routed to the correct rep based on vertical, geography, and round-robin logic — without requiring John, Henry, or Brendan to manually assign.

**Why It Matters:**

- John personally handles all off-hours (evenings and weekends) lead assignment

- A hot inbound lead can sit unassigned overnight or over the weekend

- In a competitive payments market, response speed is a differentiator

- Eliminates a critical single-point-of-failure dependency on John

**Validated Time Estimates (Phase 8):**

- Volume: 20-30 leads/week require assignment; John personally handles 10-15/week

- Time per assignment: ~2 min (review + decide + update owner in Teleleads)

- John's personal time: ~20-30 min/week; total across all assigners: ~40-60 min/week

- Off-hours missed contact windows: occasional — leads can sit unassigned overnight/weekends

- **Estimated savings: ~45-55 min/week** + elimination of off-hours coverage risk

**Complexity:** 🟡 Medium — Requires Teleleads configuration or API work

**Dependencies:** Teleleads vendor access or internal dev resources; requires documenting the routing logic (vertical → rep mapping)

**Suggested Logic:**

- Vending leads → Brady (primary), then Manny (overflow)

- Car wash leads → Nancy, Karina, Quentin, Manny (round robin)

- Attended leads (Canada) → Henry, Brendan

- US attended leads → Flag as unassigned + notify John (until US attended rep is hired)

- After-hours: auto-assign with timestamp logged; alert rep immediately via Teams or email

---

## Priority 2 — Application Automation (Questionnaire → DocuSign Pipeline)

**What:** Automate the flow from customer questionnaire submission to fully populated application in DocuSign — eliminating the rep's manual 1-hour data entry step.

**Why It Matters:**

- Currently costs each rep ~1 hour per deal in manual application build

- At ~56 deals/month (2026 target), that's 56 hours/month of rep time on pure admin

- Automation in progress — this is already identified internally; priority is to complete and validate it

**Validated Time Estimates (Phase 8):**

- Volume: 2-3 applications/week across the team

- Current time: ~1 hour per application (keying from questionnaire + cross-checking)

- Post-automation: ~10 min review per application (rep still reviews before DocuSign)

- Automation handles ~80% of the work; human review remains for error-catching

- **Estimated savings: ~1.5-2 hrs/week** (~50 min saved per application)

**Complexity:** 🟡 Medium — Work already in progress; prioritize completion and testing

**Dependencies:** Questionnaire platform, DocuSign API, internal dev

**Notes:** The most common failure points in the current process (wrong legal business name, banking mismatch) should be addressed in the questionnaire itself — add inline guidance like: "Enter your name exactly as it appears on your business registration" and "Bank account name must exactly match your registered business name."

---

## Priority 3 — Lead Follow-Up Monitoring & Alerts

**What:** Automated monitoring of lead activity in Teleleads that flags any lead that has not been contacted within 48 hours, and alerts the rep and/or John via Teams or email.

**Why It Matters:**

- The 48-hour follow-up standard exists but there is no automated enforcement or visibility

- Leads go cold without anyone knowing

- John has no easy way to see which leads are being worked vs. ignored

- Directly impacts the ability to hit the 20% growth target

**Validated Time Estimates (Phase 8):**

- Each rep manages 50-60 active leads at any given time (~350-420 leads team-wide)

- Without monitoring, leads slip to 3-5 days uncontacted before anyone notices

- Contact within 30 minutes = **3x more likely to close** vs. delayed follow-up

- Reps can respond immediately when an alert fires — no prep time needed

- **This is a revenue protection play, not a time savings play.** Recovering even a handful of deals per month from leads that would otherwise go cold has outsized revenue impact.

**Complexity:** 🟢 Low — Can be built as a Teleleads report/alert or an external script querying Teleleads data

**Dependencies:** Teleleads API or reporting access; Teams/email notification channel

---

## Priority 4 — Automated Payment Confirmation Notifications

**What:** When Finance marks an invoice as paid, automatically send a notification to the responsible rep (via Teams or email) confirming payment has been received.

**Why It Matters:**

- Currently inconsistent — reps sometimes have to manually ask Finance if a payment came in

- Creates unnecessary interruption for both Finance and Sales

- Reps need payment confirmation to take next steps with customers

**Validated Time Estimates (Phase 8):**

- Frequency: A few times per week across the team (varies with customer payment speed)

- Time per chase: Usually ~10 min; occasionally up to 30 min with back-and-forth

- **Estimated savings: ~30-60 min/week** of combined rep + Finance time

- 100% automatable — trigger notification the moment Finance marks invoice paid

**Complexity:** 🟢 Low — Likely a simple trigger from the Finance/invoicing system to Teams or Outlook

**Dependencies:** Finance invoicing system (name unknown — requires Finance team input); Teams/Outlook webhook or integration

---

## Priority 5 — Scheduled Automated Reporting

**What:** Set up two automated reports delivered on a recurring schedule:

1. **Weekly Rep Activity Report** — contacts made, leads assigned vs. contacted, follow-up status, deals in pipeline by rep

2. **Monthly Revenue vs. Forecast** — actual revenue vs. 2026 target by month and quarter

**Why It Matters:**

- John currently compiles reports manually

- Leadership visibility into rep activity and pipeline health requires scheduled, consistent data

- Enables earlier identification of reps falling behind or leads going cold

**Validated Time Estimates (Phase 8):**

- Revenue vs. Forecast: Already mostly built with Claude; just needs data pipeline automation (daily sales file + monthly revenue file). Minimal ongoing manual time.

- Rep Activity Report: Doesn't exist today; requires a manual Teleleads pull each time (~1-2 hrs per pull)

- **Estimated savings: ~1-2 hrs/week** once Rep Activity is automated and scheduled

- Revenue vs. Forecast automation is a data pipeline task; Rep Activity is a net-new build

**Complexity:** 🟢 Low — Can be scheduled now using existing Excel forecast + Teleleads data exports; fully automatable with API access

**Dependencies:** Teleleads data export or API; Excel/dashboard tooling already available

**Action:** Can be set up immediately post-session using scheduled task automation.

---

## Priority 6 — Apollo → Teleleads Integration

**What:** Build a direct integration between Apollo and Teleleads so that when a rep identifies and qualifies a prospect in Apollo, that contact is automatically created or updated in Teleleads — eliminating manual copy-paste.

**Why It Matters:**

- Currently all Apollo data must be manually re-entered into Teleleads

- This is part of the ~20 hours/week of manual admin work across the team

- Particularly valuable for vending and parking reps who use Apollo most actively

**Validated Time Estimates (Phase 8):**

- Apollo usage is currently sporadic — manual entry time is **negligible**

- **DEPRIORITIZED** until Apollo adoption increases meaningfully across the team

- Revisit when Apollo is used consistently by 3+ reps

**Complexity:** 🟡 Medium — Apollo has an API; Teleleads integration depends on whether Teleleads exposes an API or webhook endpoint

**Dependencies:** Apollo API, Teleleads API

---

## Priority 7 — Outlook Email Integration with Teleleads

**What:** Enable reps to send and log emails directly from Teleleads, eliminating the need to switch to Outlook and manually record outreach.

**Why It Matters:**

- Reps currently must toggle between Teleleads and Outlook for every email, then manually log the activity

- This is a friction point that degrades CRM hygiene (some activity goes unlogged)

- Identified by John as one of the top Teleleads gaps

**Validated Time Estimates (Phase 8):**

- Volume: 8-10 outbound emails per rep per day

- Time per email to log manually: ~2 min (copy-paste + minor steps in Teleleads)

- Reps don't always log — so CRM data has gaps even with the current effort

- **Estimated savings: ~16-20 min/day per rep = ~1.5-2 hrs/week per rep = ~10-14 hrs/week across the team**

- Bonus: CRM data quality improves significantly when logging is automatic

**Complexity:** 🟡 Medium — Requires Teleleads vendor support or custom integration with Microsoft Graph API (Outlook)

**Dependencies:** Teleleads vendor, Microsoft Graph API / Outlook integration

---

## Priority 8 — Document Submission Guidance & Checklist Automation

**What:** Create an automated, customer-facing onboarding checklist that is triggered immediately after DocuSign completion. The checklist should:

- Tell customers exactly what documents are needed

- Explain precisely how each document must be formatted (e.g., "legal business name as it appears on your CRA/IRS registration")

- Include inline instructions for the most common failure points (legal name, banking match)

- Send automated reminders if documents haven't been submitted within 24-48 hours

**Why It Matters:**

- Currently takes 2-3 additional follow-up touchpoints per deal to collect clean documents

- Root cause: customers don't know their exact legal name or that banking must match exactly

- Better upfront guidance reduces back-and-forth without requiring rep involvement

**Validated Time Estimates (Phase 8):**

- Current follow-up touchpoints per deal: 2-3 (chasing missing/incorrect documents)

- Time per touchpoint: ~5 min (email, call, or combination)

- Volume: 2-3 deals/week

- **Estimated savings: ~20-45 min/week** by reducing touchpoints to 0-1 per deal

- Root causes: customers don't know exact legal business name or banking must match exactly — better upfront guidance addresses both

**Complexity:** 🟢 Low — Can be built as an automated email sequence (Outlook + DocuSign trigger) or simple web form with inline guidance

**Dependencies:** DocuSign completion webhook or trigger; email automation tool

---

## Priority 9 — Admin Re-Keying Automation (Phorge + Acquirer + Hardware)

**What:** Build an automated data pipeline that takes a completed, approved deal and pushes the relevant data to all three downstream systems — Phorge, the acquirer system, and the hardware partner system (for unattended deals) — without manual re-entry.

**Why It Matters:**

- Admin currently spends 60-90 minutes re-keying each deal into 3 separate systems

- At ~56 deals/month (2026 target), that's 56-84 hours/month of admin time on data entry

- Manual re-keying creates error risk (e.g., Castles programming errors are partly downstream of manual parameter entry)

- Eliminating this step frees admin to focus on higher-value work

**Validated Time Estimates (Phase 8):**

- Volume: 180-200 transactions/week across both MonexGroup and Wevend (includes new deals, conversions, upgrades)

- Average processing time: ~45 min per transaction (varies by complexity — new deals are longest, upgrades shorter)

- **Total current admin burden: ~135-150 hrs/week** across both entities

- Realistic automation savings: ~50% of keying could be eliminated = **~65-75 hrs/week saved**

- Human review still needed for exceptions and error-checking

- Highest complexity item on the list; even partial automation (one system automated) delivers significant savings

**Complexity:** 🔴 High — Requires API access to Phorge, the acquirer system, and Castles/hardware partner; likely the highest-complexity item on this list

**Dependencies:** API documentation for Phorge, acquirer system, and Castles; internal dev or integration platform (e.g., Zapier, Make, or custom)

**Notes:** This is the highest-impact automation on the list if fully implemented. Even a partial solution (e.g., automating Phorge entry alone) delivers meaningful time savings. Recommend starting with the system that takes the most time to key.

---

## Priority 10 — Car Wash & Vending Lead Intelligence Tool

**What:** Identify or build a targeted lead intelligence source for car wash and vending operators — either by enriching community data (Facebook groups, trade show attendee lists, forum members) or sourcing a more specialized database than Apollo.

**Why It Matters:**

- Apollo has limited coverage for car wash operators — the team's primary vertical

- Outbound prospecting in car wash relies on manual research, trade shows, and community channels

- Lead volume in car wash and vending is John's #1 identified pain point

- Better data = more outbound activity = more pipeline for Brady, Nancy, Karina, Quentin, Manny

**Validated Time Estimates (Phase 8):**

- With quality data: reps can work through 10 leads in 1-2 hours (~6-12 min/lead)

- Without quality data: car wash prospecting stalls — reps can't effectively prospect this vertical outbound

- **This is a pipeline generation play, not a time savings play.** The constraint is data availability, not rep effort.

- Best near-term sources: SWCA/ICA/NE Car Wash trade show attendee lists, Facebook car wash group members, forum contacts

**Complexity:** 🟡 Medium — Sourcing specialized data (ICA member lists, SWCA directories, etc.) and enriching it requires research and possibly vendor evaluation

**Dependencies:** Trade association data partnerships (ICA, SWCA, NE Car Wash); possibly a specialized data vendor; rep time to validate

**Quick Wins:**

- Extract and systematically work trade show attendee lists from SWCA, ICA, and NE Car Wash

- Scrape and organize contacts from Facebook car wash groups and forums into Teleleads

- Evaluate specialized data vendors (e.g., Data Axle, InfoUSA) for car wash coverage

---

## Priority 11 — Vertical-Based Application Templates

**What:** Create standardized templates by vertical (e.g., Snacks/Soda Vending, Amusements, Car Wash, Air/Vac, Parking, etc.). When initiating new account applications, select a vertical template that auto-populates key parameters. Fee structures remain consistent across verticals, with only minor adjustments (e.g., PULSE pricing input). Deployment Forms and Fiserv onboarding auto-fill based on selected vertical.

**Why It Matters:**

- Reduces time spent configuring unique applications for each vertical

- Ensures consistency in fee structures and onboarding parameters across verticals

- Speeds up the questionnaire-to-application workflow identified in Priority 2

- Reduces errors caused by manual parameter entry variation

**Validated Time Estimates:**

- Current time per new application setup: varies by vertical, estimated 15-30 min per setup across configuration and form selection

- Post-automation: ~3-5 min (select template + minimal customization)

- Volume: 2-3 applications/week

- **Estimated savings: ~15-25 min/week** per account opener

**Complexity:** 🟡 Medium — Requires template design for each vertical, integration with questionnaire and DocuSign systems, and parameter mapping to Fiserv

**Dependencies:** Vertical definitions and consistent fee structure documentation; DocuSign template management; questionnaire platform

**Notes:** This is a complementary automation to Priority 2 (Application Automation) and helps reduce configuration time for reps selecting fee structures and product bundles.

---

## Priority 12 — Rapid Order Processing for Existing Accounts

**What:** For repeat orders (terminals, parts, etc.), auto-populate all known account details. Enable a simple dropdown-based ordering system. Generate and send order forms for signature in ~20 seconds.

**Why It Matters:**

- Existing accounts with repeat orders represent high-margin, low-friction revenue

- Currently requires manual form completion and data re-entry

- Speed of order processing impacts customer satisfaction and retention

- Particularly valuable for vending and car wash operators with seasonal or rotating equipment needs

**Validated Time Estimates:**

- Current time per repeat order: ~10-15 min (form completion + DocuSign prep + signature collection)

- Post-automation: ~20 seconds (select account + select items + generate + send)

- Volume: Not quantified in Phase 8; estimated 2-5 repeat orders/week across the team

- **Estimated savings: ~10-20 min/week** depending on order frequency

**Complexity:** 🟢 Low — Requires account detail pre-population, simple dropdown selection, and DocuSign template generation triggered from CRM

**Dependencies:** CRM (Teleleads) as source for account details; DocuSign template for order forms; simple web form or CRM interface

**Notes:** Can be implemented quickly as a low-code solution (e.g., Zapier or Make workflow) once account data is clean and standardized.

---

## Priority 13 — Contract Automation

**What:** Auto-generate agreements based on submitted deal information. Automatically compile and organize all required supporting forms for admin processing.

**Why It Matters:**

- Manual contract generation and form compilation is a time-intensive admin task

- Standardized language and template-based generation reduces errors and inconsistencies

- Creates a clear audit trail of which forms are associated with each deal

- Frees admin time for higher-value compliance and quality review work

**Validated Time Estimates:**

- Current time per deal contract package: estimated 20-30 min (select template, populate variables, compile supporting forms, organize for signature)

- Post-automation: ~5 min review (system generates from deal data, admin verifies completeness only)

- Volume: 2-3 deals/week

- **Estimated savings: ~20-30 min/week**

**Complexity:** 🟡 Medium — Requires deal data to be captured consistently in CRM; contract templates must be parameterized; supporting form list must be standardized by vertical and deal type

**Dependencies:** Clean deal data in CRM; templated contracts by vertical; form checklist documentation; DocuSign or similar for signature workflow

**Notes:** This is particularly valuable paired with Priority 11 (Vertical-Based Templates), as the vertical selection automatically determines which contract language and supporting forms are required.

---

## Priority 14 — AI-Powered Sales Communication

**What:** Generate non-repetitive cold outreach and follow-ups. Assist with objection handling. Draft responses for sensitive client situations (complaints, returns, escalations).

**Why It Matters:**

- Repetitive prospecting emails create outreach fatigue and reduce response rates

- Reps spend time on communication drafting that could be spent on selling

- Personalized, varied outreach improves engagement with prospects

- Sensitive customer situations require thoughtful responses; AI assistance helps reps handle escalations with empathy and professionalism

**Validated Time Estimates:**

- Time spent on email drafting and follow-up messaging: estimated 5-10 min/day per rep = ~30-50 min/week per rep

- Across the team: ~150-250 min/week

- AI-assisted drafting could reduce composition time by 30-50%

- **Estimated savings: ~50-125 min/week** across the team

**Complexity:** 🟡 Medium — Requires integration with email client and CRM; prompt engineering to match company voice and tone; review and approval workflow for sensitive communications

**Dependencies:** API access to LLM (e.g., OpenAI, Anthropic); Outlook/email integration; CRM integration to pull prospect context; brand voice guidelines and tone documentation

**Notes:** This is distinct from Priority 7 (Outlook Email Integration) — Priority 7 is about logging activity, while Priority 14 is about content generation. Both could be combined into a unified Teleleads enhancement.

---

## Priority 15 — Automated Commission Tracking

**What:** Track submitted deals and calculate commissions automatically. Allow internal review and edits prior to submission to accounting.

**Why It Matters:**

- Manual commission calculation is error-prone and time-consuming

- Delays in commission reporting reduce team visibility into earnings

- Reps need transparency and timely commission statements

- Accounting needs standardized, auditable commission records

**Validated Time Estimates:**

- Current time to compile and calculate commissions: estimated 2-3 hours per month (gather deal list, calculate per-rep commissions, verify against rate sheets, compile report)

- Post-automation: ~15-30 min per month (review auto-calculated numbers, approve, export)

- **Estimated savings: ~90-150 min/month** (~20-35 min/week equivalent)

**Complexity:** 🟡 Medium — Requires deal data to flow into commission calculation engine; commission rate structure must be standardized and versioned; must integrate with accounting system for final submission

**Dependencies:** Clean deal data in CRM or sales system; standardized commission rate matrix by vertical/deal type; calculation engine (Excel formula, custom script, or integration platform); accounting system integration

**Notes:** This automation depends on standardized commission structures (related to Priority 5 in the SalesOperations document around billing logic standardization). Until commission rules are clearly documented, this remains manual. High value once rule clarity is in place.

---

## Summary — Impact Matrix

| # | Opportunity | Validated Weekly Savings | Complexity | Revenue Impact |
|---|---|---|---|---|
| 1 | Auto-assign leads (Teleleads) | ~45-55 min/week | 🟡 Medium | High — eliminates off-hours lead loss |
| 2 | Application automation (questionnaire → DocuSign) | ~1.5-2 hrs/week | 🟡 Medium | High — frees rep time for selling |
| 3 | Lead follow-up monitoring & alerts | Revenue protection (3x close rate at 30-min response) | 🟢 Low | Very High — recovers leads going cold |
| 4 | Automated payment confirmation | ~30-60 min/week | 🟢 Low | Low-Medium — reduces friction |
| 5 | Scheduled automated reporting | ~1-2 hrs/week (John) | 🟢 Low | Medium — leadership visibility |
| 6 | Apollo → Teleleads integration | Negligible (deprioritized) | 🟡 Medium | Low at current usage |
| 7 | Outlook email integration in Teleleads | ~10-14 hrs/week (team) | 🟡 Medium | High — CRM hygiene + rep time |
| 8 | Document checklist automation | ~20-45 min/week | 🟢 Low | Medium — faster onboarding |
| 9 | Admin re-keying automation (3 systems) | ~65-75 hrs/week (both entities) | 🔴 High | Very High — massive admin relief |
| 10 | Car wash & vending lead intelligence | Pipeline generation play | 🟡 Medium | Very High — new pipeline |
| 11 | Vertical-based application templates | ~15-25 min/week | 🟡 Medium | Medium — faster onboarding, consistency |
| 12 | Rapid order processing for existing accounts | ~10-20 min/week | 🟢 Low | Medium — faster fulfillment, customer retention |
| 13 | Contract automation | ~20-30 min/week | 🟡 Medium | Medium — admin time + compliance |
| 14 | AI-powered sales communication | ~50-125 min/week | 🟡 Medium | Medium-High — outreach quality + rep time |
| 15 | Automated commission tracking | ~20-35 min/week | 🟡 Medium | Medium — accuracy + team visibility |

---

## Recommended Starting Sequence

**Do immediately (low-lift, high-visibility wins):**

- Priority 3 — Lead follow-up alerts

- Priority 4 — Payment confirmation notifications

- Priority 5 — Schedule automated reports

**Do next (medium lift, high impact):**

- Priority 1 — Auto-assign in Teleleads

- Priority 8 — Document checklist guidance

- Priority 11 — Vertical-based application templates

- Priority 12 — Rapid order processing for existing accounts

**Plan for H2 2026 (higher complexity):**

- Priority 2 — Complete application automation (already in progress)

- Priority 6 — Apollo → Teleleads integration

- Priority 7 — Outlook integration in Teleleads

- Priority 9 — Admin re-keying pipeline

- Priority 10 — Car wash / vending lead intelligence

- Priority 13 — Contract automation

- Priority 14 — AI-powered sales communication

- Priority 15 — Automated commission tracking

---

## Phase 8 Validated Totals

| | Current Weekly Burden | Realistic Weekly Savings |
|---|---|---|
| Sales team (admin + logging + follow-up) | ~25-30 hrs/week | ~15-20 hrs/week |
| Admin re-keying (both entities) | ~135-150 hrs/week | ~65-75 hrs/week |
| **Combined total** | **~160-180 hrs/week** | **~80-95 hrs/week** |

**Key non-time metrics:**

- 3x close rate improvement if leads are contacted within 30 minutes (vs. current 3-5 day slip)

- Car wash outbound currently stalled due to data quality — pipeline generation opportunity is significant

*John Farrugia confirmed these numbers feel right (March 26, 2026).*

---

*Document generated from 90-minute Department X-Ray interview + Phase 8 Time Savings Deep-Dive, March 26, 2026.*

*Review and update as automations are implemented and new pain points surface.*
