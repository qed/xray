# Infrastructure & Compliance — Department Profile
**Date:** March 26, 2026
**Interviewed:** Reza, Head of Infrastructure & Compliance
**Interviewer:** Claude (Department X-Ray)

---

## 1. Department Identity

### Mission
To design, implement, operate, and evolve the company's infrastructure and networks, ensuring reliability, scalability, sound governance, and compliance.

### Scope
Infrastructure & Compliance designs and operates the AWS, network, and gateway foundations that allow terminals to be deployed, connected, and supported at scale. By standardizing gateway architecture and ensuring it remains stable, performant, and PCI-compliant, the department enables growth without increasing operational risk or failure rates. The department also supports day-to-day IT operations across hardware, software, applications, servers, and end-user devices for WeVend and Monex head office and staff.

By maintaining highly available, resilient, and cost-efficient infrastructure — particularly across payment gateways, transaction flows, and core systems — the department protects revenue continuity. Strong governance and PCI-aligned controls reduce outages, rework, and audit risk, ensuring that growing transaction volumes translate into predictable, recurring revenue.

### Not In Scope
- **Product Development & Application Logic** — feature design, business logic, UI/UX, and roadmap ownership sit with Product and Engineering
- **Commercial Ownership & Revenue Management** — sales strategy, pricing, contracts, and client relationships are owned by Sales, Finance, and Operations
- **Legal Interpretation & External Regulatory Positioning** — legal judgments, breach notifications, and external communications are owned by Legal and Communications

Infrastructure & Compliance may support these areas by providing platforms, technical evidence, and compliant operating environments, but does not own the outcomes.

### Gray Areas (Absorbed in Practice)
If a request touches AWS infrastructure, the payment gateway, PCI scope, or audit risk — and the business is time-pressured — Infrastructure & Compliance becomes the default owner. Key examples:

- **Cross-team audit and evidence coordination for application development** — Engineering owns application code and release artifacts, but during PCI audits, Reza ends up coordinating development-related evidence (deployment models, data flows, configuration screenshots, secure coding practices, change records), chasing inputs from developers, packaging documentation, and acting as the technical point of contact because infrastructure, gateway behavior, and PCI accountability converge.
- **Security and compliance ownership for new tools/integrations** — no other department owns the risk assessment when new tools are onboarded.
- **Risk decisions without a clear owner** — when a decision has business or regulatory consequences and no department clearly owns it, it lands here.
- **Cross-functional operational tasks** — changes that span Development, Infrastructure, and Compliance simultaneously.

### WeVend / MonexGroup Split
**Overall: 60% WeVend / 40% MonexGroup**

| Person | WeVend | MonexGroup |
|---|---|---|
| Reza | 85% | 15% |
| Ronit | 30% | 70% |

Reza is primarily WeVend-focused; Ronit is primarily MonexGroup-focused. This means MonexGroup operations have a single point of dependency on Ronit.

### Contribution to 2026 Goals
Infrastructure & Compliance is the foundation that makes scale safe. The department directly enables:
- **10,000 terminal target** — by standardizing and automating gateway architecture and infrastructure so terminals can be deployed without proportional increases in operational risk or manual effort
- **$300K MRR target** — by maintaining high availability and resilience across payment gateways and transaction flows, protecting revenue continuity
- **$100/terminal hardware margin** — by maintaining cost-efficient infrastructure and negotiating vendor contracts
- **2–4 client launches/month** — by enabling deal closure through DDQ responses, PCI evidence, and security attestations; and by ensuring new client infrastructure is onboarded securely and quickly

### Recent Changes
Over the past year, Infrastructure & Compliance expanded beyond infrastructure operations into:
- **Application release gating** — acting as a checkpoint for production deployments
- **Deal enablement** — providing security evidence and attestations required to close deals
- **AI governance** — becoming the organization's default owner for AI tool implementation

The department has become the default owner for decisions where technical capability, risk, and business urgency intersect — a scope that significantly exceeds its current headcount of two people. **Understaffing is the department's primary constraint**, and it amplifies every other risk and pain point identified in this profile.

---

## 2. People & Roles

### Team Roster

| Name | Title | Key Responsibilities | Time Allocation | WeVend/MonexGroup |
|---|---|---|---|---|
| Reza | Head of Infrastructure & Compliance | PCI recertification & compliance, AI initiatives, gateway architecture, Jira change execution, networking & firewalls, incident monitoring, DevOps coordination, licensing & SSL, escalated IT | PCI 20%, AI/strategic 15%, Gateway 15%, Jira 15%, Networking 10%, Incidents 10%, DevOps 7%, Licensing 5%, Escalations 3% | 85/15 |
| Ronit | Jr. System Administrator | Reactive IT support, M365 admin, onboarding/offboarding, hardware procurement & inventory, backup monitoring, project work (DocuSign migration, Windows updates), AWS upskilling | Reactive IT 30%, M365 20%, Onboarding/offboarding 15%, Hardware/inventory 10%, Backup monitoring 10%, Projects 10%, AWS upskilling 5% | 30/70 |

### Reporting Structure
Ronit reports directly to Reza. Reza reports to senior leadership.

### Backup Coverage
| Person | Backup | Coverage Scope |
|---|---|---|
| Reza | Jeffrey (Head of IT, internal) | Gateway work specifically |
| Reza | Ronit | All other Reza responsibilities |
| Ronit | Reza | All Ronit responsibilities |

**Risk note:** If Ronit departs, his entire workload (M365 admin, backup monitoring, helpdesk, onboarding/offboarding, hardware procurement, active projects) falls to Reza on top of his existing full plate. This is a real capacity risk.

### Single Points of Failure

| Person | What Only They Know/Do | Risk If They Leave |
|---|---|---|
| Reza | Gateway architecture, PCI recertification, cross-department compliance authority, AI governance, escalation decisions | Jeffrey provides partial gateway and MongoDB coverage; all other responsibilities fall to Ronit |
| Ronit | MonexGroup day-to-day IT operations (70% of his work) | All MonexGroup IT support falls to Reza |

### Tribal Knowledge
No significant tribal knowledge gaps identified — both team members have backup coverage for their core responsibilities, and processes are sufficiently understood by the backup holders.

### Communication Patterns
- **Tools:** Microsoft Teams (primary), Outlook email, phone, in-person
- **Work assignment:** Role-based and intuitive — gateway tasks go to Reza, laptop/device work goes to Ronit; overlaps are handled via cc or joint ownership
- **Jira:** Used exclusively for the interface between Infrastructure & Compliance and the Development team — not for internal IT helpdesk requests
- **Meetings:** Weekly DevOps coordination, monthly reviews, quarterly governance reviews, and ad-hoc escalations as needed

---

## 3. Tools & Systems

### Tool Stack

| Tool | Purpose | Primary Users | Frequency | Notes |
|---|---|---|---|---|
| Microsoft Teams | Communication & collaboration | Both | Daily | Primary communication channel |
| Outlook / M365 apps | Email, Office productivity | Both | Daily | |
| M365 Admin Center | Email & SharePoint management | Ronit | Daily | No Entra ID in use |
| Jira | Dev ↔ Infrastructure request tracking | Reza | Daily | Not used for internal IT helpdesk |
| PuTTY (SSH) | Firewall & server management | Reza | Regular | Used for CLI access to firewalls and servers |
| RDP | Remote server access | Both | Regular | |
| AWS Portal | Cloud infrastructure management | Reza | Daily | Primary cloud management interface |
| MongoDB Portal | Database management | Reza | Regular | Used alongside AWS for environment changes |
| Bacula | Backup management | Ronit | Daily | Daily job monitoring; failure follow-up |
| AWS SNS + EventBridge | Monitoring & alerting (AWS) | Reza | Continuous | Primary alerting for cloud infrastructure |
| Nagios | Monitoring (MonexGroup internal servers) | Ronit | Daily | MonexGroup-specific server monitoring |
| DocuSign Portal | eSignature / IAM migration | Ronit | Active project | Migrating from eSignature to IAM Standard |
| Adobe | Document management / PDFs | Both | Regular | |
| Authenticator apps | MFA | Both | Daily | |
| Spreadsheet (Excel) | IT asset & hardware inventory | Ronit | As needed | No dedicated ITSM tool |
| SSL vendor portals | SSL certificate management | Reza | Several times/year | Outlook calendar reminders + vendor email notifications; installation is manual |

### Missing Tools
- **VMware vCenter** — centralized VM management; currently managing VMs without a proper management layer
- **Renewed/refreshed in-house server hardware** — aging infrastructure that needs replacement

### Underused Tools
None identified.

### Data Locations
- Infrastructure configuration: AWS Portal, MongoDB Portal
- IT asset inventory: Excel spreadsheet (no dedicated ITSM tool)
- PCI evidence and documentation: Evidence repository (assembled manually during audit cycles)
- Email and SharePoint: M365
- Monitoring data: AWS SNS/EventBridge (cloud), Nagios (MonexGroup on-prem)

### Integration Gaps
- **IT asset inventory** is maintained in a spreadsheet with no integration to procurement, onboarding/offboarding, or monitoring systems
- **SSL certificate tracking** relies on manual Outlook reminders and vendor email — no automated system-level tracking or renewal pipeline
- No automated connection between HR system and Identity/Access provisioning (onboarding/offboarding is manually triggered)

### Access Risks
No single-admin access silos identified. All critical systems have shared or backed-up access.

---

## 4. Workflows & Processes

### 4.1 Jira Intake, Review & Execution

**Trigger:** Development need, bug, incident, or operational requirement affecting Dev, Dev2, Prod, or Prod2
**Owner:** Reza
**Frequency:** ~5 tickets/week | **Volume:** ~20/month
**Time:** 10 minutes to several hours per ticket depending on complexity and environment risk
**Tools Used:** Jira, AWS Portal, MongoDB Portal, PuTTY, RDP

**Steps:**
1. Triage ticket for clarity, scope, risk, and environment impact
2. Confirm which environments and databases (including MongoDB) are involved; push back for clarification if needed
3. Assess dependencies, risk, and sequencing
4. Apply and validate the change in Dev or Dev2 first
5. Coordinate with development team to test and confirm expected behavior
6. Make go/no-go decision for Prod or Prod2
7. Schedule or execute the change (maintenance window for higher-risk work)
8. Monitor alerts and system health closely
9. Stay engaged until stability is confirmed
10. Close ticket after verification and documentation

**Inputs Required:** Clear scope, environment identification, business context, risk assessment
**Output/Deliverable:** Validated change applied across environments; documented ticket closure
**Common Exceptions:** Generally stable with minimal exceptions
**Documentation Status:** Tracked in Jira; ticket closure includes documentation of what was done
**WeVend vs MonexGroup Differences:** Separate environments (Dev, Dev2, Prod, Prod2) with MongoDB instances across both

---

### 4.2 Gateway Design, Enhancement & Ongoing Maintenance

**Trigger:** Request from application development team for new feature, integration, or behavior change at gateway level
**Owner:** Reza (Jeffrey as backup)
**Frequency:** Continuous; new requests arrive regularly | **Volume:** Varies
**Time:** Hours to weeks depending on complexity and scope
**Tools Used:** AWS Portal, PuTTY, Jira

**Steps:**
1. Review what the application needs; assess impact and risk
2. Design or adjust gateway configuration or supporting infrastructure
3. Implement in Dev or Dev2 first
4. Test end-to-end with developers; iterate as needed
5. Once stable, promote to Prod or Prod2 with monitoring in place
6. Ongoing: tune performance, improve resilience, handle upgrades, respond to gateway-related issues

**Inputs Required:** Clear feature/integration requirement, environment context, risk tolerance
**Output/Deliverable:** Validated gateway change deployed to production with monitoring; ongoing operational stability
**Common Exceptions:** Multi-department dependencies slow coordination; production changes affect customers and require off-peak scheduling (after-hours)
**Documentation Status:** Changes documented via Jira tickets
**WeVend vs MonexGroup Differences:** Serves both business units; gateway architecture underpins both

---

### 4.3 Infrastructure Maintenance Windows & After-Hours Production Changes

**Trigger:** Scheduled monthly window or urgent production change requirement (release, security update, critical fix)
**Owner:** Reza
**Frequency:** ~1 planned window/month + 1–4 unplanned after-hours changes/month
**Time:** ~3 hours per planned maintenance window; variable for unplanned changes
**Tools Used:** AWS Portal, PuTTY, RDP, monitoring dashboards

**Steps:**
1. Planning: confirm scope, dependencies, backups, rollback options, stakeholder notifications
2. During window: apply infrastructure, gateway, database, or patch changes in controlled sequence
3. Validate application and system health
4. Monitor logs and alerts in real time
5. Stay engaged until stability clearly confirmed
6. Close out and document the work

**Inputs Required:** Change scope, rollback plan, stakeholder sign-off
**Output/Deliverable:** Completed, validated production change with documented outcomes
**Common Exceptions:** Complexity may extend the window; rollbacks add time
**Documentation Status:** Documented post-window
**Personal cost:** Reza is effectively on-call 24/7 for monitoring and incident response outside of scheduled windows. In a bad month, up to 5 after-hours events.

---

### 4.4 Continuous Monitoring, Alert Review & Incident Response

**Trigger:** Continuous (automated alerts) or incident detection
**Owner:** Reza (primary); Ronit for MonexGroup servers (Nagios)
**Frequency:** Continuous | **Volume:** 1–5 actionable alerts/week; real incidents infrequent
**Time:** ~2 hours/week for triage; ~1 hour to resolve when a real incident occurs
**Tools Used:** AWS SNS, EventBridge, Nagios, monitoring dashboards, email, SMS

**Steps:**
1. Continuous monitoring via dashboards, email, and SMS notifications
2. Triage alert by severity and scope — distinguish noise from real impact
3. Confirm environment and systems involved
4. Low-risk: track and remediate during business hours
5. High-severity/outage: immediate incident response — validate impact, stabilize, apply fastest safe mitigation (rollback, failover, config change, or temporary isolation)
6. Coordinate with development or operations if needed
7. Communicate status as appropriate
8. Stay engaged until fully resolved and systems stable
9. Post-incident: document, identify root cause, apply preventive changes

**Inputs Required:** Alert data from monitoring tools
**Output/Deliverable:** Resolved incident; root cause analysis; preventive changes
**Common Exceptions:** Rare genuine incidents; high volume of noise requires constant mental filtering
**Documentation Status:** Post-incident documentation; root cause tracked

---

### 4.5 DevOps Coordination & Reviews

**Trigger:** Calendar-based (weekly, monthly, quarterly, annually)
**Owner:** Reza
**Frequency:** Weekly, monthly, quarterly, annually | **Volume:** 52 weekly + 12 monthly + 4 quarterly + annual PCI activities

**Weekly (~1 hour):**
Operational and tactical. Attendees: DevOps, engineering leads, occasionally operations. Reviews: open Jira items, recent changes, incidents, alerts, upcoming work, blockers, priorities. Outputs: updated Jira status, clarified ownership, short-term action items.

**Monthly (~1 hour):**
Structured and risk-focused. Attendees: DevOps, IT, platform stakeholders. Reviews: change activity, access and configuration drift, maintenance outcomes, recurring issues, compliance checks (access reviews, log review requirements). Outputs: documented reviews, corrective actions, audit inputs.

**Quarterly (~2 hours):**
Formal and governance-driven. Attendees: DevOps, IT leadership, key stakeholders. Reviews: access reviews, data retention, security controls, incident trends, PCI-related requirements. Outputs: signed-off review artifacts, audit-ready evidence, agreed improvements or resourcing needs.

**Annual (40–80 hours total for PCI-required reviews):**
PCI scoping and asset inventory validation; risk assessments and targeted risk analyses (TRA); incident-response plan review and testing; vulnerability management (ASV scans and remediation tracking); penetration testing coordination; audit-log retention and review validation; policy and procedure reviews with documented sign-off.

---

### 4.6 Annual PCI Recertification (WeVend & WeVend US)

**Trigger:** Year-round ongoing; formal assessment cycle annually
**Owner:** Reza (primary technical and operational point of contact end-to-end)
**Frequency:** Continuous operations; annual assessment spike
**People involved:** 8–12 cross-company (engineering, DevOps, product/ops, payments/finance, leadership for sign-off, external vendors, QSA)
**Tools Used:** Evidence repository, policy documentation, AWS Portal, scan tools, QSA platform

**Steps:**
1. Review prior year assessment results, open items, compensating controls
2. Confirm current PCI scope (environments, gateways, third-party dependencies)
3. Maintain ongoing operational controls year-round: log reviews, access reviews, vulnerability management, change management — all documented
4. As assessment approaches: gather evidence across infrastructure, applications, gateways, databases, networking, and security tooling
5. Validate policies and procedures
6. Confirm access reviews, data-retention checks, incident-response testing
7. Coordinate required scans (ASV), penetration tests, and processor/gateway re-certifications
8. Active assessment: act as primary technical and operational contact with QSA; pull in other teams as needed
9. Respond to assessor questions; provide system walkthroughs; address gaps/findings in real time; track remediation
10. Close with documented lessons learned; update controls and processes; roll into next cycle

**Inputs Required:** Year-round operational control documentation; cross-department cooperation for evidence; QSA engagement
**Output/Deliverable:** Attestation of Compliance (AOC) for WeVend and WeVend US; updated scope and diagrams; evidence repository; signed policies; scan results; formal reports
**Most Painful Part:** Evidence gathering and reconciliation — proving controls were consistently followed throughout the year and coordinating follow-ups when gaps or clarifications are identified
**Documentation Status:** Formal; produces audit-ready artifacts
**WeVend vs MonexGroup Differences:** Two separate entities (WeVend and WeVend US), each requiring their own AOC and evidence set — this doubles a significant portion of the coordination and documentation burden
**Note:** Reza acts as both the primary owner and the primary doer end-to-end, while coordinating 8–12 people who do not report to him.

---

### 4.7 Software Licensing, SSL Certificate Management & Vendor Negotiations

**Trigger:** Calendar-based renewals; expiry notifications; vendor outreach
**Owner:** Reza
**Frequency:** Licensing: quarterly/annually; SSL: several times/year; Vendor negotiations: infrequent
**Tools Used:** SSL vendor portals, Outlook calendar (SSL reminders), vendor email notifications, M365

**Licensing:**
Track tools for continued need, correct sizing, and compliance. Coordinate and execute renewals. Each renewal takes a few hours to review, coordinate, and execute. Most renewals happen quarterly or annually.

**SSL Certificates:**
Monitor expirations (Outlook reminders + vendor email notifications). Renew and deploy certificates across gateways and services. Validate post-deployment. Time-critical. Typically a few focused hours per certificate. Installation is manual.

**Vendor Negotiations:**
Technical review, security and compliance considerations, cost discussions. Infrequent but effort-intensive — typically spread over several conversations across days or weeks.

**Inputs Required:** Renewal notices, vendor invoices, expiry alerts
**Output/Deliverable:** Renewed licenses, deployed SSL certificates, executed vendor agreements
**Common Exceptions:** Missed SSL expiry would cause gateway/service outage — high consequence
**Documentation Status:** Tracked via Outlook calendar reminders and vendor emails; no automated system-level tracking

---

### 4.8 Enterprise Application Administration

**Trigger:** Ongoing operational need; access changes; incidents; onboarding/offboarding
**Owner:** Both (Reza oversight; Ronit execution for routine tasks)
**Frequency:** Ongoing | **Volume:** Varies

**Activities:**
- User access and permissions management (onboarding, offboarding, role changes)
- Configuration changes and updates
- Access and functionality issue resolution
- Application health and usage monitoring
- Update coordination across systems
- Escalation handling for issues beyond basic support
- Security and compliance alignment for tools touching production systems, sensitive data, or external integrations

**Inputs Required:** Access change requests, issue reports, audit requirements
**Output/Deliverable:** Secure, well-managed application environment; audit-ready access records
**Documentation Status:** Managed operationally; access changes tracked through standard processes

---

### 4.9 Cross-Department Compliance & Audit Support

**Trigger:** Ad-hoc request from Sales, Product, Operations, Legal, or Finance
**Owner:** Reza
**Frequency:** Sometimes weekly during active sales/onboarding cycles; less frequent otherwise
**Volume:** Scales directly with client acquisition activity

**Activities:**
- Customer due-diligence questionnaires (DDQs) — reviewing, drafting, and validating responses
- Vendor risk assessments — providing security control evidence and attestations
- Regulatory questions — explaining PCI status, data handling, incident response
- Audit follow-ups — providing and validating evidence (AOCs, pen-test summaries, policy excerpts)

**Inputs Required:** Questionnaire or assessment from requestor; source documentation (AOCs, policies, scan results)
**Output/Deliverable:** Accurate, consistent security/compliance responses for customers, partners, auditors, and regulators
**Common Exceptions:** Incomplete questions from requestors; questions that span multiple departments requiring coordination
**Documentation Status:** Responses are drafted and validated but not yet systematically templated or maintained in a reusable library
**Scaling Risk:** As Wevend moves toward 2–4 client launches/month, this workload scales linearly with sales activity — it will become a bottleneck without automation or standardization.

---

### 4.10 Network Management & Changes

**Trigger:** Application changes, partner/service onboarding, security requirements, compliance findings, incident resolution
**Owner:** Reza
**Frequency:** Few small adjustments most weeks; larger changes less frequently | **Volume:** Variable
**Tools Used:** PuTTY (SSH) for firewall management; AWS Portal for cloud networking

**Activities:**
- Firewall rules, security groups, routing, VPN/peering connections
- Allowlists, load balancer and gateway networking
- Troubleshooting latency or connectivity issues
- Responding to incidents and audit findings

**Process:** Review impact → apply in non-production first where possible → careful production rollout with monitoring
**Common Exceptions:** Networking changes have a wide blast radius if done incorrectly — high caution is standard
**Documentation Status:** Changes tracked through Jira and documented post-execution

---

### 4.11 Escalated IT Issues

**Trigger:** Issue exceeds scope of routine support; production impact, security concern, regulatory consequence, or unclear ownership
**Owner:** Reza
**Frequency:** Several times/month for true escalations; smaller judgment calls more frequently
**Sources:** Engineering, Operations, Product, Sales, Leadership

**Types of escalations:**
- Production outages or degradation
- Security alerts or potential incidents
- High-risk changes affecting multiple systems
- Conflicting requirements between speed and compliance
- Vendor or AI tool requests introducing data-exposure or governance risk
- Situations with no clear owner and business or regulatory consequences

**Process:** Assess impact and risk → decide on course of action or acceptable trade-off → coordinate execution → document decision to prevent recurrence

**Output/Deliverable:** Resolved escalation; documented decision and rationale
**Documentation Status:** Decisions documented to prevent re-surfacing as the same issue

---

### 4.12 Onboarding & Offboarding

**Trigger:** HR notification (start date confirmation for onboarding; termination notification for offboarding)
**Owner:** Ronit (execution); Reza (oversight for access and risk)
**Frequency:** 2–4 per month | **Time:** 1–5 hours each

**Onboarding steps:**
1. Create user identity and email
2. Provision access to required systems and applications based on role (least-privilege)
3. Set up device if needed (imaging, basic setup)
4. Apply security controls (MFA, endpoint protection)
5. Confirm access with hiring manager
Completed within 1–2 days if no special requirements.

**Offboarding steps:**
1. Immediately disable access (email, SSO, VPN, all applications) — time-critical
2. Revoke credentials and tokens
3. Secure or recover device
4. Review any shared or role-specific access to ensure nothing is left behind
5. Confirm closure with HR

**Inputs Required:** HR notification with start/end date and role details
**Output/Deliverable:** Fully provisioned new employee, or fully offboarded departed employee with all access revoked
**Documentation Status:** Ronit executes a checklist; no automated triggering from HR system

---

### 4.13 Hardware & Peripherals Purchasing

**Trigger:** New hire, device failure, or additional equipment need
**Owner:** Ronit (execution); Reza involved for security, compliance, or cost considerations
**Frequency:** Few times/month; spikes during hiring periods or larger rollouts
**Tools Used:** Approved vendor portals; Excel inventory spreadsheet

**Steps:**
1. Confirm requirement and approval
2. Source hardware from approved vendors
3. Place order and track delivery
4. Prepare device if needed (imaging, basic setup)
5. Coordinate handoff or shipping to user

**Inputs Required:** Manager request and approval; hardware spec requirements
**Output/Deliverable:** Delivered and configured hardware; updated inventory spreadsheet
**Documentation Status:** Tracked manually in Excel inventory spreadsheet

---

## 5. Handoffs & Dependencies

### Inbound (What This Department Receives)

| From Department | What | Format | How | Common Problems |
|---|---|---|---|---|
| Engineering & Product | Jira tickets, design questions, deployment/environment requests, implementation and change requests | Jira tickets, Teams messages, email | Jira (formal), Teams/email (informal) | Incomplete scope, missing environment context, underestimation of risk ("just a small change"), dev team busyness causing alignment delays |
| Sales & Product | DDQs, security assessments, PCI evidence requests | Email, documents | Email | Incomplete questions; tight deadlines; requests spanning multiple departments |
| HR | Onboarding/offboarding triggers, policy attestation requirements | Email, verbal | Email/Teams | Timing issues; incomplete role information for provisioning |
| Leadership & Finance | Vendor approvals, purchase validations, security trade-off decisions | Email, meetings | Email/meetings | Delayed approvals slowing vendor or procurement work |
| All Departments | Day-to-day IT issues, hardware/software requests | Ad-hoc | Teams, email, phone, in-person | No formal intake; informal requests mix with strategic work |

### Outbound (What This Department Delivers)

| To Department | What | Format | How | Common Problems |
|---|---|---|---|---|
| Engineering & Product | Implemented infrastructure/gateway changes, Jira change execution, environment support | Jira updates, deployed changes | Jira, direct | Scheduling delays due to after-hours requirements |
| Sales & Product | DDQ responses, PCI evidence, AOCs, security assessments, pen-test summaries, policy excerpts | Documents, email | Email | Turnaround time pressure during active deals |
| All Departments | Onboarding/offboarding execution, hardware/software procurement, IT maintenance, troubleshooting | Provisioned access, delivered hardware, resolved issues | Direct, email | Volume spikes during growth periods |
| Leadership & Finance | Risk assessments, vendor security reviews, compliance sign-offs | Reports, email | Email, meetings | |

### Blocking Dependencies
- Cannot act on requests until they arrive with sufficient scope, context, and environment detail — incomplete requests trigger clarification loops before work can start
- Often waiting on the development team for scheduling availability to coordinate and validate changes

### Cross-Functional Gaps
- Security and compliance ownership for new tools/integrations — no other department owns this
- Customer/vendor security questionnaire responses — Sales brings in the request but no one else can own the response
- Risk decisions without a clear owner — land on Infrastructure & Compliance by default when they have regulatory or business consequences
- Cross-functional tasks spanning Development, Infrastructure, and Compliance simultaneously

### Most Frequent Interactions (Ranked)
1. Engineering / WeVend Development (by far the most frequent)
2. Sales, Product, Operations, HR, Finance, Leadership (roughly equal)

---

## 6. Pain Points & Bottlenecks

### ⚠️ Primary Constraint: Understaffing

**The root cause underlying most pain points in this department is understaffing.** Infrastructure & Compliance is a two-person department responsible for a scope that spans cloud infrastructure (AWS), gateway architecture, PCI compliance for two separate entities, enterprise IT operations for WeVend's head office, networking, security governance, AI governance, and cross-department compliance support for five other departments. There is no slack capacity to absorb unexpected work, pursue proactive improvements, or invest in the architectural redesign that scaling to 10,000 terminals requires. The pain points listed below — alert noise, coordination friction, gray-area absorption, DDQ overload — are all real, but they are amplified by the absence of sufficient headcount. Many would be manageable at this scope with a properly sized team; with two people, they compound each other. **Addressing understaffing is the highest-leverage action available to this department.**

### Time Sinks (Ranked by Priority)

| Rank | Pain Point | Time Cost (per week) | Who It Affects | Root Cause |
|---|---|---|---|---|
| 1 | Alert noise | ~2 hours | Reza | Poor signal-to-noise ratio in current alerting setup; only 1–5 alerts/week are actionable |
| 2 | Dev team coordination friction | ~2 hours | Reza | Dev team is consistently at capacity; scheduling and validation require significant back-and-forth |
| 3 | Incomplete incoming requests | ~1 hour | Reza | No enforced intake standard; requestors underestimate the information required |
| 4 | Ad-hoc compliance/DDQ responses | ~2 hours typical, ~4 hours busy week | Reza | No reusable response library; requests scale with sales activity |
| 5 | Gray-area ownership | ~3 hours | Reza | No formal ownership framework for cross-functional risk decisions |
| 6 | Manual processes at scale | ~2 hours (largely addressed by IaC in progress) | Reza | Legacy manual provisioning/config; IaC migration underway |
| 7 | PCI evidence gathering | ~12 hours/year (coordination portion) | Reza | No automated evidence tracking or collection; manual coordination of 8–12 people |

### Bottlenecks
- **Development team availability** — the most consistent external bottleneck; limits scheduling of infrastructure changes and validations
- **Incomplete request information** — creates a queue of clarification loops before real work can start
- **Gray-area ownership** — items sit unresolved until they become urgent, then land on Infrastructure & Compliance

### Error-Prone Areas
Errors arise from context gaps, urgency, and fragmentation — not lack of technical capability.

- **Changes under time pressure** — incomplete inputs and last-minute deadlines increase risk of misconfiguration
- **Compliance evidence and questionnaire responses** — risk of inaccuracy when responses are drafted quickly without a validated library
- **Cross-team changes (Dev + Infra + Compliance)** — complex coordination increases risk of misalignment or missed steps

### Scaling Risks
Critical risks as Wevend grows from 1,500 to 10,000 terminals:

- **⚠️ Understaffing is the primary scaling risk** — a two-person department is already operating at or beyond capacity at 1,500 terminals. As terminal count, client count, PCI obligations, and cross-department support demands grow, the current team size will become a hard ceiling on how fast Wevend can scale safely. Automation can buy time, but it cannot substitute for adequate headcount indefinitely. A headcount plan for this department is a business-critical decision, not an HR formality.
- **Core systems require architectural redesign** — both Development and Infrastructure & Compliance need to do this work simultaneously, but both are already at capacity. Without carving out dedicated time, this redesign keeps getting deferred by day-to-day operational demand.
- **Manual terminal-by-terminal processes won't scale** — provisioning, configuration, change management, alerting, incident response, and PCI evidence handling will become increasingly error-prone at volume
  - *Mitigation in progress:* Infrastructure-as-Code (IaC) work is underway and largely resolving the provisioning/configuration layer
- **DDQ/compliance support scales linearly with sales** — at 2–4 launches/month, this becomes a significant recurring burden without automation

### Tribal Knowledge Risks
No critical "only I know" gaps identified at this time. Jeffrey provides gateway backup; Reza provides full backup for Ronit's responsibilities.

---

## 7. The Wish List

- **Additional headcount** — the department's most urgent need; hiring an additional team member would materially reduce risk, enable proactive work, and allow Reza to focus on architecture, compliance, and strategic initiatives rather than absorbing all operational and gray-area work
- **VMware vCenter** — centralized VM management
- **Renewed/refreshed in-house server hardware** — aging infrastructure replacement
- **Alert noise reduction** — better filtering and classification of AWS SNS/EventBridge/Nagios alerts so only actionable events reach Reza
- **Structured dev team coordination** — a more formal intake and sync mechanism to reduce scheduling friction
- **Request intake standards** — enforced template for Jira and ad-hoc requests to reduce clarification loops
- **DDQ/compliance response library** — pre-approved, reusable responses to common security questionnaire questions
- **Ownership routing framework** — clearer escalation paths so gray-area requests reach the right owner rather than defaulting to Infrastructure & Compliance

---

## 8. Upcoming Changes

No anticipated changes identified at time of interview (March 26, 2026).

---

*This profile was generated during a Department X-Ray session on March 26, 2026. It should be reviewed quarterly and updated as the department evolves.*
