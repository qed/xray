# Product Management — Department Profile
**Date:** March 26, 2026
**Interviewed:** Prakash Kunthasami, Product Manager
**Interviewer:** Claude (Department X-Ray)

---

## 1. Department Identity

### Mission
Product Management owns the full product lifecycle for WeVend's payment solutions — from strategy and discovery through development, launch, and optimization. The department's strategic role is to remove friction from scale, prioritize revenue-positive capabilities, and ensure the platform can grow faster than headcount.

### Scope
- Product strategy and lifecycle management across all WeVend products (Gateway, PayPro Terminal, PayPro Max, Pay QR, Laundry Solution)
- Technical and platform development leadership for next-generation payment solutions
- Stakeholder and vendor management to ensure successful project delivery
- UX/UI design collaboration for payment devices and online portals
- Discovery, validation, and requirements definition (PRDs)
- Roadmap planning and prioritization
- Regular reporting to leadership (roadmap dashboard, product development updates, project updates)
- Customer demos (preparation and delivery)
- Competitive analysis
- Release notes, user guides, and admin guides
- Project management (planning, scheduling, communication, monitoring)

### Not In Scope
No significant gray areas reported. Product Management's scope is clean and well-understood within the organization. No responsibilities are regularly misattributed to the department.

### WeVend / MonexGroup Split
Work is split **50/50** between WeVend and MonexGroup. The nature of the work does not differ between the two business units — same processes, same tools, same approach. No team members focus exclusively on one business unit.

### Contribution to 2026 Goals
Product Management is the lever that enables Wevend to scale from ~1,500 to 10,000 active terminals and grow MRR from $150K to $300K. The department achieves this by:
- Removing friction from the scaling process
- Prioritizing revenue-positive capabilities
- Ensuring the platform can grow faster than headcount
- Managing 5–6 concurrent product development items across the pipeline

### Recent Changes
No changes to the department's scope, structure, or responsibilities in the last 12 months.

---

## 2. People & Roles

### Team Roster

| Name | Title | Key Responsibilities | Time Allocation | WeVend/MonexGroup Split |
|---|---|---|---|---|
| Chris Dristas | SVP, Chief Product Officer | Vision, strategy, design, development, roadmap. Bridges customer needs with business goals, drives revenue through innovative market-aligned products. Also gets pulled into hands-on spec work when needed. | 70% innovation/roadmap strategy, 30% development & leadership | 50/50 |
| Prakash Kunthasami | Product Manager | Strategy, development, and launch of products. Sits at intersection of business, technology, and UX. Defines product vision, analyzes market needs, prioritizes features. Primary author of all documentation (PRDs, specs, meeting notes, knowledge base). Also handles project management work when needed. | 50% discovery/validation/writing specs, 30% core execution, 20% innovation/roadmap strategy | 50/50 |
| Sohail Zafar | Project Manager | Plans, executes, and closes projects. Manages scope, resources, communication, and risk. Key link between stakeholders. Operates in a complex ecosystem spanning terminal, firmware, app, cloud, and processors across US/Canada. | 50% communication, 30% planning & scheduling, 10% monitoring & control, 10% roadmap/strategy | 50/50 |

### Reporting Structure
Both Prakash and Sohail report directly to Chris Dristas (CPO). Clean, flat structure with no dotted-line relationships.

### Single Points of Failure

| Person | What Only They Know/Do | Risk If They Leave |
|---|---|---|
| Prakash Kunthasami | Discovery, validation, and spec-writing process. Primary author of all Confluence documentation. Primary user of Figma and Visio for wireframing, prototyping, UI design, and process flows. | The entire PRD pipeline and documentation knowledge base would be at risk. No one else regularly creates or maintains Confluence content. Design/wireframing capability would be lost. |
| Chris Dristas | Strategic vision and high-level direction for all products. | The department would lose its strategic compass and alignment with company goals. |
| Sohail Zafar | All project management functions — planning, scheduling, communication, monitoring. | Sprint planning, project coordination, stakeholder communication, and execution tracking would break. |

**Critical note:** With a three-person team, each person is the sole owner of their core domain. Everyone wears multiple hats out of necessity — Prakash does project management work, Chris gets pulled into hands-on spec work — but if any one person left, their core function would be severely impacted.

### Tribal Knowledge
- Prakash's discovery, validation, and spec-writing process is **being documented** but is not yet complete. If Prakash left tomorrow, a replacement would not have a complete playbook to follow.
- All Confluence documentation is primarily authored by Prakash — Chris and Sohail are consumers, not contributors.

### Communication Patterns
- **Channels:** Microsoft Teams, email, and verbal conversations
- **Standups:** Both daily and weekly standups
- **Work assignment:** Collaborative — work is assigned through discussion rather than top-down
- **Mix of formal and informal:** Standups and email for formal communication, Teams chat and verbal for informal/ad hoc

---

## 3. Tools & Systems

### Tool Stack

| Tool | Purpose | Primary Users | Frequency | Notes |
|---|---|---|---|---|
| Jira | Product backlog tracking, sprint management, bug tracking, roadmap planning | Prakash, Sohail | Daily | Core workhorse for execution tracking. Connected to Confluence. |
| Confluence | Documentation, specs, meeting notes, knowledge base | Prakash (primary author); Chris and Sohail as consumers | Daily | Prakash is the sole author — single point of failure for documentation. |
| Figma | Wireframing, prototyping, full UI design | Prakash | As needed | Used for UX/UI design work. |
| Visio | Wireframing, prototyping, UI design, process flows, architecture diagrams | Prakash | As needed | Overlaps with Figma but adds process flow and architecture diagram capabilities. |
| Microsoft Teams | Day-to-day communication, meetings | All | Daily | Also used for standups. Meeting notes manually copied to Confluence. |
| SharePoint | File storage, shared documents | All | As needed | Broader file repository alongside specialized tools. |

### Missing Tools
None identified. The team's tool set is lean and purpose-built.

### Underused Tools
None identified.

### Data Locations
- **Confluence:** Documentation, specs, meeting notes, knowledge base
- **Jira:** Product backlog, sprint data, bug tracking, roadmap
- **SharePoint:** File storage and shared documents

### Integration Gaps
- **Jira ↔ Confluence:** Connected and working well.
- **Everything else:** Manual transfer required between Figma, Visio, SharePoint, Teams, and the Jira/Confluence ecosystem.
- **Key manual pain points:**
  1. Copying meeting notes from Microsoft Teams into Confluence (regular manual task)
  2. Taking design specs from Figma and re-entering them into Jira tickets (manual re-entry)

### Access Risks
IT manages admin access to all tools (Jira, Confluence, Figma, Visio). No admin access risk within the Product Management department.

---

## 4. Workflows & Processes

### 4.1 Product Development Process (6-Phase Lifecycle)

This is the core workflow for the Product Management department, documented in the "WeVend Product Development Process Flow" (v1.0, March 25, 2026).

**Trigger:** Customer feedback/requests, sales intelligence, strategic initiatives from leadership, market research
**Owner:** Prakash Kunthasami (PM) with Chris Dristas (CPO) and Sohail Zafar (Project Manager)
**Frequency:** Continuous — 5–6 items running simultaneously across different phases at any given time
**Tools Used:** Jira, Confluence, Figma, Visio, SharePoint, Microsoft Teams

**Phase 1: Discovery & Ideation (1–2 weeks estimated; actual ~4–5 hours)**
1. Trigger received (e.g., customer request surfaced in management team review)
2. Prakash and Chris conduct discovery sessions with stakeholders (operators, manufacturers, distributors, ISVs, internal teams)
3. Define problem statement and validate with real customer examples
4. Identify affected WeVend products and business units
5. Assess urgency, market opportunity, and alignment with company goals
6. Document initial scope boundaries
- **Output:** Discovery Brief (Confluence page, email summary, or meeting notes)
- **Gate:** Problem clearly articulated with customer example, products/verticals identified, CPO/PM aligned on priority

**Phase 2: Requirements Definition (1–3 weeks)**
1. Run structured PRD discovery conversation (6-layer process: Problem → User & Scope → Requirements & Acceptance Criteria → Success/Constraints/Technical Context → Rollout & Analytics → Open Questions & Risks)
2. Define user personas and user journeys
3. Write user stories in standard format
4. Define functional requirements with FR-ID numbering
5. Define non-functional requirements (performance, security/PCI-DSS, reliability, accessibility, localization)
6. Establish success metrics and KPIs
7. Identify dependencies, constraints, assumptions
8. Plan rollout strategy (feature flags, phased rollout, pilot)
9. Define analytics events and reporting needs
- **Output:** Product Requirements Document (PRD) in Word .docx (18 sections), updated Jira Epic with linked stories, Figma wireframes or flow diagrams if UX changes involved
- **Gate:** PRD complete with all 18 sections, acceptance criteria defined for P0/P1 requirements, PRD approved by CPO

**Phase 3: Technical Review (1–2 weeks)**
1. Engineering team (Richard, Technical Lead) reviews PRD for technical feasibility
2. Identify architecture impacts and integration points (Gateway, IoT/MQTT, payment processors)
3. Assess data model changes (MongoDB schema updates)
4. Evaluate infrastructure requirements (AWS scaling, new services)
5. Identify technical risks and propose mitigations
6. Estimate complexity (T-shirt sizing: S/M/L/XL)
7. Define API contracts and data flows
8. Identify security and PCI-DSS compliance requirements
9. Create or update system architecture diagrams
- **Output:** Technical Review Document (Word .docx), updated PRD if scope adjustments needed, architecture diagrams, effort estimates
- **Gate:** Technical Review completed, all requirements assessed for feasibility, architecture approach agreed, PM and engineering aligned on scope

**Phase 4: Development Tasks & Sprint Planning (3–5 days)**
1. Tech Lead + Sohail break down requirements into Jira stories and sub-tasks
2. Define task dependencies and sequencing
3. Assign story points based on technical review estimates
4. Identify sprint capacity and allocate work
5. Define Definition of Done for each task
6. Set up feature branches and CI/CD pipeline configuration
7. Create QA test plan outline
- **Output:** Jira board with all stories, sprint backlog, task dependency map, QA test plan outline, updated project timeline
- **Gate:** All PRD requirements mapped to Jira stories, stories have acceptance criteria/points/assignees, first sprint backlog defined

**Phase 5: Project Kickoff (1 day)**
1. Sohail + Tech Lead conduct kickoff meeting with full project team
2. Walk through problem statement, goals, success metrics
3. Review technical approach and architecture decisions
4. Review sprint plan and timeline
5. Confirm communication cadence and escalation paths
6. Distribute all project documentation
- **Output:** Kickoff meeting notes (Confluence), confirmed communication plan, shared project folder, RACI matrix if multi-team
- **Gate:** All team members have access to docs, communication cadence confirmed, no unresolved blockers

**Phase 6: Development & Execution (2–6 sprints)**
1. Execute sprints per the backlog
2. Daily standups
3. Sprint reviews and retrospectives
4. CI/CD with feature flags for phased rollout
5. QA testing per test plan
6. Stakeholder demos at sprint boundaries
7. PM monitors success metrics and adjusts scope as needed
- **Output:** Working software increments, sprint review notes, updated Jira board, stakeholder status updates, bug reports

**Common Exceptions:**
- Scope creep during revisions
- Stakeholders changing their minds mid-process
- Unclear requirements from the start
- Client customizations conflicting with scalable platform roadmap
- Continuous scope changes mid-sprint
- Production issues disrupting sprint capacity

**Documentation Status:** Fully documented in "WeVend Product Development Process Flow" v1.0 (March 25, 2026). Discovery/validation/spec-writing process still being documented by Prakash.

### 4.2 Weekly Roadmap Dashboard

**Trigger:** Weekly cadence
**Owner:** Prakash Kunthasami
**Frequency:** Weekly | **Volume:** 1 per week
**Time:** 2–3 hours per week
**Tools Used:** PowerPoint (current), would like to move to interactive dashboard

**Steps:**
1. Gather roadmap data from Jira and other sources
2. Update PowerPoint presentation with current status
3. Present/distribute to leadership

**Output:** PowerPoint roadmap dashboard for leadership
**Common Exceptions:** N/A
**Documentation Status:** Not documented

### 4.3 Product Prioritization Requests

**Trigger:** Weekly cadence
**Owner:** Prakash Kunthasami
**Frequency:** Weekly | **Volume:** 1 per week
**Time:** 2–4 hours per week
**Tools Used:** Jira, Confluence

**Steps:**
1. Review incoming feature/enhancement requests
2. Assess priority, feasibility, and alignment
3. Update prioritization and communicate decisions

**Output:** Prioritized product backlog updates
**Common Exceptions:** N/A
**Documentation Status:** Not documented. Prakash wants to create a clear intake process where Claude can perform initial vetting and feasibility.

### 4.4 Product Development Updates & Project Updates

**Trigger:** Weekly cadence
**Owner:** Prakash Kunthasami / Sohail Zafar
**Frequency:** Weekly | **Volume:** 1 per week
**Time:** 2–4 hours per week (combined, some overlap between the two)
**Tools Used:** Jira, Confluence, email

**Steps:**
1. Gather status from Jira (sprint progress, burndown, velocity)
2. Compile development updates and project status
3. Distribute to stakeholders

**Output:** Product development and project status updates
**Common Exceptions:** N/A
**Documentation Status:** Not documented

### 4.5 Customer Demos

**Trigger:** Customer request or product milestone
**Owner:** Development team + Product team (collaborative)
**Frequency:** 3–4 per month | **Volume:** 3–4 per month
**Time:** ~2 days per demo (1.5 days prep, 0.5 days delivery)
**Tools Used:** Various

**Steps:**
1. Prepare demo environment and materials (~1.5 days)
2. Deliver demo to customer (~0.5 days)

**Output:** Customer demo delivery
**Common Exceptions:** N/A
**Documentation Status:** Not documented

### 4.6 Ad Hoc Stakeholder Requests

**Trigger:** On-demand — leadership asking for data, sales needing product info for a deal, engineering asking for clarification
**Owner:** Prakash Kunthasami
**Frequency:** 1–2 per week | **Time:** 2–3 hours total per week

**Steps:**
1. Receive request via email, Teams, or verbal
2. Gather required information from Jira, Confluence, or personal knowledge
3. Respond to requestor

**Output:** Data, product info, or clarification as requested
**Documentation Status:** Not documented

### 4.7 Competitive Analysis

**Trigger:** On-demand — requested by Chris, Sales, or leadership
**Owner:** Prakash Kunthasami
**Frequency:** As needed | **Time:** ~1 hour per request

**Steps:**
1. Receive request for competitive comparison
2. Research and compile quick comparison
3. Deliver to requestor

**Output:** Competitive comparison/analysis
**Documentation Status:** Not documented

### 4.8 Support Inquiries from Sales & Support

**Trigger:** On-demand — Sales or Support team needs product-level answers
**Owner:** Prakash Kunthasami
**Frequency:** Regular | **Time:** 1–2 hours per week

**Steps:**
1. Receive inquiry (technical product questions, feature availability, pricing/packaging, troubleshooting)
2. Research and formulate answer
3. Respond to requestor

**Output:** Product information, answers, clarifications
**Documentation Status:** Not documented

### 4.9 Release Notes Creation

**Trigger:** Product release
**Owner:** Prakash Kunthasami
**Frequency:** Per release
**Tools Used:** GitHub (source), manual document creation

**Steps:**
1. Review development changes in GitHub
2. Manually write release notes
3. Distribute/publish

**Output:** Release notes document
**Documentation Status:** Not documented. Prakash wants release notes auto-generated from GitHub and added to repository.

### 4.10 User & Admin Guide Creation

**Trigger:** Product release or feature launch
**Owner:** Prakash Kunthasami
**Frequency:** Per release/feature
**Tools Used:** Confluence, Word

**Steps:**
1. Review PRDs, release notes, development docs, process flows
2. Manually write user/admin guides
3. Publish and distribute

**Output:** User guides and admin guides
**Documentation Status:** Not documented. Prakash wants AI to assist in creating these based on release notes, development docs, PRDs, and process flows.

---

## 5. Handoffs & Dependencies

### Inbound (What This Department Receives)

| From Department | What | Format | How | Common Problems |
|---|---|---|---|---|
| Sales | Customer feedback, feature requests, product info requests, competitive intelligence | Various | Email, verbal, Teams chat | Sometimes incomplete information |
| Support | Customer issues, support inquiries, feature requests | Various | Email, verbal, Teams chat | Sometimes incomplete information |
| Customers | Direct feedback, feature requests | Various | Email, verbal, Teams chat | Sometimes incomplete information |
| Technical/Engineering Team | Technical constraints, feasibility assessments, Technical Review Documents, architecture info | Documents, verbal | Email, verbal, Teams chat | Sometimes incomplete information |
| Leadership | Strategic initiatives, data requests, priority decisions | Various | Email, verbal, Teams chat | Sometimes incomplete information |

### Outbound (What This Department Delivers)

| To Department | What | Format | How | Common Problems |
|---|---|---|---|---|
| Engineering/Development | PRDs, Technical Review Documents, wireframes, requirements clarification | Word .docx, Figma, Jira | Jira, Confluence, email | N/A |
| Sales | Product info, competitive analysis, customer demo support | Various | Email, Teams, verbal | N/A |
| Support | User guides, admin guides, release notes, product clarification | Documents | Confluence, email | N/A |
| Leadership | Roadmap dashboard, product development updates, project updates, data as requested | PowerPoint, email | Email, meetings | N/A |
| All stakeholders | Release notes | Documents | Repository/email | N/A |

### Blocking Dependencies
No recurring bottlenecks currently, but potential for bottlenecks as workload scales — particularly waiting on Engineering for Technical Reviews (Phase 3) and stakeholder feedback during PRD revisions (Phase 2).

### Cross-Functional Gaps
No cross-functional gaps identified currently, but Prakash notes potential for things to fall between departments as the team scales — especially across the wide range of handoff points with Engineering, Sales, Support, Operations, and Project Management.

### Most Frequent Interactions
1. Engineering / Development team
2. Sales
3. Project Management
4. Operations
5. Support

---

## 6. Pain Points & Bottlenecks

### Time Sinks

| Pain Point | Time Cost (per week/month) | Who It Affects | Root Cause |
|---|---|---|---|
| Weekly roadmap dashboard (PowerPoint) | 2–3 hours/week | Prakash | Manual creation and update in PowerPoint; no interactive dashboard |
| Product prioritization requests | 2–4 hours/week | Prakash | No structured intake process; all vetting done manually |
| Product dev updates & project updates | 2–4 hours/week | Prakash, Sohail | Manual compilation from multiple sources |
| PRD writing (18 sections) | Significant per PRD (within 1–3 week phase) | Prakash | Manual writing of all 18 sections, stakeholder feedback cycles, back-and-forth revisions |
| Copying meeting notes from Teams to Confluence | Recurring | Prakash | No integration between Teams and Confluence |
| Re-entering Figma design specs into Jira | Recurring | Prakash | No integration between Figma and Jira |
| Ad hoc stakeholder requests | 2–3 hours/week | Prakash | Reactive interruptions from leadership, sales, engineering |
| Support inquiries from Sales/Support | 1–2 hours/week | Prakash | Reactive; no self-serve product info resource |
| Customer demo prep | ~6 days/month (1.5 days × 3–4 demos) | Prakash, development team | Significant prep time required |
| Release notes creation | Per release | Prakash | Manual creation; source data in GitHub but not automated |
| User/admin guide creation | Per release | Prakash | Manual writing from multiple source documents |

**Total estimated recurring overhead:** ~9–16 hours/week on reporting, reactive requests, and support — before core product development work on 5–6 pipeline items.

### Bottlenecks
- **Context-switching:** Managing 5–6 items across different phases of the pipeline simultaneously creates constant context-switching between discovery, spec-writing, technical review coordination, and execution monitoring.
- **Single PM:** Prakash is the sole PM handling all core product work, all documentation, all reporting, and all reactive requests.
- **Stakeholder feedback cycles:** PRD revisions can drag due to scope creep, stakeholders changing their minds, and unclear requirements from the start.

### Error-Prone Areas
- **Unclear requirements at the start:** Can cascade into scope creep, revision cycles, and downstream confusion.
- **Scope changes mid-sprint:** Continuous scope changes disrupt sprint planning and capacity.
- **Incomplete information from inbound handoffs:** Requests from Sales, Support, customers, Engineering, and leadership sometimes arrive with incomplete context.

### Scaling Risks
- **Requirements gathering and discovery will break first** if workload doubles. As the sole PM, Prakash cannot scale the discovery and spec-writing process proportionally.
- **Proper prioritization will become critical** as Wevend scales from 1,500 to 10,000 terminals. Without a structured intake and vetting process, the team won't be able to keep up.
- **Manual weekly reporting** (~6–11 hours/week) will become unsustainable as the number of products and initiatives grows.
- **Three-person team** with everyone as a single point of failure in their domain — no redundancy for any core function.

### Project Management-Specific Pain Points (Sohail Zafar)

The Project Manager operates in a complex unattended payments ecosystem where:

**Scoping & Requirements:**
- Scoping requirements are not always clear from the start
- Continuous changes in scope mid-sprint
- Client customizations conflict with the scalable platform roadmap

**Integration & Technical Complexity:**
- Processor SLA mismatches across different payment processors
- Firmware updates, app changes, and backend gateway changes all have different deployment models
- Testing environments rarely mirror real unattended field conditions

**Team Coordination & Sprint Issues:**
- Unclear ownership between teams and platform/gateway teams
- No consistent definition of "done" when a feature spans terminal, app, and cloud layers
- Resource allocation disrupted by additional small tasks, production issues, and enhancement requests

**Stakeholder & Vendor Challenges:**
- Managing expectations when client-specific customization conflicts with scalable platform roadmap
- Complex stakeholder and vendor management

### Tribal Knowledge Risks
- Prakash's discovery, validation, and spec-writing process — documentation in progress but not complete
- All Confluence content authored solely by Prakash
- Figma and Visio design work done solely by Prakash
- Each team member's core function exists only in their own expertise

---

## 7. The Wish List

- **Interactive dashboard** to replace manual PowerPoint weekly reporting (roadmap dashboard, product development updates, project updates)
- **Claude-powered intake process** for product prioritization — automated initial vetting and feasibility exercise
- **Auto-generated release notes** from GitHub development data, added directly to repository
- **AI-assisted user/admin guide creation** pulling from release notes, development docs, PRDs, and process flows
- **AI-assisted PRD writing** — help with the 18-section structure, stakeholder feedback incorporation, and revision cycles
- **Improved scoping and requirements clarity** for both PM and Project Manager — reducing scope creep and mid-sprint changes

---

## 8. Upcoming Changes

No upcoming changes anticipated — no new hires, reorgs, new tools, or new products that would affect how the department operates.

---

*This profile was generated during a Department X-Ray session on March 26, 2026. It should be reviewed quarterly and updated as the department evolves.*
