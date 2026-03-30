import type { TeamMember } from '@/lib/types';

/* ------------------------------------------------------------------ */
/*  Public interfaces                                                  */
/* ------------------------------------------------------------------ */

export interface ParsedProfile {
  name: string;
  mission: string;
  scope: string;
  teamMembers: TeamMember[];
  tools: string[];
  singlePointsOfFailure: string[];
  painPoints: string[];
  tribalKnowledgeRisks: string[];
}

export interface ParsedPriority {
  rank: number;
  name: string;
  effort: string;
  complexity: string;
  whatToAutomate: string;
  currentState: string;
  whyItMatters: string;
  estimatedTimeSavings: string;
  suggestedApproach: string;
  successCriteria: string;
  dependencies: string[];
  status: string;
  /** Fields from the required-10 list that are empty / missing. */
  missingFields: string[];
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const REQUIRED_FIELDS = [
  'name',
  'whatToAutomate',
  'currentState',
  'whyItMatters',
  'estimatedTimeSavings',
  'complexity',
  'suggestedApproach',
  'successCriteria',
  'dependencies',
] as const;

function stripBold(s: string): string {
  return s.replace(/\*\*/g, '').trim();
}

function clean(s: string): string {
  return stripBold(s).replace(/^\||\|$/g, '').trim();
}

/* ------------------------------------------------------------------ */
/*  Heading-format detection                                           */
/* ------------------------------------------------------------------ */

type HeadingFormat = '###' | '##';

/**
 * Detect which heading style the document uses for individual priorities.
 *
 * - `### Priority N:` — accounting, infrastructure, operations
 * - `## Priority N —`  — sales-ops (uses \u2014 or \u2013 em/en-dash)
 * - `## Priority N —`  — also catches plain dash
 */
function detectFormat(text: string): HeadingFormat {
  if (/^###\s+Priority\s+\d+/m.test(text)) return '###';
  if (/^###\s+#\d+/m.test(text)) return '###';
  return '##';
}

/**
 * Build the regex that splits the document into priority sections.
 * Returns a global/multiline regex whose first capture group is the rank
 * digit(s) and whose match consumes the heading line up to (but not
 * including) the rest of the section.
 */
function buildSplitRegex(fmt: HeadingFormat): RegExp {
  if (fmt === '###') {
    // ### Priority 1: Name here  OR  ### #1 — Name here
    return /^###\s+(?:Priority\s+)?#?(\d+)/gm;
  }
  // ## Priority 1 — Name here  (em-dash, en-dash, or plain dash)
  return /^##\s+(?:Priority\s+)?#?(\d+)/gm;
}

/* ------------------------------------------------------------------ */
/*  Summary-table parser                                               */
/* ------------------------------------------------------------------ */

/**
 * Parse the summary table that appears before the priority detail
 * sections. Returns a map of rank -> time-savings string.
 */
function parseSummaryTable(text: string): Record<number, string> {
  const result: Record<number, string> = {};
  const lines = text.split('\n');

  let timeColIndex = -1;
  let isWeeklyCol = false;
  let inTable = false;

  for (const line of lines) {
    // Detect header row with rank + time columns
    if (
      line.includes('|') &&
      /(rank|^[|\s]*#[|\s])/i.test(line) &&
      /(time\s*sav|est\.\s*time|net\s*time)/i.test(line)
    ) {
      const headers = line.split('|').map((c) => c.trim());
      // Find the time-savings column (prefer "weekly" / "est. time" / "net time saved")
      timeColIndex = headers.findIndex((h) =>
        /(weekly\s*time\s*sav|est\.\s*time\s*sav|net\s*time\s*sav)/i.test(h)
      );
      if (timeColIndex < 0) {
        timeColIndex = headers.findIndex((h) => /(time\s*sav|est\.\s*time)/i.test(h));
      }
      isWeeklyCol = timeColIndex > 0 && /weekly/i.test(headers[timeColIndex]);
      inTable = true;
      continue;
    }

    // Skip separator row
    if (inTable && /^[|\s-]+$/.test(line)) continue;

    // Parse data rows
    if (inTable && timeColIndex > 0 && line.includes('|')) {
      const cols = line.split('|').map((c) => c.trim());
      const rankMatch = cols[1]?.match(/^\d+/);
      if (rankMatch && cols[timeColIndex]) {
        let val = clean(cols[timeColIndex]);
        // If column header says "weekly" but value lacks a period qualifier, append /week
        if (
          isWeeklyCol &&
          val &&
          /^~?\d/.test(val) &&
          !/(week|wk|month|day|year)/i.test(val)
        ) {
          val = val + '/week';
        }
        if (val) result[parseInt(rankMatch[0], 10)] = val;
      }
    }

    // End table when we hit a non-table, non-empty line
    if (inTable && !line.includes('|') && line.trim()) {
      timeColIndex = -1;
      inTable = false;
    }
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Section / field extraction helpers                                  */
/* ------------------------------------------------------------------ */

function buildSectionFinder(contentLines: string[], subLevel: string) {
  /**
   * Extract the body text under a sub-heading that matches `heading`.
   * Looks for both markdown headings (`### Heading`) and bold-line
   * pseudo-headings (`**Heading:**`).
   */
  return function findSection(heading: string): string {
    let inSection = false;
    const parts: string[] = [];
    const headingRe = new RegExp(`^${subLevel}\\s.*${heading}`, 'i');
    const boldRe = new RegExp(`^\\*\\*${heading}[^*]*\\*\\*:?\\s*$`, 'i');
    const breakHeadingRe = new RegExp(`^${subLevel}\\s`);
    // Any bold-label line acts as a section break (whether or not it has inline content)
    const breakBoldRe = /^\*\*[A-Z][^*]+\*\*/;

    for (const line of contentLines) {
      // Check if this line starts our target section
      if (headingRe.test(line) || boldRe.test(line)) {
        inSection = true;
        continue;
      }
      // Check if this line starts a different section (break)
      if (inSection && (breakHeadingRe.test(line) || breakBoldRe.test(line))) break;
      // Also break on horizontal rules
      if (inSection && /^---\s*$/.test(line)) break;
      if (inSection && line.trim()) parts.push(line.trim());
    }
    return parts.join('\n');
  };
}

function buildFieldFinder(contentLines: string[]) {
  /** Find an inline bold field like `**Complexity:** Medium` */
  return function findField(pattern: RegExp): string {
    for (const line of contentLines) {
      const match = line.match(pattern);
      if (match) return stripBold(match[1] ?? '');
    }
    return '';
  };
}

function buildListFinder(contentLines: string[], subLevel: string) {
  /** Extract bullet items under a sub-heading or bold-line label. */
  return function findList(heading: string): string[] {
    let inSection = false;
    const items: string[] = [];
    const headingRe = new RegExp(`^${subLevel}\\s.*${heading}`, 'i');
    const boldRe = new RegExp(`^\\*\\*${heading}[^*]*\\*\\*:?\\s*$`, 'i');
    const breakHeadingRe = new RegExp(`^${subLevel}\\s`);
    const breakBoldRe = /^\*\*[A-Z][^*]+\*\*/;

    for (const line of contentLines) {
      if (headingRe.test(line) || boldRe.test(line)) {
        inSection = true;
        continue;
      }
      if (inSection && (breakHeadingRe.test(line) || breakBoldRe.test(line))) break;
      if (inSection && /^---\s*$/.test(line)) break;
      if (inSection && /^[-*]\s/.test(line.trim())) {
        items.push(line.trim().replace(/^[-*]\s*/, ''));
      }
    }
    return items;
  };
}

/* ------------------------------------------------------------------ */
/*  parsePriorities                                                    */
/* ------------------------------------------------------------------ */

export function parsePriorities(text: string): ParsedPriority[] {
  if (!text.trim()) return [];

  const fmt = detectFormat(text);
  const splitRe = buildSplitRegex(fmt);

  // Sub-heading level: if priorities use ###, subsections are ####; if ##, subsections are ###.
  const subLevel = fmt === '###' ? '#{3,4}' : '#{2,3}';

  // Parse summary table for time savings (may be empty)
  const summaryTime = parseSummaryTable(text);

  // Split text into sections per priority.
  // We use matchAll to find heading positions, then slice between them.
  const matches = [...text.matchAll(splitRe)];
  if (matches.length === 0) return [];

  const priorities: ParsedPriority[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const rank = parseInt(match[1], 10);
    const headingEnd = match.index! + match[0].length;
    const nextStart = i + 1 < matches.length ? matches[i + 1].index! : text.length;
    const content = text.slice(headingEnd, nextStart);
    const contentLines = content.split('\n');

    const findSection = buildSectionFinder(contentLines, subLevel);
    const findField = buildFieldFinder(contentLines);
    const findList = buildListFinder(contentLines, subLevel);

    // Extract priority name from the remainder of the heading line
    // e.g. ": Sales Orders & Invoicing — POs" or " — Eliminate Duplicate Data"
    const nameMatch = contentLines[0]?.match(/^[:\s\u2014\u2013—–-]*(.+)/);
    const name = nameMatch?.[1]?.trim() ?? `Priority ${rank}`;

    // --- Field extraction cascade ---

    const whatToAutomate =
      findSection('what to automate') ||
      findSection('what to improve') ||
      findSection('what to build') ||
      findSection('automate\\/improve') ||
      findSection('automate');

    const currentState =
      findSection('current state') ||
      findSection('current process') ||
      findSection('current status') ||
      findSection('target state');

    const whyItMatters =
      findSection('why it matters') ||
      findSection('why');

    // Time savings: prefer summary table, then inline fields, then section body
    const estimatedTimeSavings =
      summaryTime[rank] ||
      findField(/\*?\*?estimated time saving\*?\*?s?[:\s]+(.+)/i) ||
      findField(/\*?\*?net time saved\*?\*?[:\s]+(.+)/i) ||
      findField(/\*?\*?time saving\*?\*?s?[:\s]+(.+)/i) ||
      findField(/\*?\*?verified time saving\*?\*?s?[:\s]+(.+)/i) ||
      findSection('estimated time saving') ||
      findSection('net time saved') ||
      findSection('time saving') ||
      findSection('verified time saving') ||
      '';

    const complexity =
      findField(/\*?\*?complexity\*?\*?[:\s]+(.+)/i);

    const suggestedApproach =
      findSection('suggested approach') ||
      findSection('recommended approach') ||
      findSection('approach') ||
      findSection('recommendation');

    const successCriteria =
      findSection('success criteria') ||
      findSection('success');

    const dependencies =
      findList('dependencies') ||
      findList('depends on');

    const status =
      findField(/\*?\*?status\*?\*?[:\s]+(.+)/i);

    const effort =
      findField(/\*?\*?effort\*?\*?[:\s]+(.+)/i);

    // --- Completeness check ---
    const fieldValues: Record<string, unknown> = {
      name,
      whatToAutomate,
      currentState,
      whyItMatters,
      estimatedTimeSavings,
      complexity,
      suggestedApproach,
      successCriteria,
      dependencies,
    };

    const missingFields: string[] = [];
    for (const field of REQUIRED_FIELDS) {
      const val = fieldValues[field];
      if (val === '' || val === undefined || (Array.isArray(val) && val.length === 0)) {
        missingFields.push(field);
      }
    }

    priorities.push({
      rank,
      name,
      effort,
      complexity,
      whatToAutomate,
      currentState,
      whyItMatters,
      estimatedTimeSavings,
      suggestedApproach,
      successCriteria,
      dependencies,
      status,
      missingFields,
    });
  }

  return priorities;
}

/* ------------------------------------------------------------------ */
/*  parseProfile                                                       */
/* ------------------------------------------------------------------ */

export function parseProfile(text: string): ParsedProfile {
  const lines = text.split('\n');

  function extractSection(heading: string): string[] {
    const items: string[] = [];
    let inSection = false;
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) {
        inSection = true;
        continue;
      }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && /^[-*]\s/.test(line)) {
        items.push(line.replace(/^[-*]\s*/, '').trim());
      }
    }
    return items;
  }

  function extractText(heading: string): string {
    let inSection = false;
    const parts: string[] = [];
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) {
        inSection = true;
        continue;
      }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.trim()) parts.push(line.trim());
    }
    return parts.join(' ');
  }

  // Team members from markdown table
  const teamMembers: TeamMember[] = [];
  let inTeamSection = false;
  let pastHeader = false;
  for (const line of lines) {
    if (line.match(/^#{1,3}\s.*(?:team|people\s*&?\s*roles)/i)) {
      inTeamSection = true;
      continue;
    }
    if (inTeamSection && /^#{1,3}\s/.test(line) && !line.match(/(?:team|people\s*&?\s*roles)/i)) break;
    if (inTeamSection && line.includes('|') && line.includes('---')) {
      pastHeader = true;
      continue;
    }
    if (inTeamSection && pastHeader && line.includes('|')) {
      const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
      if (cols.length >= 2) {
        teamMembers.push({
          name: cols[0],
          title: cols[1] ?? '',
          responsibilities: cols[2] ?? '',
        });
      }
    }
  }

  // Department name from `# Heading`
  const name = (lines.find((l) => /^#\s/.test(l)) ?? '')
    .replace(/^#\s*/, '')
    .replace(/\s*[—–\-]+\s*department\s*profile/i, '')
    .replace(/department\s*profile/i, '')
    .replace(/\s*[—–\-]+\s*$/, '')
    .replace(/^\s*[—–\-]+\s*/, '')
    .replace(/\s+department\s*$/i, '')
    .trim();

  // Extract table first column values under a heading (for table-based sections)
  function extractTableColumn(heading: string, colIndex = 0): string[] {
    const items: string[] = [];
    let inSection = false;
    let pastHeader = false;
    for (const line of lines) {
      if (line.match(new RegExp(`^#{1,3}\\s.*${heading}`, 'i'))) {
        inSection = true;
        pastHeader = false;
        continue;
      }
      if (inSection && /^#{1,3}\s/.test(line)) break;
      if (inSection && line.includes('|') && line.includes('---')) {
        pastHeader = true;
        continue;
      }
      if (inSection && pastHeader && line.includes('|')) {
        const cols = line.split('|').map((c) => c.trim()).filter(Boolean);
        if (cols[colIndex] && !/^\*?\*?total\*?\*?$/i.test(cols[colIndex])) {
          items.push(cols[colIndex]);
        }
      }
    }
    return items;
  }

  const tools = extractSection('tools') || extractSection('software') || extractTableColumn('tools');
  const painPoints = extractSection('pain point') || extractSection('bottleneck');
  const singlePointsOfFailure = extractSection('single point');
  const tribalKnowledgeRisks = extractSection('tribal knowledge');

  return {
    name,
    mission: extractText('mission') || extractText('purpose') || extractText('primary focus'),
    scope: extractText('scope') || extractText('responsibility'),
    teamMembers,
    tools,
    singlePointsOfFailure,
    painPoints,
    tribalKnowledgeRisks,
  };
}
