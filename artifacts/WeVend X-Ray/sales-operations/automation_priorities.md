# Sales Operations — Automation Priorities
**Wevend | WeVend Business Unit**
**Last Updated:** March 25, 2026
**Prepared for:** Layal Scheirich, VP of Sales Operations

---

## Bottom Line

The biggest time win comes from fixing data flow first. One intake. One system of record. Zero re-keying. Everything downstream gets faster once that is solved.

The second biggest lever is partner onboarding automation — it is almost entirely manual today and the steps are well-defined, making it a high-value, achievable target.

---

## Priority 1 — Eliminate Duplicate Data Entry Across Merchant Onboarding Systems

**Status:** In Progress (2-3 weeks to first phase)

**What to Automate:**
The same merchant data is currently reviewed, cleaned, and keyed three to four times across Jotform, SharePoint, WeTrack, and Fiserv Co-Pilot. Every step is human-touched.

The WeCenter intake form + WeTrack auto-population removes the first re-keying (admin entry into WeTrack). The Co-Pilot API integration removes the second (admin entry into Co-Pilot). The gateway sync is already being built into WeTrack. Together, these three automation layers eliminate the core data duplication problem.

**Phases:**
- Phase A (in progress): WeCenter intake form → auto-populate WeTrack → auto-generate contract → send via DocuSign
- Phase B (planned): WeTrack → Co-Pilot API integration → eliminate admin Co-Pilot entry
- Phase C (planned/TBD): Co-Pilot API → confirm whether TID ordering and Cashub sync can be automated

**Why It Matters:**
This is the single largest fixed labor cost in the operation. Phase 5 (admin Co-Pilot re-keying) alone is 30-35 minutes per merchant. At 200 merchants/month, that is 100+ hours of admin labor per month on a single task. Eliminating it frees the admin team to handle volume without hiring.

**Estimated Time Savings:**
- Phase A: ~20 minutes per merchant (Roxana's manual entry + contract gen)
- Phase B: ~30-35 minutes per merchant (admin Co-Pilot re-keying)
- Phase C: ~15 minutes per merchant (VAR sheet and credential entry)
- **Total potential: ~65-70 minutes per merchant → target under 20 minutes**

**At 200 merchants/month:** Recovering 50 minutes per merchant = ~167 hours/month recovered

**Complexity:** Medium-High (API access to Co-Pilot is the unknown; Phase A is straightforward)

**Dependencies:** Dev team availability; Fiserv Co-Pilot API access confirmation; WeTrack development roadmap

---

## Priority 2 — Automate Partner Onboarding Steps

**Status:** Not started

**What to Automate:**
When a partner signs their agreement, five downstream steps are all done manually today. Each one has a clear trigger and a predictable output, making them strong automation candidates.

The five manual steps today:
1. Admin keys partner into WeTrack from Jotform submission
2. Admin manually creates partner's WeCenter access
3. Admin manually creates a dedicated Jotform for that partner's merchants
4. Admin manually notifies reps that onboarding is complete
5. Admin manually populates welcome package with credentials and sends it

**Target State:**
When a partner completes their intake form and is approved, a single workflow automatically: creates the partner record in WeTrack, provisions their WeCenter access, generates their dedicated merchant intake form, sends reps an automated notification, and sends the partner a populated welcome package.

**Why It Matters:**
Partner onboarding is the gateway to merchant onboarding. Every day of delay in setting a partner up is a day before they can start sending merchants. As partner count grows (currently 4-5 active, heading to 7-8 in a month), the manual overhead compounds. This is also a high-visibility process — partners experience it directly and it shapes their first impression of Wevend.

**Estimated Time Savings:** 3-5 hours per new partner onboarded

**Complexity:** Medium (WeTrack API calls, WeCenter provisioning API, Jotform duplication logic, DocuSign-triggered welcome email)

**Dependencies:** WeTrack and WeCenter APIs; Jotform API or in-house replacement; dev team; welcome package template standardization

---

## Priority 3 — Replace Spreadsheet Status Tracking with Real-Time Partner Dashboard

**Status:** Not started; WeCenter is the planned solution

**What to Automate:**
Today, Roxana (and admin) manually update one Google Spreadsheet per active partner, daily or hourly, so partners can see the status of their merchants moving through the onboarding process. Daily or weekly status calls exist because there is no live visibility.

**Target State:**
Partners log into WeCenter and see a live dashboard showing every merchant they have submitted: current stage, outstanding items, approvals, and estimated go-live. No spreadsheet. No status call unless something needs a real conversation.

**Why It Matters:**
This is both a capacity and a relationship problem. Layal's team is currently maintaining 4-5 spreadsheets daily and running 1 daily + 3-4 weekly status calls. At 7-8 partners (one month away), this becomes unsustainable. Solving it also improves the partner experience and reduces inbound status questions dramatically.

**Estimated Time Savings:**
- Spreadsheet maintenance: estimated 30-60 minutes/day across the team
- Status calls: estimated 1-3 hours/week
- Inbound email/call inquiries: reduced materially

**Complexity:** Medium (WeCenter already exists; requires onboarding pipeline status to flow into it properly; depends on Priority 1 being in place so data actually lives in WeTrack in real time)

**Dependencies:** Priority 1 (WeTrack as system of record); WeCenter development; data model for pipeline status visibility

---

## Priority 4 — Automate Welcome Letters and Notifications

**Status:** Not started

**What to Automate:**
After a merchant is approved and live, admin manually prepares and sends a welcome email and welcome letter to the partner and merchant. The letter requires populating merchant-specific credentials (gateway credentials, portal login, etc.). This is a templated, data-driven communication that should be fully automated.

Similarly, internal notifications throughout the onboarding process (admin notified when DocuSign is complete, deployment notified when Cashub parameter file is ready, etc.) all travel via email today with no automation or escalation logic.

**Target State:**
When a merchant reaches a status milestone in WeTrack (approved, credentials synced, ready to deploy), a workflow automatically sends the appropriate welcome communication populated with that merchant's specific data. Internal handoff notifications are also automated, replacing manual emails with system-triggered tasks.

**Why It Matters:**
Every manual notification email is a human in the loop creating a delay. At 200 merchants/month, even a 5-minute notification email represents 1,000 minutes of admin time per month. More importantly, the real cost is delay — emails sit unread, handoffs get missed, and merchants wait longer than they need to.

**Estimated Time Savings:**
- ~10-15 minutes per merchant in communication prep
- Delay reduction in each handoff: potentially hours

**Complexity:** Low-Medium (templated emails with variable data from WeTrack; webhook or trigger-based; no complex business logic)

**Dependencies:** WeTrack as the trigger source (Priority 1); standardized welcome letter templates; email automation tool (can use existing infrastructure)

---

## Priority 5 — Standardize and Document Billing Logic

**Status:** Not started; manual and undocumented today

**What to Build:**
A centralized billing logic specification document — a structured format that maps each partner's billing configuration clearly, including: revenue share percentage, fee splits, markup structures, SaaS billing pass-throughs, and payout calculation rules.

This document should serve as the handoff between Layal and the development team for every new partner, replacing the current verbal explanation + legal agreement review process.

**Why It Matters:**
This is a compliance and trust risk. With 10-15 partners and 3-4 billing variations today, the logic is manageable. But the partner count is growing fast, and billing structures are getting more complex. A payout error is not just a finance problem — it damages the partner relationship and creates legal exposure.

**Target State:**
Every new partner's billing logic is captured in a standard template at the time the partnership agreement is signed. The dev team builds from the spec, not from a verbal explanation. Discrepancies are caught before implementation, not after.

**Estimated Risk Reduction:** Material reduction in payout error risk and compliance exposure

**Complexity:** Low (this is a documentation and process standard, not a technical build)

**Dependencies:** Layal's time (30-60 minutes per partner to document retroactively); partnership agreement access; dev team alignment

---

## Priority 6 — Streamline Add-On Terminal Process

**Status:** Partially addressed; Jotform solution in planning

**What to Automate:**
Add-on terminal requests (20-30/month and growing) today require Roxana to manually prepare updated application paperwork and rate change forms, get DocuSign signatures, and hand off to admin for manual TID ordering. The interim Jotform solution (merchant self-submits the add-on request) removes Roxana from the intake step. The next automation target is the admin TID ordering step.

**Current Smart Fix:** Pre-ordering double TIDs upfront for new merchants to build a spare inventory. This eliminates the need to go through Co-Pilot for many add-on requests.

**Remaining Target:** Once the Co-Pilot API integration is confirmed (Priority 1, Phase C), determine whether TID ordering can be triggered automatically from a WeTrack add-on request workflow.

**Why It Matters:**
At 20-30 requests/month growing with the merchant base, this is compounding volume. Roxana is currently doing all of this manually. As the merchant base doubles, add-on volume could reach 40-60/month.

**Estimated Time Savings:** ~30-45 minutes per add-on request (current state)

**Complexity:** Low for interim Jotform fix; Medium-High for Co-Pilot API TID ordering automation

**Dependencies:** Co-Pilot API (TBD); WeVend billing takeover (1 month away); dev team

---

## Priority 7 — Partner Training Phase Efficiency (Cross-Departmental)

**Status:** Not Layal's direct ownership; flagged as improvement opportunity

**What to Improve:**
Phase 3 (Partner Training) is owned by the Operations/Training team but contains several manual steps Layal has flagged:
- Training scheduling (no automated scheduling tool)
- Gateway and Cashub access creation for new partners
- Integrations team review coordination
- Partner satisfaction intake/sign-off process

**Why It Matters:**
Partner training delays hold up partner activation, which delays the first merchant submission. Any reduction in Phase 3 cycle time directly accelerates revenue.

**Recommendation:**
- Scheduling: Calendly or equivalent tool for self-service training booking
- Access creation: tie to the partner onboarding automation (Priority 2) so gateway/Cashub access is provisioned automatically
- Sign-off: automate the partner satisfaction intake to trigger at the right milestone, not manually

**Complexity:** Low-Medium (scheduling tool is a quick win; access automation depends on Priority 2)

**Dependencies:** Operations/Training team buy-in; Layal's cross-departmental influence

---

## Priority 8 — Residual Audit Automation

**Status:** Fully manual; monthly cadence

**What to Automate:**
Layal currently manually audits residual payout files from acquirers on a monthly basis to verify Wevend is being paid correctly. This involves reviewing acquirer-provided data, comparing against expected residuals based on partner agreements, and flagging and resolving discrepancies.

**Target State:**
Automated reconciliation logic that compares incoming acquirer residual files against expected payout calculations stored in the billing system. Discrepancies are flagged automatically for Layal to review and act on, rather than requiring a manual line-by-line audit.

**Why It Matters:**
This is a revenue assurance function. Errors that go undetected mean Wevend is leaving money on the table. As the merchant base scales to 200+/month, the volume of residual transactions grows proportionally. Manual auditing at that scale becomes untenable.

**Estimated Time Savings:** Depends on current audit time (to be quantified). At minimum, reduces audit time from hours to exception review minutes.

**Complexity:** Medium (requires access to acquirer data formats; reconciliation logic; integration with billing system)

**Dependencies:** Billing system development (Priority 5); acquirer data file access; dev team

---

## Summary View

| Priority | Item | Status | Complexity | Time Impact |
|---|---|---|---|---|
| 1 | Eliminate merchant onboarding re-keying | In Progress | Medium-High | 65-70 min/merchant |
| 2 | Automate partner onboarding steps | Not started | Medium | 3-5 hrs/partner |
| 3 | Real-time partner status dashboard | Not started | Medium | 1-3 hrs/week + daily spreadsheets |
| 4 | Automate welcome letters and handoff notifications | Not started | Low-Medium | 10-15 min/merchant + handoff delays |
| 5 | Standardize billing logic documentation | Not started | Low | Risk reduction; compliance |
| 6 | Streamline add-on terminal process | Partially addressed | Low-Medium | 30-45 min/request |
| 7 | Partner training phase efficiency | Cross-departmental | Low-Medium | Training cycle time |
| 8 | Residual audit automation | Not started | Medium | Monthly audit hours |

---

## Biggest Unresolved Unknown

**Fiserv Co-Pilot API access** is the single biggest dependency blocking automation priorities 1B, 1C, 6, and 8. Until this is confirmed and scoped, a meaningful portion of the admin labor in the process remains manual regardless of what else is built.

**Recommended action:** Make confirming Co-Pilot API access a near-term priority so that the automation roadmap can be planned with certainty.

---

## Strategic Context

**PAYFAC / PAYFAC Lite (June–July 2026 target):** This is the highest-leverage strategic project in the company. Once Wevend becomes a PAYFAC, they own the underwriting process and can approve merchants in minutes rather than hours. Combined with the automation priorities above, this creates the path to a true same-day onboarding experience — matching or beating every competitor in the market.

---

*Document generated from a 90-minute structured interview session on March 25, 2026.*
