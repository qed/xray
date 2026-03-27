# Sales Operations — Department Profile
**Wevend | WeVend Business Unit**
**Last Updated:** March 25, 2026
**Session Lead:** Layal Scheirich, VP of Sales Operations

---

## 1. Department Overview

**Department Name:** Sales Operations

**Mission:** Own and continuously improve the end-to-end process from signed partner agreement through merchant live deployment. This includes partner onboarding, merchant onboarding, add-on terminal management, partner status visibility, billing and residual payout oversight, and the cross-departmental automation roadmap.

**Scope:** WeVend business unit only. MonexGroup operates its own separate processes managed by their sales reps. Some admin work (Fiserv Co-Pilot boarding, gateway sync) touches both entities but is managed separately.

**Primary Focus in 2026:** Automate the full onboarding pipeline to support scaling from ~100 merchants/month to 200+/month without proportionally scaling headcount. Close the gap between a 2-3 day turnaround and the 24-hour standard partners expect.

---

## 2. Team Structure

| Name | Title | Reports To | Employment Type |
|---|---|---|---|
| Layal Scheirich | VP of Sales Operations | Executive Leadership | Full-time |
| Roxana | Onboarding Specialist / Sales Coordinator | Layal (solid line) | Full-time |
| Admin Team (3 people) | Merchant Processing / Admin | Layal (dotted line) | Full-time |
| Account Manager | Partner Relationship Manager | Layal (dotted line) | Open hire |

**Admin Team Detail:** All three admin team members perform the same core functions (application processing, system entry, boarding, portal setup). One of the three serves as supervisor and also performs the same hands-on work.

**Hiring:** One Account Manager is being brought on to handle day-to-day partner relationships post-close. This role will report to Layal on a dotted-line basis.

**Key Cross-Departmental Partner:**
- **Bruna Lima** (AI Champion) — not on Layal's team but a critical partner. Bruna drives AI and automation implementation across the company and is actively involved in improving Sales Operations workflows.

**Capacity Note:** The current team (Layal + Roxana + 3 admin) is handling ~100 merchants/month today and is being asked to scale to 200/month in the next 2-3 months with no planned headcount increase. This is the department's single largest operational risk.

---

## 3. Tools & Systems

| Tool | Type | Purpose | Status |
|---|---|---|---|
| **WeTrack** | In-house CRM | Primary system of record for WeVend. Stores merchant data, generates contracts, syncs credentials to gateway. | Active; automation being built on top of it |
| **WeCenter** | In-house portal | Partner and merchant dashboard. Post-boarding visibility for sales data and live transactions. New intake form being added. | Active; expanding |
| **WeSell** | In-house sales tool | Sales rep day-to-day lead tracking. Basic CRM for the sales team. | Active; not recently prioritized |
| **Fiserv Co-Pilot** | 3rd party | Merchant underwriting and onboarding via Fiserv. Generates VAR sheet and merchant credentials post-approval. | Active; API integration planned |
| **WeVend Gateway** | In-house | Payment gateway. Merchant credentials are synced here post-approval. | Active |
| **Cashub** | 3rd party (TMS) | Terminal Management System. Admin creates parameter files; deployment programs terminals here. | Active |
| **Jotform** | 3rd party | Current merchant intake form tool. Being replaced by WeCenter-native intake form. | Active (temporary) |
| **DocuSign** | 3rd party | Contract execution and e-signature for merchant agreements and partner agreements. | Active |
| **Google Spreadsheet** | 3rd party | Manual merchant status tracker, shared with partners. Updated daily/hourly. | Active (to be replaced) |
| **SharePoint** | Microsoft | Document storage. Current AI-generated merchant applications download here. | Active |
| **Email (Microsoft)** | Microsoft | All internal team handoffs today. Primary communication method between Roxana, admin, and deployment. | Active; significant bottleneck |
| **Microsoft Teams** | Microsoft | Meetings across departments. Layal's primary meeting tool. | Active |
| **Phorge** | 3rd party | MonexGroup CRM. Not in Layal's scope. | Out of scope |

---

## 4. Core Workflows

### 4A. Merchant Onboarding — Current State (Pre-Automation)

**Trigger:** Partner sends Jotform link to merchant.
**End Point:** Merchant is live on gateway, terminals programmed and ready to deploy.

| Phase | Description | Owner | Active Effort | Variable Drivers |
|---|---|---|---|---|
| Phase 1 | Partner setup in WeTrack; Jotform created for that partner | Sales / Partner team | Minimal; not per-merchant | N/A |
| Phase 2 | Merchant completes Jotform; AI generates merchant application; downloads to SharePoint | Merchant / System | Merchant-driven | Merchant responsiveness |
| Phase 3 | Roxana reviews application in SharePoint, cleans up errors, follows up with merchant if anything is missing, enters merchant into Google Sheet tracker, sends to DocuSign | Roxana | ~20 min per application | Intake quality, merchant responsiveness |
| Phase 4 | Agreement sent via DocuSign; merchant signs first, rep signs second; admin notified on completion | System / Merchant / Rep | Low internal labor | Signing speed |
| Phase 5 | Admin reviews signed paperwork; manually keys merchant data into WeTrack; manually keys same data into Fiserv Co-Pilot; submits for underwriting | Admin | ~30-35 min per application | Data accuracy, follow-up volume |
| Phase 6 | Fiserv underwrites application; approval ranges from 1 hour to 48 hours; VAR sheet generated ~24 hours post-approval | Fiserv / Admin | Minimal internal labor | Fiserv review time; requests for more info |
| Phase 7 | Admin downloads VAR sheet; enters credentials into WeTrack; clicks SYNC to push to gateway; creates WeCenter portal login for merchant | Admin | ~15 min per application | None |
| Phase 8 | Admin creates Cashub parameter file (15 min); sends deployment coordination email with VAR sheet (5 min); sends welcome email and letter to partner/merchant (5 min); deployment team programs terminals (5-10 min per terminal) | Admin / Deployment | Admin ~25 min; Deployment 5-10 min/terminal | Terminal count; QR code requirement |

**Total Fixed Internal Labor Per Merchant:** ~65-75 minutes across Phases 3, 5, 7, and 8.
**Most Time-Intensive Phase:** Phase 5 (admin re-keying) at 30-35 minutes.
**Largest Variable Effort:** Phase 8 deployment — a merchant with 10 terminals requiring QR codes can take up to 100 minutes of deployment time alone.

---

### 4B. Merchant Onboarding — New State (Launching in ~2 Weeks)

**What Changes:**
- Partner initiates intake form from within WeCenter.
- Merchant completes the in-house intake form (replaces Jotform).
- Form auto-populates WeTrack and sends Roxana a notification.
- Roxana reviews and cleans data in WeTrack, then clicks "Generate Contract."
- WeTrack auto-generates and sends the contract via DocuSign.
- After signing, data is already in WeTrack — admin confirms it is clean and enters into Co-Pilot manually (for now).
- API integration from WeTrack to Co-Pilot is planned (timing TBD) to eliminate that manual step.
- Once approved, admin uses WeTrack to sync credentials to gateway (partially automated today; full automation planned).
- Cashub boarding remains manual until Co-Pilot API is confirmed.

**What This Eliminates:** Roxana's manual entry into Google Sheets; admin's manual re-keying into WeTrack; contract generation step.
**What Still Requires Human Effort:** Co-Pilot entry (until API), Cashub setup, deployment coordination, welcome email/letter.

---

### 4C. Partner Onboarding — Current State

**Trigger:** Partner signs partnership agreement and is ready to onboard.
**Layal's Responsibility:** Phase 2 (Partner Onboarding) and ensuring Phase 3 (Partner Training) runs smoothly. Phase 1 (Initiation) is owned by Sales and the Integrations team.

**Phase 1 — Initiation (Sales + Integrations):**
- Sales submits integration form
- Integrations team sets up Integration Board and confirms with Sales
- Kick-off call with client and Integrations team (1-2 days)
- Test terminal ordered and shipped (3-5 days)
- Integrations team reviews development requirements and sets timelines (3 days)
- If additional development is required: scoped and scheduled separately

**Phase 2 — Partner Onboarding (Layal's team — all manual today):**
1. Partner completes Jotform; admin manually keys partner into WeTrack
2. Admin manually creates WeCenter access and feature set for that partner
3. Admin manually creates a dedicated Jotform for that partner's merchants to use
4. Admin manually notifies reps that onboarding is complete
5. Admin populates partner credentials into welcome package and manually sends it

*Typical timeline for Phase 2 admin work: approximately 1 day per step.*

**Phase 3 — Partner Training (Operations team — separate department):**
- WeCenter training for partner (~1 hour)
- Merchant onboarding training (~1 hour)
- Terminal programming and NMI training (~2 hours, if required)
- Cashub training (~1 hour, if required)
- Deployment and NMI training (~2 hours)
- Gateway/Cashub access created for partner
- Integrations team reviews all deliverables
- Partner satisfaction intake form sent and collected
- Sales team shares onboarding sign-off with internal stakeholders

**Note:** Layal does not own Phase 3 but actively wants to contribute to improving its efficiency, particularly around scheduling, access creation, and the satisfaction intake process.

---

### 4D. Add-On Terminal Process

**Trigger:** Existing merchant requests additional terminals.
**Volume:** ~20-30 requests/month today; growing as merchant base grows.

**Current Process (until WeVend takes on billing, ~1 month away):**
1. Roxana prepares an updated WeVend application reflecting new terminal quantity
2. Roxana prepares an updated Fiserv Schedule A with new rate (rate = quantity × per-terminal monthly fee; e.g., 10 terminals × $9 = $90/month)
3. Merchant signs via DocuSign: updated WeVend agreement + Fiserv rate change form
4. Signed paperwork submitted to admin
5. Admin orders new Terminal IDs (TIDs) from Fiserv and requests monthly fee update
6. Admin receives new TIDs, syncs them to gateway via WeTrack
7. Admin passes TIDs to deployment team for programming in Cashub

**Interim Process (after WeVend takes on billing):**
1. Merchant submits Jotform with: location name, legal name, Merchant ID, new terminal quantity and type
2. Jotform includes T&Cs; merchant signs
3. Order submitted to admin (CC Roxana)
4. Admin orders new TIDs from Fiserv (no rate change form needed — WeVend bills per-terminal separately)
5. Admin syncs new TIDs to gateway, passes to deployment for Cashub programming

**Smart Capacity Move:** For new merchant deployments, the team is beginning to pre-order double the initial TID quantity upfront. This builds a spare inventory so that add-on requests can be fulfilled without going back through Co-Pilot until spares are exhausted.

**Unknown:** Whether the Co-Pilot API integration will support automating TID ordering for add-ons.

---

## 5. Partner Status Visibility & Communication

**Current Method:** One Google Spreadsheet per active partner, updated daily or hourly by Roxana and/or admin.

**Current Cadence:**
- 1 partner: daily status call
- 3-4 partners: weekly status calls
- All active partner spreadsheets: updated daily/hourly

**Near-Term Projection:** 7-8 partners requiring active communication cadence within 1 month.

**The Root Problem:** Partners require calls because they have no real-time visibility into their merchants' onboarding status. The spreadsheet is a workaround for the absence of a live dashboard. The WeCenter portal is intended to replace this, but is not yet providing the status visibility that partners need.

---

## 6. Billing & Residual Payout System

**Overview:** Layal oversees the billing and residual payout system. The development team builds and maintains it; Layal provides the business logic and requirements.

**Active Partners on Billing:** 10-15
**Billing Configuration Variations (current):** 3-4 distinct structures:
1. Simple percentage residual share
2. Split and splice of specific fees
3. Partner marks up fees and keeps the margin difference
4. Partner's own SaaS fees billed through Wevend

**How Logic Gets Documented Today:** Layal reads the partnership agreement, explains the billing logic verbally to the development team, and the development team notes it in their own internal systems and implements it.

**Risk:** The billing logic lives across three places — the legal partnership agreement, Layal's knowledge, and the dev team's internal notes. There is no centralized, standardized billing logic specification document. As partner count grows and billing structures get more complex, this creates material risk of payout errors and contract compliance issues.

---

## 7. Competitive Context & SLA Gap

| Metric | Current Reality | Target | Competitor Benchmark |
|---|---|---|---|
| Merchant approval (Fiserv) | 2-3 hours (most accounts) | N/A | Same day (PAYFACs) |
| Post-approval to live | 2-3 business days | 24 hours | Same day (PAYFACs) |
| Partner expectation | — | 24 hours | 24 hours |
| Internal labor per merchant | ~65-75 minutes | Reduce to <20 min | — |

**Core constraint:** Wevend is not yet a PAYFAC. They are dependent on Fiserv underwriting, which is not the bottleneck (most approvals are 2-3 hours). The bottleneck is internal execution speed after approval — admin capacity, manual re-keying, and email-based handoffs.

---

## 8. Strategic Projects (Layal-Led)

### PAYFAC / PAYFAC Lite
- Layal has completed a comparative analysis of PAYFAC vs PAYFAC Lite with Fiserv (costs, commitments, system requirements).
- Waiting on Fiserv to schedule a meeting to discuss details and ask questions.
- Decision and next steps to follow that meeting.
- **Target Go-Live: June–July 2026.**
- **Strategic Importance:** This is the highest-leverage project in the company. Becoming a PAYFAC eliminates dependence on Fiserv underwriting entirely and enables same-day merchant approvals, directly matching or beating the competition.

### ISO Registration
- Layal is managing the process of registering Wevend as an ISO with multiple acquirers.
- This diversifies away from single-acquirer dependency and expands the payments ecosystem.

### WeSell Improvement
- In-house sales tracking tool for reps. Currently functional but basic.
- Not a current priority — Layal has identified this as the next project after the onboarding automation is complete.

### Merchant Application Maintenance
- Layal is responsible for keeping merchant applications current and compliant with the latest requirements, updated to reflect new services and pricing structures.

### Residual Audit (Monthly)
- Layal manually audits residual payout files received from acquirers on a monthly basis.
- The purpose is to verify Wevend is being paid correctly against the terms of each partnership agreement.
- Any discrepancies are identified and resolved by Layal.
- This is currently a fully manual process. As merchant volume and partner count grow, the volume of residual transactions to audit will grow proportionally, making this a strong candidate for automated reconciliation.

---

## 9. Handoffs & Dependencies Map

| From | To | Method | Bottleneck? |
|---|---|---|---|
| Merchant | Roxana | Jotform submission (system notification) | Yes — intake quality drives rework |
| Roxana | DocuSign | Manual folder action | Low friction |
| DocuSign | Admin | Email notification | Yes — email sits unnoticed; no SLA |
| Admin | Fiserv Co-Pilot | Manual re-keying | Yes — 30-35 min of duplicate labor |
| Fiserv | Admin | Email notification (VAR sheet ready) | Yes — creates idle waiting time |
| Admin | Deployment | Email with VAR sheet and deployment form | Yes — email delay; no visibility |
| Admin | Merchant/Partner | Email (welcome letter) | Manual, templated, no automation |
| Layal | Dev team | Verbal explanation + partnership agreement | Risk — no written spec document |

**Key External Dependencies:**
- **Fiserv**: Underwriting timeline (out of Wevend's control), Co-Pilot API access (TBD), TID ordering, VAR sheet generation
- **Development team**: WeTrack automation builds, Co-Pilot API integration, billing system
- **Deployment team**: Terminal programming (separate team, Phase 8)
- **Integrations team**: Partner Phase 1 work, Cashub Enterprise setup, development requirement reviews
- **Legal (outside counsel)**: Partnership agreement updates

---

## 10. Tribal Knowledge & Key Risks

| Risk | Description | Impact |
|---|---|---|
| Roxana single-threaded | No knowledge risk (Layal knows everything Roxana does). Pure capacity risk. One person doing full-time work that scales to 200/month. | High — breaks if volume spikes or Roxana is out |
| Billing logic undocumented | Billing/residual logic lives in Layal's head and dev team notes. No formal spec. | High — payout errors and compliance risk as partner count grows |
| Email-based handoffs | Every internal handoff depends on someone seeing and acting on an email. | Medium-High — creates delays and invisible queues |
| Google Sheet status tracking | Partner status visibility dependent on manual spreadsheet updates | Medium — unsustainable at 7-8+ partners |
| Co-Pilot API unknown | Full merchant onboarding automation blocked until API access is confirmed | High — keeps admin re-keying step alive |

---

## 11. Key People Directory (Internal)

| Name | Role | Relevance |
|---|---|---|
| Layal Scheirich | VP of Sales Operations | Department lead |
| Roxana | Onboarding Specialist / Sales Coordinator | Merchant processing; add-on terminals |
| Bruna Lima | AI Champion | AI/automation partner across all projects |
| Sohail Zafar | (Billing / Product) | Billing Weekly Meeting; Product/Project Update |
| John Farrugia | (Sales) | Weekly Sales Meeting |
| Oswin Menezes | (Sales) | Sales calls; partner opportunities |
| Prakash Kunthasami | (Operations/Strategy) | Sales cycle and onboarding journey discussions |
| Mohamed Bakoush | (Marketing) | WeVend Marketing Weekly |
| Admin Supervisor | Admin Team Lead | Oversees and works alongside the 3-person admin team |

---

*Document generated from a 90-minute structured interview session on March 25, 2026.*
*Follow-up sessions recommended to cover: WeSell improvement roadmap; PAYFAC decision and implementation planning; billing logic documentation project.*
