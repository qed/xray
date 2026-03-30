import type { DbDepartment, DbTeamMember, RankedOpportunity } from './types';

const FIELD_LABELS: Record<string, string> = {
  name: 'Name',
  what_to_automate: 'What to Automate',
  current_state: 'Current State',
  why_it_matters: 'Why It Matters',
  estimated_time_savings: 'Estimated Time Savings (in hrs/week format)',
  complexity: 'Complexity (Low, Low-Medium, Medium, Medium-High, or High)',
  impact: 'Impact (Low, Medium, High, Very High, or Critical)',
  dependencies: 'Dependencies (as a bullet list)',
  suggested_approach: 'Suggested Approach',
  success_criteria: 'Success Criteria',
};

const DB_TO_PROP: Record<string, keyof RankedOpportunity> = {
  name: 'name',
  what_to_automate: 'whatToAutomate',
  current_state: 'currentState',
  why_it_matters: 'whyItMatters',
  estimated_time_savings: 'estimatedTimeSavings',
  complexity: 'complexity',
  impact: 'impact',
  dependencies: 'dependencies',
  suggested_approach: 'suggestedApproach',
  success_criteria: 'successCriteria',
};

function readField(p: RankedOpportunity, dbCol: string): string {
  const prop = DB_TO_PROP[dbCol];
  if (!prop) return '';
  const val = p[prop];
  if (Array.isArray(val)) return val.length > 0 ? val.map((v) => `- ${v}`).join('\n') : '';
  return typeof val === 'string' ? val : String(val ?? '');
}

export function generateDepartmentPrompt(
  department: DbDepartment,
  teamMembers: DbTeamMember[],
  incompletePriorities: RankedOpportunity[],
): string {
  const lines: string[] = [];

  lines.push(`# Missing Data Collection: ${department.name} Department`);
  lines.push('');
  lines.push('You are helping collect missing information for automation priorities. Below is the department context and the priorities that have incomplete data. For each priority, fill in ONLY the missing fields based on your knowledge of the department and its operations.');
  lines.push('');

  // Department context
  lines.push('## Department Context');
  lines.push('');
  if (department.mission) {
    lines.push(`**Mission:** ${department.mission}`);
    lines.push('');
  }
  if (department.scope) {
    lines.push(`**Scope:** ${department.scope}`);
    lines.push('');
  }

  if (teamMembers.length > 0) {
    lines.push('**Team:**');
    for (const tm of teamMembers) {
      lines.push(`- ${tm.name} — ${tm.title} (${tm.responsibilities})`);
    }
    lines.push('');
  }

  if (department.tools.length > 0) {
    lines.push(`**Tools & Software:** ${department.tools.join(', ')}`);
    lines.push('');
  }

  if (department.pain_points.length > 0) {
    lines.push('**Pain Points:**');
    for (const pp of department.pain_points) {
      lines.push(`- ${pp}`);
    }
    lines.push('');
  }

  if (department.single_points_of_failure.length > 0) {
    lines.push('**Single Points of Failure:**');
    for (const spof of department.single_points_of_failure) {
      lines.push(`- ${spof}`);
    }
    lines.push('');
  }

  if (department.tribal_knowledge_risks.length > 0) {
    lines.push('**Tribal Knowledge Risks:**');
    for (const tk of department.tribal_knowledge_risks) {
      lines.push(`- ${tk}`);
    }
    lines.push('');
  }

  // Priorities with missing data
  lines.push('---');
  lines.push('');
  lines.push('## Priorities Needing Data');
  lines.push('');

  for (const p of incompletePriorities) {
    lines.push(`### Priority ${p.rank}: ${p.name}`);
    lines.push('');

    // Show known fields as context
    const knownFields: string[] = [];
    const missingFields: string[] = [];

    for (const [dbCol, label] of Object.entries(FIELD_LABELS)) {
      if (dbCol === 'name') continue; // already in heading
      if (p.completeness.missing.includes(dbCol)) {
        missingFields.push(dbCol);
      } else {
        const val = readField(p, dbCol);
        if (val) knownFields.push(`**${label}:** ${val}`);
      }
    }

    if (knownFields.length > 0) {
      lines.push('**Known information:**');
      lines.push('');
      for (const kf of knownFields) {
        lines.push(kf);
        lines.push('');
      }
    }

    if (missingFields.length > 0) {
      lines.push('**Please provide the following missing fields:**');
      lines.push('');
      for (const mf of missingFields) {
        lines.push(`- **${FIELD_LABELS[mf]}:** [FILL IN]`);
      }
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  // Output format instructions
  lines.push('## Output Format');
  lines.push('');
  lines.push('Please output a markdown file with the following format for each priority:');
  lines.push('');
  lines.push('```');
  lines.push(`### Priority [RANK]: [NAME]`);
  lines.push('');
  lines.push('**What to automate/improve:**');
  lines.push('[content]');
  lines.push('');
  lines.push('**Current state:**');
  lines.push('[content]');
  lines.push('');
  lines.push('**Why it matters:**');
  lines.push('[content]');
  lines.push('');
  lines.push('**Estimated time savings:**');
  lines.push('[X hrs/week]');
  lines.push('');
  lines.push('**Complexity:** [Low/Low-Medium/Medium/Medium-High/High]');
  lines.push('');
  lines.push('**Impact:** [Low/Medium/High/Very High/Critical]');
  lines.push('');
  lines.push('**Dependencies:**');
  lines.push('- [dependency 1]');
  lines.push('');
  lines.push('**Suggested approach:**');
  lines.push('[content]');
  lines.push('');
  lines.push('**Success criteria:**');
  lines.push('[content]');
  lines.push('');
  lines.push('**Status:** [Not started/In Progress/etc.]');
  lines.push('```');
  lines.push('');
  lines.push('Include ALL fields for each priority (both the existing known data and the newly filled data). This file will be uploaded to X-Ray for parsing.');

  return lines.join('\n');
}
