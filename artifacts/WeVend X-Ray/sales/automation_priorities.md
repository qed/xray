# Sales — Automation & Agent Priorities
**Date:** March 27, 2026
**Source:** Department X-Ray interview with Oswin Menezes, Head of Sales
**Review Cadence:** Weekly with Peter Kuperman

---

## Priority Summary

| Rank | Opportunity | Est. Time Saved (weekly) | Complexity | Impact |
|---|---|---|---|---|
| 1 | AI-Powered Prospecting & Qualification Agent | 15-20 hours | Medium | High |
| 2 | AI Email Management & Filtering | 15-20 hours | Medium | High |
| 3 | CRM Overhaul — Pipeline, Dashboards, Forecasting | N/A (capability gap) | High | High |
| 4 | Standardized Proposal & Pricing Automation | 5-8 hours | Medium | High |
| 5 | Merchant FAQ / Self-Service Portal | 10-15 hours | Low | High |
| 6 | Automated Onboarding + Doc Collection | 5-10 hours | Medium | High |
| 7 | Automated Payment-to-Deployment Handoff | 2-3 hours | Low | Medium |
| 8 | CRM Auto-Population from Emails/Calls | 9-12 hours | Medium | Medium |
| 9 | Follow-Up Tracking & Automation | 3-5 hours | Low-Medium | Medium |
| 10 | Automated Post-Trade-Show Nurture Sequences | 2-4 hours | Low | Medium |
| 11 | Rob's Customer Knowledge Documentation | N/A (risk mitigation) | Medium | Critical (risk) |
| 12 | Weekly Sales Meeting Automation | 1-2 hours | Low | Low |

---

## Detailed Opportunities

### Priority 1: AI-Powered Prospecting & Qualification Agent

**What to automate/improve:**
Build an AI agent that automates the research and qualification of target companies in the unattended retail space. The agent would scan company websites, LinkedIn profiles, and industry databases to determine if a company is a distributor, manufacturer, or ISV — delivering a pre-qualified, prioritized list to reps instead of reps manually researching each company.

**Current state:**
VPs use ChatGPT or Apollo to generate raw prospect lists, then spend several hours per day manually researching each company's website to verify whether they're a distributor, manufacturer, or ISV. The hit rate is approximately 7-10% — only 1 out of every 10-15 companies researched is worth reaching out to. Anthony and Jay spend 80% of their time on prospecting.

**Why it matters:**
This is the #1 priority identified by Oswin for the next 30 days. The manual research bottleneck directly limits pipeline generation. With only 2-4 discovery calls per VP per month, the team needs more qualified targets faster to hit the 10K terminal goal. Eliminating the manual research step could multiply the team's effective prospecting output by 5-10x.

**Estimated time savings:**
15-20 hours/week across the team (several hours/day for Anthony and Jay, plus Rob's 10% prospecting time).

**Complexity:**
Medium. Requires building an AI workflow that can scrape/analyze company websites, classify companies by type (distributor, manufacturer, ISV), assess relevance to the unattended retail space, and output a scored/ranked list. Data sources include company websites, LinkedIn, Apollo, and industry databases.

**Dependencies:**
- Access to Apollo data/API
- Clear definition of what makes a "qualified" target (criteria by vertical)
- Integration with CRM or shared list for rep assignment

**Suggested approach:**
Build a Claude-powered agent that takes a raw prospect list (from Apollo or other sources), visits each company's website, analyzes their business model, classifies them (distributor/manufacturer/ISV/other), scores them by relevance to WeVend's unattended payment solutions, and outputs a prioritized list with key details (company type, estimated terminal opportunity, key contacts, recommended approach). Can start with a manual trigger (rep submits a list) and evolve to scheduled automated runs.

**Success criteria:**
- Reps receive pre-qualified prospect lists requiring minimal manual validation
- Time from "raw list" to "outreach-ready" reduced from hours to minutes
- Discovery call volume increases from 2-4 to 6-10 per VP per month within 90 days
- Hit rate on outreach improves from ~7-10% to 30%+

**WeVend/MonexGroup considerations:**
100% WeVend. Focus on unattended retail verticals: vending, kiosks, EV chargers, laundromats, car washes, parking, self-service. Anthony's Amusement vertical and Jay's Kiosk vertical may need specialized qualification criteria.

---

### Priority 2: AI Email Management & Filtering

**What to automate/improve:**
Deploy an AI-powered email management system that automatically filters, categorizes, and prioritizes emails for Sales reps. The system would route non-essential emails to folders, flag action-required items, draft suggested responses for routine inquiries, and surface only the emails that require the rep's direct attention.

**Current state:**
Rob receives approximately 200 emails per day and spends 30% of his time (roughly 12 hours/week) managing his inbox. Reps are CC'd on irrelevant emails. Merchant support questions, rate/fee inquiries, and operational emails all land in the same inbox as critical deal communications. There is no filtering or categorization system.

**Why it matters:**
Email overload is the second-largest time sink on the team. Rob specifically requested Claude to help manage his inbox. As the customer base grows from 1,500 to 10,000 terminals, email volume will increase proportionally. Without automation, this problem only gets worse.

**Estimated time savings:**
15-20 hours/week (12+ hours for Rob, 3-8 hours across Anthony, Jay, and Oswin).

**Complexity:**
Medium. Requires integration with Outlook/Exchange, training on email categorization rules specific to WeVend's business, and building response templates for common inquiries.

**Dependencies:**
- Access to Outlook/Exchange API or Microsoft Graph
- Defined categorization rules (deal-critical, support redirect, FYI, action required, etc.)
- Merchant FAQ content (for auto-responses to common questions — see Priority 5)
- Rep buy-in and trust in the system

**Suggested approach:**
Phase 1: Build email categorization rules that auto-sort incoming emails into priority buckets (action required, FYI, support redirect, spam/irrelevant). Phase 2: Add suggested response drafts for routine emails (rate inquiries, status updates, support redirects). Phase 3: Auto-route support inquiries to the Customer Service team with context. Can start with Rob as a pilot user.

**Success criteria:**
- Rob's email management time reduced from 12 hours/week to under 3 hours/week
- Reps only see emails requiring their direct attention in their primary inbox
- Support inquiries auto-routed to Customer Service team
- Response time on critical deal emails improves

**WeVend/MonexGroup considerations:**
100% WeVend. Email categorization needs to understand WeVend's business context — deal stages, customer types, product terminology.

---

### Priority 3: CRM Overhaul — Pipeline, Dashboards, Forecasting

**What to automate/improve:**
Transform the in-house WeSell CRM from a basic lead entry form into a full sales operating system with pipeline management, deal tracking, forecasting, activity logging, lead scoring, dashboards, and automation.

**Current state:**
WeSell CRM is an in-house system that captures basic company details, up to 3 contacts, sales details, terminal types, and rates. It has no pipeline view, no dashboards, no forecasting, no activity tracking, no lead scoring, no auto-assignment, and no deal stage automation. Reps don't consistently use it. Critical sales data lives on individual laptops. Oswin has no real-time visibility into where deals sit.

**Why it matters:**
Without CRM capability, the Head of Sales cannot see the pipeline, cannot forecast, cannot track rep performance, and cannot identify stuck deals. This is a fundamental capability gap that undermines every other sales process. As deal volume grows, the lack of visibility becomes existential.

**Estimated time savings:**
Not a direct time savings — this is a capability gap. However, it enables: faster deal identification and prioritization, reduced time pulling updates from reps (Oswin currently does this manually), automated follow-up triggers, and data-driven pipeline management.

**Complexity:**
High. This is a significant development effort on the in-house platform. Oswin's full wish list includes: pipeline reports by rep and total, customizable deal stages, deal visibility, pipeline forecasting by rep/segment/product, multiple pipelines, actual vs. target tracking, activity tracking without manual data entry, lead scoring, auto-assignment of leads, deal stage automation with triggered follow-ups, executive dashboard (pipeline coverage, forecast accuracy, rep performance, deal movement), and real-time updates.

**Dependencies:**
- Development team capacity and prioritization (currently "nobody's working on it yet" — on the Operations team's future roadmap)
- Clear requirements specification (many captured in this interview)
- Data migration from reps' laptops and spreadsheets into the CRM
- Rep adoption and training

**Suggested approach:**
Phase 1 (Quick): Add pipeline stages and a basic pipeline view to the existing CRM. Phase 2: Add dashboard with deal visibility, rep performance, and pipeline totals. Phase 3: Add forecasting, lead scoring, and auto-assignment. Phase 4: Add activity tracking (ideally auto-logging from email). Phase 5: Deal stage automation and triggered follow-ups. Consider whether building all this in-house is the right approach vs. adopting a commercial CRM (HubSpot, Pipedrive, Close) — though Oswin has confirmed the plan is to keep building in-house.

**Success criteria:**
- Oswin can see where every deal sits in real-time without asking reps
- Pipeline reports by rep, segment, and product available on demand
- Forecast accuracy within 15% of actual
- Reps spend zero time on manual pipeline reporting
- Deal stage changes trigger automatic follow-up reminders

**WeVend/MonexGroup considerations:**
100% WeVend initially. System should be designed to support MonexGroup as a separate pipeline if needed in the future.

---

### Priority 4: Standardized Proposal & Pricing Automation

**What to automate/improve:**
Create a standardized proposal generation system with templates, automated pricing insertion, and consistent formatting. Eliminate building proposals from scratch.

**Current state:**
50% of proposals are built from scratch. Proposals go out in a mix of Excel, Word, PowerPoint, and PDF — no standard format. Pricing is referenced from a distributor pricing Excel spreadsheet but isn't templated. Proposals go through 4-5 rounds of revisions covering pricing, scope, legal, and technical specs. Every agreement goes through Oswin personally for pricing discretion and quality control.

**Why it matters:**
Inconsistent proposals hurt professional image and waste time. Multiple revision rounds extend the already 8-10 week sales cycle. Oswin as the sole agreement creator is a bottleneck that won't scale.

**Estimated time savings:**
5-8 hours/week across Oswin and the VPs (proposal creation, revision cycles, pricing lookups).

**Complexity:**
Medium. Requires defining standard proposal templates, building a pricing configurator, and potentially integrating with DocuSign for streamlined contract execution.

**Dependencies:**
- Agreement on a standard proposal format and template
- Pricing rules codified (when standard pricing applies vs. when discretion is needed)
- Approval workflow if VPs create proposals directly (Oswin review threshold)

**Suggested approach:**
Phase 1: Create 2-3 standard proposal templates (by customer type or deal size) in a consistent format with auto-populated pricing from the standard schedule. Phase 2: Build a pricing configurator that VPs can use to generate proposals with guardrails (e.g., pricing within approved ranges doesn't need Oswin's review). Phase 3: Integrate with DocuSign for one-click send. Phase 4: Add a clause library for common redline responses to accelerate negotiation rounds.

**Success criteria:**
- 0% of proposals built from scratch — all start from templates
- Single standard format for all proposals
- Revision rounds reduced from 4-5 to 2-3
- VPs can generate standard-priced proposals without Oswin
- Time from "deal ready for proposal" to "sent to customer" reduced by 50%

**WeVend/MonexGroup considerations:**
100% WeVend.

---

### Priority 5: Merchant FAQ / Self-Service Portal

**What to automate/improve:**
Build a merchant-facing FAQ or self-service knowledge base that answers the most common questions merchants currently call Sales reps about. Optionally deploy an AI chatbot that can handle these queries.

**Current state:**
No FAQ or knowledge base exists. Sales reps are the FAQ — merchants call or email their rep directly for standard questions. The top questions are all repeatable with standard answers: What is the $20/month minimum processing fee? What is a DDA Reject fee ($25)? What is a Chargeback fee ($25)? What is a Retrieval fee ($15)? What is the PCI Non-Compliance fee ($19.95)? Who is Fiserv? Who is CardPoint? What is the PCI Survey and how to complete it? Additionally, merchants call about application status. The Support line has long hold times, so merchants default to calling their Sales rep.

**Why it matters:**
Sales reps collectively spend approximately 15 hours/week fielding support calls that have standard answers. This is selling time lost to customer service. As the merchant base grows from 1,500 to 10,000 terminals, this problem will grow proportionally.

**Estimated time savings:**
10-15 hours/week across the team (1 hour/day per rep currently spent on support calls).

**Complexity:**
Low. The questions are known, the answers are standard. This is primarily a content creation and distribution task.

**Dependencies:**
- Complete list of common merchant questions (Sales has the top ones; Customer Service team has more)
- Standard answers reviewed and approved
- Distribution channel (website, email auto-responder, chatbot, or all of the above)
- Customer Service team collaboration

**Suggested approach:**
Phase 1: Document the top 20-30 most common merchant questions and standard answers. Build a simple FAQ page on the WeVend website or merchant portal. Phase 2: Create an AI-powered chatbot that can answer these questions in real-time. Phase 3: Set up auto-responder templates in email so reps can respond to common questions with one click. Phase 4: Route merchant support inquiries from Sales directly to the FAQ/chatbot with a redirect message.

**Success criteria:**
- 80% reduction in merchant support calls to Sales reps
- Merchants can self-serve answers to rates, fees, Fiserv, PCI questions
- Sales reps reclaim 10+ hours/week for selling activities
- Merchant satisfaction maintained or improved (faster answers)

**WeVend/MonexGroup considerations:**
100% WeVend. FAQ content specific to WeVend's rates, fees, processors (Fiserv, CardPoint), and PCI survey.

---

### Priority 6: Automated Onboarding + Document Collection

**What to automate/improve:**
Automate the merchant onboarding process — specifically the collection of supporting documents from merchants, status tracking, automated reminders for missing docs, and handoff to Operations.

**Current state:**
One onboarding specialist handles all merchant applications with a 3-day SLA. Merchants frequently submit incomplete applications missing supporting docs (banking info, valid license, proof of existence, picture of vending machine, lease agreement). The specialist manually follows up with each merchant to collect missing docs. The specialist is already near max capacity.

**Why it matters:**
The onboarding process will be the first thing to break as WeVend scales. At 10,000 terminals, a single specialist chasing documents manually will be completely overwhelmed. SLA breaches will increase, leading to unhappy customers and slower revenue realization.

**Estimated time savings:**
5-10 hours/week for the onboarding specialist (document collection follow-up, status tracking).

**Complexity:**
Medium. Requires automated document status tracking, automated reminder emails to merchants, and clear escalation rules.

**Dependencies:**
- List of required documents per merchant type
- Automated reminder email templates
- Integration with DocuSign or document collection platform
- Onboarding specialist buy-in and workflow redesign

**Suggested approach:**
Phase 1: Build automated status tracking — system shows which docs have been received and which are outstanding for each application. Phase 2: Automated reminder emails sent to merchants at defined intervals (Day 1, Day 2 if missing docs). Phase 3: Dashboard for onboarding specialist showing all applications, their status, and which need attention. Phase 4: Automated handoff to Operations once all docs are complete and application is approved.

**Success criteria:**
- 3-day SLA consistently met even as volume increases
- 80% reduction in manual follow-up emails for missing docs
- Onboarding specialist can handle 3-5x current volume
- No merchant applications "lost" or stalled without visibility

**WeVend/MonexGroup considerations:**
100% WeVend.

---

### Priority 7: Automated Payment-to-Deployment Handoff

**What to automate/improve:**
Automate the flow from Accounting payment confirmation to Operations terminal deployment, eliminating Sales as the middleman.

**Current state:**
When a customer pays for terminals, Accounting confirms payment to Sales, then Sales sends the payment confirmation + deployment form to Operations for shipment. Sales is acting as a relay between Accounting and Operations.

**Why it matters:**
Sales adds no value in this relay — they're just passing information. Automating this removes manual steps and frees Sales time while potentially speeding up terminal deployment.

**Estimated time savings:**
2-3 hours/week across the team.

**Complexity:**
Low. This is a straightforward workflow automation — trigger: Accounting confirms payment → action: automatically send deployment form to Operations.

**Dependencies:**
- Standardized deployment form (already exists)
- Accounting system or process that can trigger an automated notification
- Operations team buy-in to receive automated handoffs

**Suggested approach:**
Build a simple automation: when Accounting marks a payment as confirmed in their system, automatically send the associated deployment form to Operations with all required details. Can start with a simple email automation and evolve to a system integration.

**Success criteria:**
- Sales no longer relays payment confirmations manually
- Time from payment confirmation to Operations notification reduced to under 1 hour
- Zero deployment delays caused by Sales not forwarding confirmation promptly

**WeVend/MonexGroup considerations:**
100% WeVend.

---

### Priority 8: CRM Auto-Population from Emails/Calls

**What to automate/improve:**
Automatically capture and log sales activities (emails, calls, meeting notes) in the CRM without reps having to manually enter data.

**Current state:**
Reps spend 3-4 hours/week each on admin tasks including CRM updates. Rob in particular is not good at entering information. Critical customer data lives on laptops and in email inboxes rather than in the CRM. The in-house CRM has no automatic activity logging.

**Why it matters:**
Sales reps hate admin work — it's the #1 most tedious task identified. If CRM data entry were automated, reps would spend more time selling and the CRM would actually contain useful, up-to-date data.

**Estimated time savings:**
9-12 hours/week total (3-4 hours/week per rep × 3 reps).

**Complexity:**
Medium. Requires email integration (Outlook/Exchange), call logging, and AI-powered data extraction to populate CRM fields from unstructured communication.

**Dependencies:**
- CRM overhaul (Priority 3) — the current CRM may not support activity logging
- Outlook/Exchange API access
- AI model for extracting structured data from emails

**Suggested approach:**
Build an AI agent that monitors rep email and automatically extracts: contact details, deal updates, next steps, and key information — then populates the CRM. Start with email-to-CRM auto-logging, then expand to call notes and meeting summaries.

**Success criteria:**
- Reps spend zero time on manual CRM data entry
- CRM contains complete, up-to-date activity history for every deal
- Oswin can see deal activity without asking reps

**WeVend/MonexGroup considerations:**
100% WeVend.

---

### Priority 9: Follow-Up Tracking & Automation

**What to automate/improve:**
Replace individual rep follow-up tracking (currently in their heads or personal notes) with a shared system that tracks all prospect follow-ups, sends automated reminders, and ensures no prospect falls through the cracks.

**Current state:**
Each rep tracks their own prospect follow-ups in their own way — spreadsheets, notes, memory. There's no shared visibility. Prospects have fallen through the cracks because nobody knew a follow-up was due. Oswin has to pull lead updates from reps during weekly calls.

**Why it matters:**
Dropped follow-ups mean lost deals. With a 7-10% hit rate on prospecting, every qualified prospect is valuable. A systematic follow-up process could significantly improve conversion rates.

**Estimated time savings:**
3-5 hours/week (reduced time tracking follow-ups, fewer dropped prospects, less time pulling updates from reps).

**Complexity:**
Low-Medium. Could be as simple as a shared tracking system with automated reminders, or integrated into the CRM overhaul.

**Dependencies:**
- CRM overhaul (Priority 3) ideally includes this capability
- Rep buy-in to use a shared tracking system

**Suggested approach:**
Phase 1 (immediate): Create a shared follow-up tracking board (even a simple shared spreadsheet or Trello board) where all reps log their follow-ups with next action dates. Phase 2: Automated daily/weekly email to each rep listing their overdue and upcoming follow-ups. Phase 3: Integrate into CRM with automated follow-up reminders and cadence management.

**Success criteria:**
- Zero prospects fall through the cracks due to missed follow-ups
- Oswin has real-time visibility into all reps' follow-up pipelines without asking
- Follow-up compliance rate >95%

**WeVend/MonexGroup considerations:**
100% WeVend.

---

### Priority 10: Automated Post-Trade-Show Nurture Sequences

**What to automate/improve:**
Replace manual post-trade-show email and phone follow-up with automated nurture sequences that keep prospects warm while reps focus on hot leads.

**Current state:**
After trade shows (monthly, April–December), reps manually follow up with 15-20 leads via email and phone. About 5 convert to discovery calls. The remaining 10-15 leads get manual weekly/monthly follow-ups indefinitely. All nurturing is manual — no automated email sequences.

**Why it matters:**
Trade shows are the highest-converting lead source (25% vs. ~7-10% for outbound). Automated nurture sequences for the non-converting leads would maintain engagement without consuming rep time, potentially converting more leads over time.

**Estimated time savings:**
2-4 hours/week during trade show season (per rep, for manual follow-up on non-converting leads).

**Complexity:**
Low. Requires an email automation tool and a set of nurture email templates.

**Dependencies:**
- Email automation tool (could use Apollo's sequence features if better utilized, or a dedicated tool)
- Nurture email content/templates
- CRM integration to track engagement

**Suggested approach:**
Create 3-4 email nurture sequences (by vertical or customer type) that automatically send follow-up emails at defined intervals after a trade show. Hot leads (responded, requested meeting) go to reps immediately. Warm leads enter the automated sequence. If a lead engages with the sequence (opens, clicks, replies), notify the rep for personal follow-up.

**Success criteria:**
- All non-converting trade show leads enter automated nurture within 48 hours
- Rep time on manual trade show follow-up reduced by 75%
- Trade show lead-to-discovery-call conversion rate increases from 25% to 35%+

**WeVend/MonexGroup considerations:**
100% WeVend.

---

### Priority 11: Rob's Customer Knowledge Documentation

**What to automate/improve:**
Systematically extract and document Rob's customer knowledge — account history, contacts, pricing agreements, preferences, relationship context — from his laptop and his memory into a centralized, shared system.

**Current state:**
Rob is the only person on the team with live customer relationships and deal history. Most of this knowledge is on his laptop or in his head. Anthony and Jay have no wins yet. If Rob leaves, WeVend loses all customer intelligence.

**Why it matters:**
This is the single highest-risk item identified in the entire interview. Rob leaving would be a "huge blow and a disaster." This is not about time savings — it's about business continuity and institutional knowledge preservation.

**Estimated time savings:**
N/A — this is risk mitigation, not efficiency. However, once documented, this knowledge enables the incoming Account Manager to take over effectively.

**Complexity:**
Medium. Requires dedicated sessions with Rob to extract knowledge, plus a system to store it (ideally the CRM, but given its current limitations, could start in SharePoint or a shared knowledge base).

**Dependencies:**
- Rob's cooperation and time
- A destination system (CRM or knowledge base)
- Account Manager hire (recipient of this knowledge)

**Suggested approach:**
Conduct a series of structured "knowledge extraction" sessions with Rob — one per major customer account. Document: all contacts and relationships, deal history and pricing, customer preferences and quirks, outstanding issues, expansion opportunities, and communication cadence. Store in a shared location (SharePoint initially, migrate to CRM when capable). Run this BEFORE the Account Manager starts so there's an onboarding package ready.

**Success criteria:**
- 100% of Rob's active customer accounts documented in a shared system
- Account Manager can take over account management without Rob
- Rob's departure would cause disruption, not disaster

**WeVend/MonexGroup considerations:**
100% WeVend.

---

### Priority 12: Weekly Sales Meeting Automation

**What to automate/improve:**
Automate the weekly sales meeting preparation, note-taking, and action item tracking.

**Current state:**
Oswin preps the same morning with an informal agenda. Notes are taken in personal OneNote. Action items are not formally tracked — "everyone remembers what they committed to."

**Why it matters:**
Action items slip between meetings. Oswin spends time prepping that could be automated. No institutional record of decisions and commitments.

**Estimated time savings:**
1-2 hours/week (prep time, note-taking, and follow-up on action items).

**Complexity:**
Low. Could use AI meeting notes (auto-transcription + summary), automated agenda generation from CRM/pipeline data, and automated action item tracking with reminders.

**Dependencies:**
- Meeting transcription tool (Teams has built-in capability)
- CRM data for automated agenda (depends on Priority 3)
- Shared action item tracking system

**Suggested approach:**
Phase 1: Enable Teams meeting transcription and use AI to generate meeting summaries and action items. Phase 2: Auto-generate meeting agenda from CRM pipeline data (deals that moved, stalled, or need attention). Phase 3: Automated action item reminders sent to reps between meetings.

**Success criteria:**
- Meeting agenda auto-generated before each call
- Meeting notes and action items automatically captured and shared with all reps
- Action item completion tracked with automated reminders
- Zero action items lost between weekly calls

**WeVend/MonexGroup considerations:**
100% WeVend.

---

## Quick Wins (Can be done in < 1 week)

1. **Prospecting automation pilot** — Set up a Claude agent to take a raw prospect list and research/classify each company as distributor, manufacturer, ISV, or irrelevant. Test with one VP on one batch of prospects. Can be running within days.

2. **Merchant FAQ document** — Compile the top 10-15 most common merchant questions (rates, fees, Fiserv, CardPoint, PCI) with standard answers into a single document. Share with Customer Service and consider posting on the WeVend website. Immediate deflection of repeat questions.

3. **Shared follow-up tracker** — Create a shared spreadsheet or simple board where all reps log their active follow-ups with next action dates. Basic but eliminates the "invisible follow-up" problem. Takes 1 hour to set up.

4. **Rob knowledge extraction kickoff** — Schedule the first knowledge extraction session with Rob on his top 3 accounts. Document in SharePoint. Critical risk mitigation that doesn't require any tooling.

---

## 30-Day Targets

1. **Prospecting automation agent operational** — AI agent researching and qualifying prospects, delivering pre-vetted lists to VPs. Target: reduce manual research time by 70% and increase discovery calls from 2-4 to 5-8 per VP per month.

---

## 90-Day Targets

1. **Prospecting automation mature and embedded** — fully operational, reps using daily, discovery call volume measurably increased.
2. **CRM overhaul Phase 1 complete** — pipeline stages, basic pipeline view, and deal visibility added to WeSell CRM. Oswin can see where every deal sits without asking.
3. **Email management solution deployed** — starting with Rob as pilot. Email categorization and filtering reducing his email management time by at least 50%.
4. **Merchant FAQ live** — self-service FAQ published, measurable reduction in support calls to Sales.
5. **Standardized proposal templates created** — at least 2-3 templates in use, 0% of proposals built from scratch.

---

## Scaling Risks to Address

| Risk | Current State | What Breaks at Scale | Recommended Action |
|---|---|---|---|
| Onboarding specialist capacity | 1 specialist, already near max capacity, 3-day SLA under pressure | At 10K terminals, volume overwhelms specialist. SLA consistently broken. Unhappy customers. | Automate document collection and reminders (Priority 6). Add headcount if needed. |
| Oswin as agreement bottleneck | Every agreement goes through Oswin for pricing and quality control | At higher deal volume, Oswin can't create and review every agreement. Deals delayed. | Standardize proposals with pricing guardrails (Priority 4). Allow VPs to generate standard-priced agreements independently. |
| Manual prospect research | 10-15 researched per 1 qualified target. Several hours/day. | Cannot generate enough pipeline to hit 10K terminal target. | Deploy AI prospecting agent (Priority 1). |
| Rob's customer knowledge concentration | All live customer intelligence in Rob's head/laptop | Any growth in accounts without documentation = compounding risk. Account Manager can't be effective without this knowledge. | Immediate knowledge extraction (Priority 11). CRM improvement (Priority 3). |
| Email volume growth | Rob at 200 emails/day with current customer base | At 6-7x customer base, email volume becomes unmanageable for all reps. | AI email management (Priority 2). |
| Sales as support backdoor | 15 hours/week lost to merchant support calls | At 6-7x merchant base, could become 50-100 hours/week. | Merchant FAQ (Priority 5). Fix Support line hold times (cross-departmental). |
| Daily distributor status calls | 30 min/day with 1 distributor | At 5-10 distributors, 2.5-5 hours/day on status calls. | Automate status updates via a portal or automated reports. |
| Proposal creation | 50% from scratch, inconsistent formats, 4-5 revision rounds | More deals = unsustainable time on proposals | Standardized templates and pricing automation (Priority 4). |
| Products team ownership gap | Deals kicked back to Sales during testing and technical stages | More concurrent deals = more deals stuck in technical limbo | Process documentation with new Products lead. Clear SLAs for each stage. Escalation path. |

---

## Notes for Weekly Review

- **Immediate action needed**: Rob's customer knowledge documentation should start this week — it's a critical risk that doesn't require any tooling or budget, just time with Rob.
- **Prospecting automation is the #1 priority** per Oswin — he identified this as both the 30-day target and the top quick win. The team is already using ChatGPT for this, so there's familiarity with AI-assisted prospecting.
- **CRM overhaul is on the Operations team's roadmap** but nobody is working on it yet. This needs to be prioritized and given a timeline. It's a dependency for multiple other automation opportunities (activity tracking, follow-up automation, pipeline reporting).
- **20-25 merchant applications currently stuck** waiting on QR release due to testing handoff issues with Products team. This is active revenue being blocked.
- **Account Manager hire in 2-3 weeks** will significantly change Rob's time allocation — from 50%+ on existing customers to primarily prospecting and new deals. This is the best window to extract Rob's customer knowledge before handoff.
- **New Products lead** should address the handoff and ownership gaps between Sales and Products. Recommend establishing clear SLAs for each stage of the technical/integration process.
- **Apollo is paid but underused** — before investing in new tools, maximize the ROI on Apollo through training. Could pair with the prospecting automation agent.
- **Cross-departmental dependencies**: Merchant FAQ needs Customer Service input. Support hold time issue needs to be raised with Support leadership. Testing process needs Products team process documentation.

---

*This priority list was generated from a Department X-Ray session on March 27, 2026. It should be reviewed weekly and updated as items are completed or priorities shift.*
