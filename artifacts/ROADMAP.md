# X-Ray Phase 2 Roadmap

## Phase 0: Data Update
- [ ] Add Infrastructure & Compliance department
- [ ] Add Operations department
- [ ] Update Accounting to v3/v2
- [ ] Update parser for new formats
- [ ] Update status.json with new entries
- [ ] Verify all 4 departments render correctly

## Phase 1: Company-Wide Time Savings Rollup
- [ ] Aggregate time savings in aggregator
- [ ] Add rollup section to Dashboard
- [ ] Department breakdown chart (Recharts)

## Phase 2: Risk Heatmap + Staffing View
- [ ] Extract risks from department profiles in parser/aggregator
- [ ] Create /risks page with risk heatmap
- [ ] Add staffing & capacity section
- [ ] Add "Risks" to navbar

## Phase 3: Dependency Map + Strategic Blockers
- [ ] Extract cross-department dependencies
- [ ] Create /dependencies page with SVG graph
- [ ] Add strategic blockers section to Dashboard
- [ ] Add "Dependencies" to navbar

## Phase 4: Tool Overlap
- [ ] Aggregate tools across departments
- [ ] Create /tools page with matrix view
- [ ] Add "Tools" to navbar

## Phase 5: Tour Page
- [ ] Create /tour page with step-by-step walkthrough
- [ ] Cover all major features
- [ ] Final content pass after all features complete

## Phase 6: Robust Parsing & Data Completeness (Current)
- [ ] Define "complete priority" schema (10 required fields)
- [ ] Build flexible parser that handles format variations across departments/companies
- [ ] Unify seed.ts and parse-upload.ts into shared parsing module
- [ ] Redesign Missing Gaps page as priority-centric cards with inline editing
- [ ] Guided input: dropdowns for complexity/impact, number input for hrs/week, free-text for rest
- [ ] Completeness scoring per priority (fields filled / fields required)

## Phase 7: AI-Assisted Gap Filling (Future)
- [ ] User pastes raw notes or unstructured text into a gap card
- [ ] AI parses and normalizes input (e.g., "about 3 days a month" → "~1.5 hrs/week")
- [ ] Confirm step before saving — user reviews AI interpretation
- [ ] Support bulk paste: drop in a document and auto-extract fields for multiple priorities
- [ ] Could use Claude API or similar for intelligent extraction
