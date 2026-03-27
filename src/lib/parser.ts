import fs from 'fs';
import path from 'path';
import type {
  AutomationPriority,
  Department,
  DepartmentProfile,
  MilestoneConfig,
  MilestoneStatus,
  ParsedTimeSavings,
  ScalingRisk,
  TeamMember,
} from './types';

const ARTIFACTS_DIR = path.join(process.cwd(), 'artifacts');
const DEPARTMENTS_DIR = path.join(ARTIFACTS_DIR, 'WeVend X-Ray');

// ---------------------------------------------------------------------------
// Time savings parsing
// ---------------------------------------------------------------------------

const HOURS_PER_WEEK_PATTERN =
  /(\d+(?:\.\d+)?)\s*(?:[–\-]\s*(\d+(?:\.\d+)?))?\s*(?:hours?|hrs?|h)\s*(?:\/|\s*per\s*)\s*(?:week|wk)\b/i;

const NON_STANDARD_UNIT_PATTERNS = [
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:minutes?|mins?)\s*(?:\/|\s*per\s*)\s*(?:week|wk|day|merchant|partner|request)/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:hours?|hrs?|h)\s*(?:\/|\s*per\s*)\s*(?:month|day|merchant|partner|request)/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:days?)\b/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:hours?|hrs?)\s+(?:of\s+)?(?:\w+\s+)?daily/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:minutes?|mins?)\s*(?:\/|\s*per\s*)\s*(?:day)/i,
];

const NOT_QUANTIFIED_PATTERNS = [
  /not quantified/i,
  /to be quantified/i,
];

export function parseTimeSavings(raw: string): ParsedTimeSavings {
  const trimmed = raw.trim();

  // Empty string
  if (!trimmed) {
    return { valid: false, rawText: raw, issue: 'no numeric value found' };
  }

  // Check "not quantified" first
  for (const pattern of NOT_QUANTIFIED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, rawText: raw, issue: 'not quantified' };
    }
  }

  // Try valid hours/week pattern
  const hoursMatch = trimmed.match(HOURS_PER_WEEK_PATTERN);
  if (hoursMatch) {
    const min = parseFloat(hoursMatch[1]);
    const max = hoursMatch[2] ? parseFloat(hoursMatch[2]) : min;
    const midpoint = (min + max) / 2;
    const display =
      min === max ? `${min} hrs/wk` : `${min}\u2013${max} hrs/wk`;
    return { valid: true, min, max, midpoint, display };
  }

  // Check for non-standard units (has numbers but wrong unit)
  for (const pattern of NON_STANDARD_UNIT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, rawText: raw, issue: 'non-standard unit' };
    }
  }

  // Has any number at all? If yes but didn't match above, it's non-standard
  if (/\d/.test(trimmed)) {
    return { valid: false, rawText: raw, issue: 'non-standard unit' };
  }

  // No numbers found at all
  return { valid: false, rawText: raw, issue: 'no numeric value found' };
}

export function getMilestones(): MilestoneConfig[] {
  const raw = fs.readFileSync(path.join(ARTIFACTS_DIR, 'milestones.json'), 'utf-8');
  const data = JSON.parse(raw);
  return data.milestones;
}

export function getStatuses(): Record<string, MilestoneStatus> {
  const raw = fs.readFileSync(path.join(ARTIFACTS_DIR, 'status.json'), 'utf-8');
  return JSON.parse(raw);
}

export function getDepartmentSlugs(): string[] {
  const entries = fs.readdirSync(DEPARTMENTS_DIR, { withFileTypes: true });
  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) return false;
      const dirPath = path.join(DEPARTMENTS_DIR, entry.name);
      return (
        fs.existsSync(path.join(dirPath, 'department_profile.md')) &&
        fs.existsSync(path.join(dirPath, 'automation_priorities.md'))
      );
    })
    .map((entry) => entry.name);
}

// ---------------------------------------------------------------------------
// Priority parsing helpers
// ---------------------------------------------------------------------------

interface SummaryRow {
  rank: number;
  effort: string;
  complexity: string;
  impact: string;
}

function parseSummaryTable(content: string): SummaryRow[] {
  const rows: SummaryRow[] = [];

  // Find the Priority Summary table by locating a table whose header has
  // both a Rank/Priority column and a Complexity or Impact column
  const tableSection = findTableSection(content, (headers) =>
    headers.some((h) => /^(rank|priority)$/i.test(h)) &&
    (headers.some((h) => /^complexity$/i.test(h)) || headers.some((h) => /^impact$/i.test(h)))
  );
  if (!tableSection) return rows;

  const headerCells = parseTableHeaders(tableSection);
  const dataRows = parseTableRows(tableSection);

  // Dynamically find column indices by header name
  const rankIdx = headerCells.findIndex((h) => /^(rank|priority)$/i.test(h));
  const complexityIdx = headerCells.findIndex((h) => /^complexity$/i.test(h));
  const impactIdx = headerCells.findIndex((h) => /^impact$/i.test(h));
  const effortIdx = headerCells.findIndex((h) => /est\.?\s*(time\s+saved|effort)/i.test(h));

  for (const cells of dataRows) {
    const rank = parseInt(cells[rankIdx] ?? '', 10);
    if (isNaN(rank)) continue;

    rows.push({
      rank,
      effort: effortIdx >= 0 && cells[effortIdx] ? cells[effortIdx] : 'Medium',
      complexity: complexityIdx >= 0 && cells[complexityIdx] ? cells[complexityIdx] : 'Medium',
      impact: impactIdx >= 0 && cells[impactIdx] ? cells[impactIdx] : 'High',
    });
  }
  return rows;
}

function extractField(
  section: string,
  ...labels: string[]
): string {
  for (const label of labels) {
    // Match **Label:** followed by content until the next **SomeLabel:** or heading
    const pattern = new RegExp(
      `\\*\\*${label}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*[A-Z][^*]*:\\*\\*|\\n#{2,3}\\s|$)`,
      'i'
    );
    const match = section.match(pattern);
    if (match) {
      return match[1].trim();
    }
  }
  return '';
}

function extractListField(section: string, ...labels: string[]): string[] {
  const raw = extractField(section, ...labels);
  if (!raw) return [];

  // Try bullet points first
  if (raw.includes('\n-') || raw.startsWith('-')) {
    return raw
      .split(/\n-\s*/)
      .map((s) => s.replace(/^-\s*/, '').trim())
      .filter((s) => s.length > 0);
  }

  // Try semicolons
  if (raw.includes(';')) {
    return raw
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  }

  // Single item
  return [raw];
}

function parseEffort(val: string): AutomationPriority['effort'] {
  const clean = val.split(/[—\-–(]/)[0].trim();
  if (/^high/i.test(clean)) return 'High';
  if (/^med/i.test(clean)) return 'Medium';
  return 'Low';
}

function parseComplexity(val: string): AutomationPriority['complexity'] {
  const clean = val.split(/[—\-–(]/)[0].trim();
  if (/^high/i.test(clean)) return 'High';
  if (/^medium[\s-]*high/i.test(clean)) return 'Medium-High';
  if (/^med/i.test(clean)) return 'Medium';
  return 'Low';
}

function parseImpact(val: string): AutomationPriority['impact'] {
  const clean = val.split(/[—\-–(]/)[0].trim();
  if (/^critical/i.test(clean)) return 'Critical';
  if (/^very\s*high/i.test(clean)) return 'Very High';
  if (/^high/i.test(clean)) return 'High';
  if (/^med/i.test(clean)) return 'Medium';
  return 'Low';
}

export function parsePriorities(slug: string): AutomationPriority[] {
  const filePath = path.join(DEPARTMENTS_DIR, slug, 'automation_priorities.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  const summaryRows = parseSummaryTable(content);

  // Split into priority sections using ## or ### Priority N
  const sectionRegex = /^#{2,3}\s+Priority\s+(\d+)\s*[—:\-–]\s*(.+)/gm;
  const matches: { rank: number; name: string; startIndex: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = sectionRegex.exec(content)) !== null) {
    matches.push({
      rank: parseInt(m[1], 10),
      name: m[2].trim(),
      startIndex: m.index + m[0].length,
    });
  }

  const priorities: AutomationPriority[] = [];

  for (let i = 0; i < matches.length; i++) {
    const { rank, name, startIndex } = matches[i];
    // Get the section text between this priority heading and the next
    const nextHeadingIndex = i + 1 < matches.length
      ? content.lastIndexOf('\n', matches[i + 1].startIndex - matches[i + 1].name.length - 20)
      : content.length;
    const section = content.slice(startIndex, nextHeadingIndex);

    // Get summary row data for this rank
    const summaryRow = summaryRows.find((r) => r.rank === rank);

    // Extract complexity from inline field
    const inlineComplexity = extractField(section, 'Complexity');

    // Determine effort, complexity, impact
    let effort: AutomationPriority['effort'] = 'Medium';
    let complexity: AutomationPriority['complexity'] = 'Medium';
    let impact: AutomationPriority['impact'] = 'High';

    if (summaryRow) {
      effort = parseEffort(summaryRow.effort);
      impact = parseImpact(summaryRow.impact);
      complexity = parseComplexity(summaryRow.complexity);
    }

    // Inline complexity overrides if present
    if (inlineComplexity) {
      complexity = parseComplexity(inlineComplexity);
    }

    // Extract status
    const statusField = extractField(section, 'Status');
    const status = statusField || 'Not started';

    // Extract fields with variant label support
    const whatToAutomate = extractField(
      section,
      'What to automate/improve',
      'What to automate',
      'What to Automate',
      'What to Build',
      'What to Improve'
    );

    const currentState = extractField(section, 'Current state', 'Current State', 'Target State');
    const whyItMatters = extractField(section, 'Why it matters', 'Why It Matters');
    const estimatedTimeSavings = extractField(
      section,
      'Estimated time savings',
      'Estimated Time Savings',
      'Estimated Risk Reduction'
    );
    const dependencies = extractListField(section, 'Dependencies');
    const suggestedApproach = extractField(section, 'Suggested approach', 'Suggested Approach');
    const successCriteria = extractField(section, 'Success criteria', 'Success Criteria');

    priorities.push({
      departmentSlug: slug,
      rank,
      name,
      effort,
      complexity,
      impact,
      whatToAutomate,
      currentState,
      whyItMatters,
      estimatedTimeSavings,
      dependencies,
      suggestedApproach,
      successCriteria,
      status,
    });
  }

  return priorities;
}

// ---------------------------------------------------------------------------
// Department profile parsing
// ---------------------------------------------------------------------------

function slugToName(slug: string, content: string): string {
  // Extract from H1: "# Something — Department Profile" or "# Something - Department Profile"
  const h1Match = content.match(/^#\s+(.+?)[\s]*[—\-–][\s]*Department Profile/m);
  if (h1Match) {
    // Strip trailing "Department" if present (e.g. "Accounting Department" -> "Accounting")
    return h1Match[1].trim().replace(/\s+Department\s*$/i, '');
  }
  // Fallback: capitalize slug
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function extractSectionContent(content: string, headingPattern: string): string {
  const regex = new RegExp(
    `^#{2,3}\\s+${headingPattern}\\s*$`,
    'm'
  );
  const match = regex.exec(content);
  if (!match) return '';

  const start = match.index + match[0].length;
  // Find next heading of same or higher level
  const headingLevel = match[0].match(/^(#{2,3})/)?.[1].length ?? 2;
  const nextHeadingRegex = new RegExp(`^#{1,${headingLevel}}\\s`, 'm');
  const rest = content.slice(start);
  const nextMatch = nextHeadingRegex.exec(rest);
  const end = nextMatch ? nextMatch.index : rest.length;
  return rest.slice(0, end).trim();
}

function parseTableRows(section: string): string[][] {
  const lines = section.split('\n').filter((l) => /^\|/.test(l.trim()));
  if (lines.length < 3) return []; // need header + separator + at least 1 data row
  // Skip header (index 0) and separator (index 1)
  return lines.slice(2).map((line) =>
    line
      .split('|')
      .map((c) => c.trim())
      .filter((c) => c.length > 0)
  );
}

function parseTableHeaders(section: string): string[] {
  const lines = section.split('\n').filter((l) => /^\|/.test(l.trim()));
  if (lines.length < 1) return [];
  return lines[0]
    .split('|')
    .map((c) => c.trim())
    .filter((c) => c.length > 0);
}

function findTableSection(content: string, headerTest: (headers: string[]) => boolean): string {
  // Find a table in the content where headers match the test
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!/^\|/.test(line)) continue;
    const headers = line
      .split('|')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    if (headerTest(headers)) {
      // Collect all table lines from here
      const tableLines: string[] = [];
      for (let j = i; j < lines.length; j++) {
        if (/^\|/.test(lines[j].trim())) {
          tableLines.push(lines[j]);
        } else if (tableLines.length > 0) {
          break;
        }
      }
      return tableLines.join('\n');
    }
  }
  return '';
}

function parseTeamTable(content: string): TeamMember[] {
  const tableSection = findTableSection(content, (headers) =>
    headers.some((h) => /^name$/i.test(h)) && headers.some((h) => /title/i.test(h))
  );
  if (!tableSection) return [];

  const headers = parseTableHeaders(tableSection);
  const rows = parseTableRows(tableSection);
  const nameIdx = headers.findIndex((h) => /^name$/i.test(h));
  const titleIdx = headers.findIndex((h) => /title/i.test(h));
  const respIdx = headers.findIndex((h) => /responsibilities|reports to|employment/i.test(h));

  return rows
    .filter((row) => row.length > Math.max(nameIdx, titleIdx))
    .map((row) => ({
      name: row[nameIdx]?.replace(/\*\*/g, '').trim() ?? '',
      title: row[titleIdx]?.replace(/\*\*/g, '').trim() ?? '',
      responsibilities: respIdx >= 0 ? (row[respIdx]?.replace(/\*\*/g, '').trim() ?? '') : '',
    }));
}

function parseToolsList(content: string): string[] {
  const tableSection = findTableSection(content, (headers) =>
    headers.some((h) => /^tool$/i.test(h)) &&
    headers.some((h) => /purpose|type/i.test(h))
  );
  if (!tableSection) return [];

  const rows = parseTableRows(tableSection);
  return rows
    .map((row) => row[0]?.replace(/\*\*/g, '').trim() ?? '')
    .filter((t) => t.length > 0);
}

function parseSPOFs(content: string): string[] {
  // Try "Single Points of Failure" section
  const spofSection = extractSectionContent(content, 'Single Points of Failure');
  if (spofSection) {
    const rows = parseTableRows(spofSection);
    if (rows.length > 0) {
      return rows.map((row) => {
        const person = row[0]?.trim() ?? '';
        const what = row[1]?.trim() ?? '';
        return `${person}: ${what}`;
      });
    }
  }

  // For Sales Ops: check "Capacity Note" text
  const capacityMatch = content.match(/\*\*Capacity Note:\*\*\s*([\s\S]*?)(?=\n---|\n##)/);
  if (capacityMatch) {
    return [capacityMatch[1].trim()];
  }

  return [];
}

function parsePainPointsList(content: string): string[] {
  // Try "Time Sinks" section (accounting / infrastructure / operations format)
  const timeSinksSection = extractSectionContent(content, 'Time Sinks[^\\n]*');
  if (timeSinksSection) {
    const rows = parseTableRows(timeSinksSection);
    if (rows.length > 0) {
      return rows.map((row) => row[0]?.trim() ?? '').filter((p) => p.length > 0);
    }
  }

  // Try "Pain Points & Bottlenecks" section
  const painSection = extractSectionContent(content, '6\\.\\s*Pain Points & Bottlenecks');
  if (painSection) {
    const rows = parseTableRows(painSection);
    if (rows.length > 0) {
      return rows.map((row) => row[0]?.trim() ?? '').filter((p) => p.length > 0);
    }
  }

  // Sales Ops: "Handoffs & Dependencies Map" table with "Bottleneck?" column
  const handoffsTable = findTableSection(content, (headers) =>
    headers.some((h) => /bottleneck/i.test(h))
  );
  if (handoffsTable) {
    const headers = parseTableHeaders(handoffsTable);
    const bottleneckIdx = headers.findIndex((h) => /bottleneck/i.test(h));
    const rows = parseTableRows(handoffsTable);
    return rows
      .filter((row) => bottleneckIdx >= 0 && /^yes/i.test(row[bottleneckIdx] ?? ''))
      .map((row) => {
        const from = row[0]?.trim() ?? '';
        const to = row[1]?.trim() ?? '';
        const method = row[2]?.trim() ?? '';
        return `${from} → ${to}: ${method}`;
      })
      .filter((p) => p.length > 3);
  }

  return [];
}

function parseBulletPoints(section: string): string[] {
  return section
    .split('\n')
    .filter((l) => /^\s*-\s+/.test(l))
    .map((l) => l.replace(/^\s*-\s+/, '').trim())
    .filter((s) => s.length > 0);
}

function parseTribalKnowledge(content: string): string[] {
  // Try "Tribal Knowledge Risks" subsection (accounting — bullet list)
  const tribalSection = extractSectionContent(content, 'Tribal Knowledge Risks');
  if (tribalSection) {
    // Check for bullet list first
    const bullets = parseBulletPoints(tribalSection);
    if (bullets.length > 0) return bullets;

    // Check for table
    const rows = parseTableRows(tribalSection);
    if (rows.length > 0) {
      return rows.map((row) => {
        const risk = row[0]?.trim() ?? '';
        const desc = row[1]?.trim() ?? '';
        return desc ? `${risk}: ${desc}` : risk;
      });
    }
  }

  // Try "Tribal Knowledge & Key Risks" section (sales-ops — table)
  const tribalSection2 = extractSectionContent(content, '10\\.\\s*Tribal Knowledge & Key Risks');
  if (tribalSection2) {
    const rows = parseTableRows(tribalSection2);
    if (rows.length > 0) {
      return rows.map((row) => {
        const risk = row[0]?.trim() ?? '';
        const desc = row[1]?.trim() ?? '';
        return desc ? `${risk}: ${desc}` : risk;
      });
    }
  }

  // Try "Tribal Knowledge" section (infrastructure / operations format — bullet list or plain text)
  const tribalSection3 = extractSectionContent(content, 'Tribal Knowledge');
  if (tribalSection3) {
    const bullets = parseBulletPoints(tribalSection3);
    if (bullets.length > 0) return bullets;

    // Plain text (e.g. "No significant tribal knowledge gaps...")
    const trimmed = tribalSection3.trim();
    if (trimmed.length > 0) return [trimmed];
  }

  return [];
}

function extractMission(content: string): string {
  // Try bold inline field first: **Mission:** ...
  const boldMatch = content.match(/\*\*Mission:\*\*\s*([\s\S]*?)(?=\n\*\*[A-Z][^*]*:\*\*|\n#{2,3}\s|\n---|\n$)/);
  if (boldMatch) {
    return boldMatch[1].trim();
  }

  // Try ### Mission heading
  const section = extractSectionContent(content, 'Mission');
  return section;
}

function extractScope(content: string): string {
  // Try bold inline field first: **Scope:** ...
  const boldMatch = content.match(/\*\*Scope:\*\*\s*([\s\S]*?)(?=\n\*\*[A-Z][^*]*:\*\*|\n#{2,3}\s|\n---|\n$)/);
  if (boldMatch) {
    return boldMatch[1].trim();
  }

  // Try ### Scope heading
  const section = extractSectionContent(content, 'Scope');
  return section;
}

export function parseProfile(slug: string): DepartmentProfile {
  const filePath = path.join(DEPARTMENTS_DIR, slug, 'department_profile.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  const name = slugToName(slug, content);
  const mission = extractMission(content);
  const scope = extractScope(content);
  const teamMembers = parseTeamTable(content);
  const tools = parseToolsList(content);
  const singlePointsOfFailure = parseSPOFs(content);
  const painPoints = parsePainPointsList(content);
  const tribalKnowledgeRisks = parseTribalKnowledge(content);

  return {
    slug,
    name,
    mission,
    scope,
    teamMembers,
    tools,
    singlePointsOfFailure,
    painPoints,
    tribalKnowledgeRisks,
  };
}

// ---------------------------------------------------------------------------
// Timeline & Scaling Risk parsing
// ---------------------------------------------------------------------------

function parseNumberedList(content: string, sectionName: string): string[] | undefined {
  // Match section heading flexibly — sectionName may be a prefix of the full heading
  const regex = new RegExp(
    `^##\\s+${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\n]*$`,
    'im'
  );
  const match = regex.exec(content);
  if (!match) return undefined;

  const start = match.index + match[0].length;
  // Find next heading
  const rest = content.slice(start);
  const nextHeading = rest.match(/\n##\s/);
  const sectionText = nextHeading ? rest.slice(0, nextHeading.index) : rest;

  const items: string[] = [];
  const lines = sectionText.split('\n');
  for (const line of lines) {
    const itemMatch = line.match(/^\s*\d+\.\s+(.+)/);
    if (itemMatch) {
      items.push(itemMatch[1].trim());
    }
  }

  return items.length > 0 ? items : undefined;
}

function parseScalingRisks(content: string): ScalingRisk[] | undefined {
  // Find the Scaling Risks section
  const regex = /^##\s+Scaling Risks[^\n]*$/im;
  const match = regex.exec(content);
  if (!match) return undefined;

  const start = match.index + match[0].length;
  const rest = content.slice(start);
  const nextHeading = rest.match(/\n##\s/);
  const sectionText = nextHeading ? rest.slice(0, nextHeading.index) : rest;

  // Parse the table
  const tableLines = sectionText.split('\n').filter((l) => /^\|/.test(l.trim()));
  if (tableLines.length < 3) return undefined; // header + separator + at least 1 row

  const rows = tableLines.slice(2); // skip header and separator
  const risks: ScalingRisk[] = [];

  for (const row of rows) {
    const cells = row
      .split('|')
      .map((c) => c.trim())
      .filter((c) => c.length > 0);
    if (cells.length < 3) continue;

    // 4-column format: Risk | Current State | What Breaks at Scale | Recommended Action
    if (cells.length >= 4) {
      risks.push({
        area: cells[0],
        risk: cells[2],        // "What Breaks at Scale"
        mitigation: cells[3],  // "Recommended Action"
      });
    } else {
      // 3-column fallback
      risks.push({
        area: cells[0],
        risk: cells[1],
        mitigation: cells[2],
      });
    }
  }

  return risks.length > 0 ? risks : undefined;
}

// ---------------------------------------------------------------------------
// Department aggregation
// ---------------------------------------------------------------------------

export function getDepartment(slug: string): Department {
  const profile = parseProfile(slug);
  const priorities = parsePriorities(slug);

  const filePath = path.join(DEPARTMENTS_DIR, slug, 'automation_priorities.md');
  const content = fs.readFileSync(filePath, 'utf-8');

  const quickWins = parseNumberedList(content, 'Quick Wins');
  const thirtyDayTargets = parseNumberedList(content, '30-Day Targets');
  const ninetyDayTargets = parseNumberedList(content, '90-Day Targets');
  const scalingRisks = parseScalingRisks(content);

  return {
    profile,
    priorities,
    quickWins,
    thirtyDayTargets,
    ninetyDayTargets,
    scalingRisks,
  };
}

export function getAllDepartments(): Department[] {
  return getDepartmentSlugs().map((slug) => getDepartment(slug));
}
