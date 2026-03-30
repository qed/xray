# Human Resources — Automation & Agent Opportunities
**Wevend / MonexGroup**
*Session Date: March 30, 2026*

---

## Summary

**Total estimated time saved per week: ~6.5 hours**
**Department lead:** Rob Maynard, HR Manager
**Context:** All recommendations are evaluated through a cost-sensitivity lens. The HR department operates on a lean, low-cost tooling stack. New systems require a strong ROI case. Free or near-free solutions are strongly preferred.

---

## Priority Rankings

| # | Opportunity | Time Saved/Week | Complexity | Cost Sensitivity |
|---|---|---|---|---|
| 1 | AI-Assisted Resume Screening | ~5 hrs | Low–Medium | ✅ Free/low-cost options exist |
| 2 | Digital Onboarding Document Portal | ~22 min | Low | ✅ Free options exist (Google Forms) |
| 3 | E-Signature for Offer Letters | ~15 min | Low | ⚠️ Low-cost (free tiers available) |
| 4 | Standardized Payroll Hours Submission | ~15 min | Low | ✅ Free (form-based) |
| 5 | Automated Manager Follow-Up (Hiring) | ~20 min | Low | ✅ Free (email automation) |
| 6 | HRIS Replacement (TimeQplus) | ~15 min + scalability | High | ❌ Requires system investment |

---

## Detailed Breakdown

---

### #1 — AI-Assisted Resume Screening

**What to automate:** Use AI to pre-screen all incoming resumes against job requirements and surface a ranked shortlist — eliminating the need for Rob to manually review every application from scratch.

**Why it matters:** Resume review is Rob's single largest time drain, consuming ~2 hours per day with active postings. At 3 concurrent postings averaging ~200 resumes each, the volume is unsustainable for one person. AI screening would let Rob focus only on viable candidates.

**Current state:**
- Rob reviews resumes throughout the week as they arrive via Indeed
- Time per resume: 5 seconds (clear no) to 2 minutes (borderline)
- Volume: ~200 resumes per posting × 3 active postings = up to 600 in queue at any time

**Time breakdown:**
| Component | Time |
|---|---|
| Daily resume review time | ~2 hrs/day |
| Working days per week | 5 |
| **Total current time/week** | **~10 hrs/week** |
| Realistic automation savings | 50% (Rob still reviews AI-flagged candidates) |
| **Net time saved/week** | **~5 hrs/week** |

**Recommended approach:**
- Indeed's built-in AI screening tools (Instant Match, Matched Candidates) — already integrated, likely no added cost
- Alternatively: AI prompt-based resume review using Claude or similar, where resumes are batch-evaluated against a scoring rubric
- Rob reviews only the shortlisted candidates rather than the full pool

**Dependencies:** Requires well-defined job criteria per role for AI to score against. Rob would need to build a quick screening rubric for each posting.

**Complexity:** Low–Medium. Mostly a process change; tooling may already be available within Indeed.

---

### #2 — Digital Onboarding Document Portal

**What to automate:** Replace the current email-based document collection process with a digital intake form (e.g., Google Forms or Microsoft Forms) that new hires complete online, with automatic tracking of what has and hasn't been submitted.

**Why it matters:** Currently, Rob emails a document list and documents arrive ad hoc — either before the start date or on day one. There's no tracking mechanism and the checklist itself is acknowledged as outdated. This creates risk and manual follow-up work.

**Current state:**
- Rob emails new hire a list of required documents
- New hire sends documents back via email or brings on day one
- Rob tracks completion manually via email
- No automated reminders or status visibility

**Time breakdown:**
| Component | Time per hire |
|---|---|
| Sending/following up on document requests | ~30 min |
| Processing and filing received documents | ~30 min |
| **Total per hire** | **~1 hr/hire** |
| Hires per month | 2–3 |
| Total time per week | ~45 min/week |
| Realistic automation savings | 50% |
| **Net time saved/week** | **~22 min/week** |

**Recommended approach:**
- Google Forms (free) or Microsoft Forms (free with M365): Build a new-hire intake form that collects all required information and document uploads in one place
- Add automatic email confirmation to the new hire when submission is complete
- Rob receives a completion notification rather than having to chase
- Combine with an updated master checklist (Canadian employees vs. US contractors — different document sets)

**Additional benefit:** Eliminates document-tracking errors and creates a clean paper trail.

**Dependencies:** Need to build separate forms for Canadian employees vs. US contractors (different document requirements). Checklist needs to be audited and updated first.

**Complexity:** Low.

---

### #3 — E-Signature for Offer Letters

**What to automate:** Replace the current print-sign-scan-email process for offer letters with a digital e-signature tool, allowing candidates to sign from any device in minutes.

**Why it matters:** The current process introduces unnecessary friction and candidate delay risk. A candidate who doesn't have easy access to a printer can slow down the start date. E-signature is also a more professional experience for candidates.

**Current state:**
- Rob sends offer letter via email as a document
- Candidate prints, signs, scans, and emails back
- Rob then files the signed copy
- Turnaround is usually within 48 hours, but candidates sometimes delay

**Time breakdown:**
| Component | Time per hire |
|---|---|
| Sending offer + formatting for email | ~15–20 min |
| Following up if candidate delays | ~10–20 min |
| Processing signed copy when received | ~10 min |
| **Total per hire (logistics only)** | **~45 min/hire** |
| Hires per month | 2–3 |
| Total per week | ~25 min/week |
| Realistic automation savings | 60% |
| **Net time saved/week** | **~15 min/week** |

**Recommended approach:**
- **DocuSign** (paid, but low cost per envelope) or **Adobe Acrobat Sign**
- **Free alternatives:** HelloSign (free tier — limited envelopes/month), **Docuseal** (open-source, self-hosted), or **PDF.co** for basic e-sign
- Given cost constraints: start with a free-tier tool and evaluate volume fit

**Additional benefit:** Faster offer close time, better candidate experience, automatic signed-copy archiving.

**Dependencies:** Requires selecting and setting up a tool. Low lift once chosen.

**Complexity:** Low.

---

### #4 — Standardized Payroll Hours Submission

**What to automate:** Replace the current ad hoc, inconsistent manager submission process (some email lists, some CC'd approval emails) with a standardized form that all managers complete on the same schedule, in the same format.

**Why it matters:** Rob currently reconciles across different submission styles before he can enter data into TimeQplus. This creates manual overhead and increases the chance of errors reaching Accounting.

**Current state:**
- Some managers send a compiled list of approved hours
- Others CC Rob on individual vacation approval emails
- Rob reconciles all submissions, then manually enters into TimeQplus
- Process runs semi-monthly (~1 hr per pay period)

**Time breakdown:**
| Component | Time |
|---|---|
| Collecting and reconciling manager submissions | ~30–40 min per pay period |
| Entering into TimeQplus | ~20 min per pay period |
| **Total per pay period** | **~1 hr** |
| Pay periods per month | 2 |
| Total time per week | ~30 min/week |
| Realistic automation savings | 50% |
| **Net time saved/week** | **~15 min/week** |

**Recommended approach:**
- Build a simple Google Form or Microsoft Form that managers complete semi-monthly
- Form captures: employee name, hours worked, vacation taken, sick days, unpaid time
- Auto-compiles responses into a spreadsheet (Google Sheets / Excel) that Rob can review and validate before entry into TimeQplus
- Set a calendar reminder for managers to complete the form by a set deadline (e.g., 3 days before payroll cutoff)

**Additional benefit:** Reduces error rate, creates audit trail, enforces submission deadline.

**Dependencies:** Manager buy-in to use the form consistently. Simple to implement; adoption is the risk.

**Complexity:** Low.

---

### #5 — Automated Manager Follow-Up (Hiring Pipeline)

**What to automate:** When Rob sends a candidate shortlist to a manager, trigger an automatic reminder if no response is received within 48 hours — without Rob having to manually follow up.

**Why it matters:** Manager delays in reviewing candidates are Rob's stated #1 pain point in the hiring process. While the actual time Rob spends chasing is modest (~30 min/week), the downstream impact — open roles sitting unfilled longer — has a larger organizational cost.

**Current state:**
- Rob emails shortlist to manager
- Informally expects ASAP response
- If delayed, Rob sends in-person reminder or follows up via email with manager's manager CC'd
- No formal SLA or automated enforcement

**Time breakdown:**
| Component | Time |
|---|---|
| Manual follow-up emails and reminders | ~30 min/week |
| Realistic automation savings | ~65% |
| **Net time saved/week** | **~20 min/week** |

**Recommended approach (free options):**
- **Email template + calendar reminder:** Rob sets a 48-hour follow-up reminder when sending shortlists. Low-tech but disciplined.
- **Outlook/Gmail follow-up flags:** Use built-in email follow-up reminders
- **Indeed's messaging tools:** Use Indeed's platform to track manager response activity on shared candidates
- Longer term: an ATS (Applicant Tracking System) with manager review workflow and automated reminders would formalize this entirely

**Bigger opportunity:** The real win here is formalizing a 48-hour SLA with managers and getting leadership buy-in to enforce it. The automation reinforces the process; the process change is what unlocks the speed.

**Dependencies:** Leadership alignment on a formal response SLA.

**Complexity:** Low.

---

### #6 — HRIS Replacement (TimeQplus)

**What to automate / replace:** Replace TimeQplus with a modern, scalable HRIS that removes the 50-employee hard cap and consolidates hours tracking, vacation management, and payroll handoff — ideally with self-service for employees and managers.

**Why it matters:** This is a **growth blocker**. Wevend is actively scaling from ~50 to many more employees. The current system cannot add another user. This is not optional — it must be replaced before the next significant hire wave.

**Current state:**
- TimeQplus handles hours tracking and vacation tracking
- At 50-employee limit — no room to grow
- Data is manually exported/shared with Accounting for payroll

**Time breakdown (with a modern HRIS):**
| Component | Current | With HRIS |
|---|---|---|
| Hours/vacation entry | Manual | Manager/employee self-service |
| Payroll export to Accounting | Manual share | Automated report/export |
| Vacation request tracking | Manual entry by Rob | Employee self-serve with manager approval workflow |
| **Total estimated time saved/week** | | **~15 min/week (direct) + significant indirect** |

**Recommended approach:**
- **BambooHR** — popular SMB HRIS, reasonable pricing, strong onboarding/offboarding/time-off features
- **Rippling** — more expensive but handles Canada + US compliantly with contractor support
- **Humi** — Canadian-focused HRIS, strong for Canada/US split (strong fit for Wevend's structure)
- **Gusto** — US-focused, good for contractor management
- Given cost sensitivity: evaluate Humi (Canadian-first) or BambooHR as starting points

**Important note:** This requires a system investment. Cost justification should factor in: growth enablement, time savings across payroll + vacation + onboarding, compliance risk reduction, and the cost of NOT replacing it (manual workarounds at 60+ employees).

**Dependencies:** Budget approval. Likely requires leadership sign-off. Implementation requires data migration from TimeQplus.

**Complexity:** High (system selection, implementation, migration, training).

---

## Total Time Savings Summary

| Opportunity | Time Saved/Week |
|---|---|
| #1 — AI Resume Screening | ~300 min (5 hrs) |
| #2 — Onboarding Document Portal | ~22 min |
| #3 — E-Signature for Offer Letters | ~15 min |
| #4 — Standardized Payroll Submission | ~15 min |
| #5 — Automated Manager Follow-Up | ~20 min |
| #6 — HRIS Replacement | ~15 min (direct) |
| **TOTAL** | **~387 min (~6.5 hrs/week)** |

*At 6.5 hours saved per week, that represents approximately **16% of a standard 40-hour work week** returned to Rob for higher-value HR work.*

---

## Quick Wins (Start Here)

These three can be implemented in days with zero or near-zero cost:

1. **Enable Indeed's built-in AI matching/screening** — already in the platform, just needs to be configured per posting
2. **Build a Google Form for payroll hours submission** — 1–2 hours to build, immediate impact on consistency
3. **Create an updated onboarding document checklist in Google Forms** — replaces the emailed list with a trackable intake form

---

## Follow-Up Items Flagged

- US contractor onboarding document requirements need to be standardized (W-9, contract structure)
- Formal 48-hour candidate review SLA needs leadership alignment before automation can enforce it
- TimeQplus replacement requires budget conversation — recommend initiating now before next growth wave hits the cap
- Offer letter checklist: consider whether ~40% of "complex" offers could be pre-templated for common scenarios to reduce lawyer touchpoints
