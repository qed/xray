import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ departmentId: string }> }
) {
  const { departmentId } = await params;
  const type = request.nextUrl.searchParams.get('type');

  if (type !== 'profile' && type !== 'priorities') {
    return NextResponse.json(
      { error: 'Query param "type" must be "profile" or "priorities"' },
      { status: 400 }
    );
  }

  const admin = createAdminClient();

  // Load department
  const { data: dept, error: deptErr } = await admin
    .from('departments')
    .select('*')
    .eq('id', departmentId)
    .single();

  if (deptErr || !dept) {
    return NextResponse.json({ error: 'Department not found' }, { status: 404 });
  }

  // Load team members
  const { data: teamMembers } = await admin
    .from('team_members')
    .select('*')
    .eq('department_id', departmentId);
  const team = teamMembers ?? [];

  // Load priorities (for both types — profile references count, priorities needs full data)
  const { data: priorityRows } = await admin
    .from('priorities')
    .select('*')
    .eq('department_id', departmentId)
    .order('rank');
  const priorities = priorityRows ?? [];

  const safeName = dept.name.replace(/[^a-zA-Z0-9_\- ]/g, '').replace(/\s+/g, '_');
  const today = new Date().toISOString().split('T')[0];

  let markdown: string;
  let filename: string;

  if (type === 'profile') {
    filename = `${safeName}_Department_Profile.md`;
    markdown = generateProfile(dept, team, priorities, today);
  } else {
    filename = `${safeName}_Automation_Priorities.md`;
    markdown = generatePriorities(dept, team, priorities, today);
  }

  return new NextResponse(markdown, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

/* ---------- Profile markdown ---------- */

interface DeptRow {
  name: string;
  mission: string;
  scope: string;
  tools: string[];
  single_points_of_failure: string[];
  pain_points: string[];
  tribal_knowledge_risks: string[];
}

interface TeamRow {
  name: string;
  title: string;
  responsibilities: string;
}

interface PriorityRow {
  rank: number;
  name: string;
  effort: string;
  complexity: string;
  what_to_automate: string;
  current_state: string;
  why_it_matters: string;
  estimated_time_savings: string;
  suggested_approach: string;
  success_criteria: string;
  dependencies: string[];
  frequency?: string;
  hands_on_time?: string;
  waiting_overhead?: string;
  hidden_costs?: string;
  automation_percentage?: string;
  employees_affected?: string;
}

function generateProfile(dept: DeptRow, team: TeamRow[], priorities: PriorityRow[], date: string): string {
  const lines: string[] = [];

  lines.push(`# ${dept.name} — Department Profile`);
  lines.push(`**Date:** ${date}`);
  lines.push(`**Interviewer:** Claude (Department X-Ray)`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Mission & Scope
  lines.push('## 1. Department Identity');
  lines.push('');
  lines.push('### Mission');
  lines.push(dept.mission || '_Not provided_');
  lines.push('');
  lines.push('### Scope');
  lines.push(dept.scope || '_Not provided_');
  lines.push('');

  // People & Roles
  lines.push('---');
  lines.push('');
  lines.push('## 2. People & Roles');
  lines.push('');
  lines.push('### Team Roster');
  lines.push('');
  if (team.length > 0) {
    lines.push('| Name | Title | Key Responsibilities |');
    lines.push('|---|---|---|');
    for (const m of team) {
      lines.push(`| ${m.name} | ${m.title} | ${m.responsibilities} |`);
    }
  } else {
    lines.push('_No team members recorded._');
  }
  lines.push('');

  // Single points of failure
  lines.push('### Single Points of Failure');
  lines.push('');
  if (dept.single_points_of_failure.length > 0) {
    for (const spof of dept.single_points_of_failure) {
      lines.push(`- ${spof}`);
    }
  } else {
    lines.push('_None identified._');
  }
  lines.push('');

  // Tribal Knowledge Risks
  lines.push('### Tribal Knowledge Risks');
  lines.push('');
  if (dept.tribal_knowledge_risks.length > 0) {
    for (const risk of dept.tribal_knowledge_risks) {
      lines.push(`- ${risk}`);
    }
  } else {
    lines.push('_None identified._');
  }
  lines.push('');

  // Tools
  lines.push('---');
  lines.push('');
  lines.push('## 3. Tools & Systems');
  lines.push('');
  if (dept.tools.length > 0) {
    for (const tool of dept.tools) {
      lines.push(`- ${tool}`);
    }
  } else {
    lines.push('_No tools recorded._');
  }
  lines.push('');

  // Pain Points
  lines.push('---');
  lines.push('');
  lines.push('## 4. Pain Points & Bottlenecks');
  lines.push('');
  if (dept.pain_points.length > 0) {
    for (const pp of dept.pain_points) {
      lines.push(`- ${pp}`);
    }
  } else {
    lines.push('_None identified._');
  }
  lines.push('');

  // Scaling Risks (from priorities context)
  lines.push('---');
  lines.push('');
  lines.push('## 5. Automation Overview');
  lines.push('');
  lines.push(`**Total priorities identified:** ${priorities.length}`);
  lines.push(`**Team size:** ${team.length}`);
  lines.push('');

  lines.push('---');
  lines.push('');
  lines.push(`*This profile was generated during a Department X-Ray session on ${date}. It should be reviewed quarterly and updated as the department evolves.*`);

  return lines.join('\n');
}

/* ---------- Priorities markdown ---------- */

function generatePriorities(dept: DeptRow, _team: TeamRow[], priorities: PriorityRow[], date: string): string {
  const lines: string[] = [];

  lines.push(`# ${dept.name} — Automation & Agent Priorities`);
  lines.push(`**Date:** ${date}`);
  lines.push(`**Source:** Department X-Ray interview`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Summary table
  lines.push('## Estimated Time Savings Summary');
  lines.push('');

  // Calculate totals — parse hours/week from estimated_time_savings
  let totalWeekly = 0;
  let quantifiedCount = 0;
  for (const p of priorities) {
    const parsed = parseHoursPerWeek(p.estimated_time_savings);
    if (parsed !== null) {
      const multiplier = parseEmployeesAffected(p.employees_affected);
      totalWeekly += parsed * multiplier;
      quantifiedCount++;
    }
  }

  lines.push('| Metric | Estimated Value |');
  lines.push('|---|---|');
  lines.push(`| **Total estimated time savings (weekly)** | ${totalWeekly.toFixed(1)} hrs/wk |`);
  lines.push(`| **Total estimated time savings (monthly)** | ${(totalWeekly * 4).toFixed(1)} hrs/mo |`);
  lines.push(`| **Total estimated time savings (annually)** | ${(totalWeekly * 52).toFixed(0)} hrs/yr |`);
  lines.push(`| **Number of automation opportunities** | ${priorities.length} |`);
  lines.push(`| **Opportunities with quantified estimates** | ${quantifiedCount} of ${priorities.length} |`);
  lines.push('');

  // Priority summary table
  lines.push('---');
  lines.push('');
  lines.push('## Priority Summary');
  lines.push('');
  lines.push('| Rank | Opportunity | Estimated Time Savings | Complexity | Effort |');
  lines.push('|---|---|---|---|---|');
  for (const p of priorities) {
    lines.push(`| ${p.rank} | ${p.name} | ${p.estimated_time_savings || 'Not estimated'} | ${p.complexity || '-'} | ${p.effort || '-'} |`);
  }
  lines.push('');

  // Detailed priorities
  lines.push('---');
  lines.push('');
  lines.push('## Detailed Opportunities');
  lines.push('');

  for (const p of priorities) {
    lines.push(`### Priority ${p.rank}: ${p.name}`);
    lines.push('');

    lines.push('**What to automate/improve:**');
    lines.push(p.what_to_automate || '_Not provided_');
    lines.push('');

    lines.push('**Current state:**');
    lines.push(p.current_state || '_Not provided_');
    lines.push('');

    lines.push('**Why it matters:**');
    lines.push(p.why_it_matters || '_Not provided_');
    lines.push('');

    lines.push('**Estimated time savings:**');
    lines.push(p.estimated_time_savings || '_Not estimated_');
    lines.push('');

    if (p.employees_affected) {
      lines.push(`**Employees affected:** ${p.employees_affected}`);
      lines.push('');
    }

    if (p.frequency) {
      lines.push(`**Frequency:** ${p.frequency}`);
      lines.push('');
    }

    if (p.hands_on_time) {
      lines.push(`**Hands-on time per occurrence:** ${p.hands_on_time}`);
      lines.push('');
    }

    if (p.waiting_overhead) {
      lines.push(`**Waiting/overhead time:** ${p.waiting_overhead}`);
      lines.push('');
    }

    if (p.hidden_costs) {
      lines.push(`**Hidden costs:** ${p.hidden_costs}`);
      lines.push('');
    }

    if (p.automation_percentage) {
      lines.push(`**Estimated automation percentage:** ${p.automation_percentage}`);
      lines.push('');
    }

    lines.push('**Suggested approach:**');
    lines.push(p.suggested_approach || '_Not provided_');
    lines.push('');

    lines.push('**Success criteria:**');
    lines.push(p.success_criteria || '_Not provided_');
    lines.push('');

    lines.push('**Dependencies:**');
    if (p.dependencies && p.dependencies.length > 0) {
      for (const dep of p.dependencies) {
        lines.push(`- ${dep}`);
      }
    } else {
      lines.push('_None identified_');
    }
    lines.push('');

    lines.push('**Complexity:** ' + (p.complexity || '_Not assessed_'));
    lines.push('');

    lines.push('---');
    lines.push('');
  }

  lines.push(`*This priority list was generated from a Department X-Ray session on ${date}. All time savings figures are estimated and should be validated. Review weekly and update as items are completed or priorities shift.*`);

  return lines.join('\n');
}

/* ---------- Helpers ---------- */

const HOURS_PATTERN = /(\d+(?:\.\d+)?)\s*(?:[–\-]\s*(\d+(?:\.\d+)?))?\s*(?:hours?|hrs?|h)\s*(?:\/|\s*per\s*)\s*(?:week|wk)\b/i;

function parseHoursPerWeek(raw: string | undefined | null): number | null {
  if (!raw) return null;
  const match = raw.match(HOURS_PATTERN);
  if (!match) return null;
  const min = parseFloat(match[1]);
  const max = match[2] ? parseFloat(match[2]) : min;
  return (min + max) / 2;
}

function parseEmployeesAffected(raw: string | undefined | null): number {
  if (!raw) return 1;
  const match = raw.match(/(\d+)/);
  return match ? parseInt(match[1], 10) || 1 : 1;
}
