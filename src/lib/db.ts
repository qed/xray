import { createClient } from '@/lib/supabase/server';
import { computeScore, MILESTONE_STAGES } from '@/lib/constants';
import type {
  DbDepartment, DbPriority, DbMilestone,
  Organization, OrgMember, Invite,
  RankedOpportunity, ParsedTimeSavings, Completeness, CompanyOverview,
  DepartmentSummary, TimeSavingsRollup, ConsolidatedRisk,
  StaffingOverview, DepartmentDependency, StrategicBlocker,
  ToolOverlap,
} from '@/lib/types';

// ---------- Auth / Org Helpers ----------

export async function getCurrentUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export async function getUserOrgs(userId: string): Promise<(OrgMember & { organization: Organization })[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('org_members')
    .select('*, organization:organizations(*)')
    .eq('user_id', userId);
  if (error) throw error;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []) as any;
}

export async function getOrgBySlug(slug: string): Promise<Organization | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('organizations')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

export async function getUserRole(orgId: string, userId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('org_members')
    .select('role')
    .eq('org_id', orgId)
    .eq('user_id', userId)
    .single();
  return data?.role ?? null;
}

export async function getOrgMembers(orgId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('org_members')
    .select('*')
    .eq('org_id', orgId);
  const members = data ?? [];

  // Fetch emails via admin client (auth.users not accessible via RLS)
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const admin = createAdminClient();
  const enriched = await Promise.all(
    members.map(async (m) => {
      const { data: userData } = await admin.auth.admin.getUserById(m.user_id);
      return { ...m, email: userData?.user?.email ?? 'unknown' };
    })
  );
  return enriched;
}

// ---------- Invite Helpers ----------

export async function getInviteByCode(code: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('invites')
    .select('*, organization:organizations(*)')
    .eq('code', code)
    .single();
  return data;
}

export async function getOrgInvites(orgId: string): Promise<Invite[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('invites')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: false });
  return data ?? [];
}

// ---------- Department Queries ----------

export async function getDepartments(orgId: string): Promise<DbDepartment[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('departments')
    .select('*')
    .eq('org_id', orgId)
    .order('name');
  return data ?? [];
}

export async function getDepartmentBySlug(orgId: string, slug: string): Promise<DbDepartment | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('departments')
    .select('*')
    .eq('org_id', orgId)
    .eq('slug', slug)
    .single();
  return data;
}

export async function getTeamMembers(departmentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('department_id', departmentId);
  return data ?? [];
}

export async function getPriorities(departmentId: string): Promise<(DbPriority & { milestone_stage: number })[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('priorities')
    .select('*, milestone:milestones(*)')
    .eq('department_id', departmentId)
    .order('rank');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((p: any) => {
    const m = Array.isArray(p.milestone) ? p.milestone[0] : p.milestone;
    return { ...p, milestone_stage: m?.stage ?? 0 };
  });
}

export async function getAllPrioritiesForOrg(orgId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('priorities')
    .select('*, department:departments!inner(*), milestone:milestones(*)')
    .eq('department.org_id', orgId)
    .order('rank');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((p: any) => ({
    ...p,
    milestone: Array.isArray(p.milestone) ? p.milestone[0] ?? null : p.milestone,
  })) as (DbPriority & { department: DbDepartment; milestone: DbMilestone | null })[];
}

export async function getScalingRisks(departmentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('scaling_risks')
    .select('*')
    .eq('department_id', departmentId);
  return data ?? [];
}

export async function getQuickWins(departmentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('quick_wins')
    .select('*')
    .eq('department_id', departmentId);
  return (data ?? []).map((d) => d.description);
}

export async function getThirtyDayTargets(departmentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('thirty_day_targets')
    .select('*')
    .eq('department_id', departmentId);
  return (data ?? []).map((d) => d.description);
}

export async function getNinetyDayTargets(departmentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('ninety_day_targets')
    .select('*')
    .eq('department_id', departmentId);
  return (data ?? []).map((d) => d.description);
}

// ---------- Time Savings Parser ----------

const HOURS_PER_WEEK_PATTERN =
  /(\d+(?:\.\d+)?)\s*(?:[–\-]\s*(\d+(?:\.\d+)?))?\s*(?:hours?|hrs?|h)\s*(?:\/|\s*per\s*)\s*(?:week|wk)\b/i;

const NON_STANDARD_UNIT_PATTERNS = [
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:minutes?|mins?)\s*(?:\/|\s*per\s*)\s*(?:week|wk|day|merchant|partner|request)/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:hours?|hrs?|h)\s*(?:\/|\s*per\s*)\s*(?:month|day|merchant|partner|request)/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:days?)\b/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:hours?|hrs?)\s+(?:of\s+)?(?:\w+\s+)?daily/i,
  /\d+(?:\.\d+)?\s*(?:[–\-]\s*\d+(?:\.\d+)?)?\s*(?:minutes?|mins?)\s*(?:\/|\s*per\s*)\s*(?:day)/i,
];

const NOT_QUANTIFIED_PATTERNS = [/not quantified/i, /to be quantified/i];

export function parseTimeSavings(raw: string): ParsedTimeSavings {
  const trimmed = (raw ?? '').trim();

  if (!trimmed) {
    return { valid: false, rawText: raw ?? '', issue: 'no numeric value found' };
  }

  for (const pattern of NOT_QUANTIFIED_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, rawText: raw, issue: 'not quantified' };
    }
  }

  const hoursMatch = trimmed.match(HOURS_PER_WEEK_PATTERN);
  if (hoursMatch) {
    const min = parseFloat(hoursMatch[1]);
    const max = hoursMatch[2] ? parseFloat(hoursMatch[2]) : min;
    const midpoint = (min + max) / 2;
    const display = min === max ? `${min} hrs/wk` : `${min}\u2013${max} hrs/wk`;
    return { valid: true, min, max, midpoint, display };
  }

  for (const pattern of NON_STANDARD_UNIT_PATTERNS) {
    if (pattern.test(trimmed)) {
      return { valid: false, rawText: raw, issue: 'non-standard unit' };
    }
  }

  if (/\d/.test(trimmed)) {
    return { valid: false, rawText: raw, issue: 'non-standard unit' };
  }

  return { valid: false, rawText: raw, issue: 'no numeric value found' };
}

const REQUIRED_PRIORITY_FIELDS = [
  'name', 'what_to_automate', 'current_state', 'why_it_matters',
  'estimated_time_savings', 'complexity', 'impact',
  'suggested_approach', 'success_criteria', 'dependencies',
] as const;

export function getCompletenessScore(p: Record<string, unknown> | DbPriority): Completeness {
  const record = p as Record<string, unknown>;
  const missing: string[] = [];
  for (const field of REQUIRED_PRIORITY_FIELDS) {
    const value = record[field];
    if (Array.isArray(value) ? value.length === 0 : !value) {
      missing.push(field);
    }
  }
  return { score: 10 - missing.length, total: 10, missing };
}

// ---------- Aggregation Functions ----------

export async function getTopWins(orgId: string, n: number): Promise<RankedOpportunity[]> {
  const allPriorities = await getAllPrioritiesForOrg(orgId);

  const ranked: RankedOpportunity[] = allPriorities.map((p) => {
    const milestoneStage = p.milestone?.stage ?? 0;
    const milestoneName = MILESTONE_STAGES[milestoneStage]?.name ?? 'Not Started';
    const parsedTimeSavings = parseTimeSavings(p.estimated_time_savings);

    return {
      id: p.id,
      departmentSlug: p.department.slug,
      departmentName: p.department.name,
      rank: p.rank,
      name: p.name,
      impact: p.impact,
      complexity: p.complexity,
      effort: p.effort,
      estimatedTimeSavings: p.estimated_time_savings,
      parsedTimeSavings,
      milestoneStage,
      milestoneName,
      score: computeScore(p.impact, p.effort),
      whatToAutomate: p.what_to_automate,
      currentState: p.current_state,
      whyItMatters: p.why_it_matters,
      dependencies: p.dependencies,
      suggestedApproach: p.suggested_approach,
      successCriteria: p.success_criteria,
      completeness: getCompletenessScore(p),
    };
  });

  ranked.sort((a, b) => b.score - a.score);
  return ranked.slice(0, n);
}

export async function getUnfiledRankedOpportunities(orgId: string): Promise<RankedOpportunity[]> {
  const all = await getTopWins(orgId, 1000);
  return all
    .filter((opp) => opp.completeness.score < 10)
    .sort((a, b) => a.completeness.score - b.completeness.score);
}

export async function getOpportunitiesByMilestone(orgId: string): Promise<Record<number, RankedOpportunity[]>> {
  const all = await getTopWins(orgId, 1000);
  const grouped: Record<number, RankedOpportunity[]> = { 0: [], 1: [], 2: [], 3: [] };
  for (const opp of all) {
    (grouped[opp.milestoneStage] ??= []).push(opp);
  }
  return grouped;
}

export async function getCompanyOverview(orgId: string): Promise<CompanyOverview> {
  const all = await getTopWins(orgId, 1000);
  const departments = await getDepartments(orgId);

  const byMilestoneStage: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0 };
  for (const opp of all) {
    byMilestoneStage[opp.milestoneStage] = (byMilestoneStage[opp.milestoneStage] ?? 0) + 1;
  }

  const deptSummaries: DepartmentSummary[] = departments.map((dept) => {
    const deptOpps = all.filter((o) => o.departmentSlug === dept.slug);
    const completed = deptOpps.filter((o) => o.milestoneStage === 3).length;
    const inProgress = deptOpps.filter((o) => o.milestoneStage > 0 && o.milestoneStage < 3).length;
    const notStarted = deptOpps.filter((o) => o.milestoneStage === 0).length;
    const total = deptOpps.length;
    return {
      slug: dept.slug,
      name: dept.name,
      totalPriorities: total,
      completed,
      inProgress,
      notStarted,
      progressPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  });

  const totalCompleted = all.filter((o) => o.milestoneStage === 3).length;

  return {
    totalOpportunities: all.length,
    byMilestoneStage,
    totalCompleted,
    departments: deptSummaries,
    topWins: all.slice(0, 10),
  };
}

export async function getTimeSavingsRollup(orgId: string): Promise<TimeSavingsRollup> {
  const all = await getTopWins(orgId, 1000);
  const departments = await getDepartments(orgId);

  let totalPotential = 0;
  let totalRealized = 0;

  const byDepartment = departments.map((dept) => {
    const deptOpps = all.filter((o) => o.departmentSlug === dept.slug);
    let potential = 0;
    let realized = 0;
    for (const opp of deptOpps) {
      if (opp.parsedTimeSavings.valid) {
        potential += opp.parsedTimeSavings.midpoint;
        if (opp.milestoneStage >= 1) realized += opp.parsedTimeSavings.midpoint;
      }
    }
    totalPotential += potential;
    totalRealized += realized;
    return { slug: dept.slug, name: dept.name, potentialHoursPerWeek: potential, realizedHoursPerWeek: realized };
  });

  return {
    totalPotentialHoursPerWeek: totalPotential,
    realizedHoursPerWeek: totalRealized,
    remainingHoursPerWeek: totalPotential - totalRealized,
    byDepartment,
  };
}

export async function getConsolidatedRisks(orgId: string): Promise<ConsolidatedRisk[]> {
  const departments = await getDepartments(orgId);
  const risks: ConsolidatedRisk[] = [];
  let riskId = 0;

  for (const dept of departments) {
    for (const item of dept.single_points_of_failure) {
      risks.push({ id: `risk-${++riskId}`, description: item, type: 'people', severity: 'critical', departmentSlug: dept.slug, departmentName: dept.name, source: 'spof' });
    }
    for (const item of dept.pain_points) {
      risks.push({ id: `risk-${++riskId}`, description: item, type: 'process', severity: 'high', departmentSlug: dept.slug, departmentName: dept.name, source: 'pain-point' });
    }
    for (const item of dept.tribal_knowledge_risks) {
      risks.push({ id: `risk-${++riskId}`, description: item, type: 'people', severity: 'high', departmentSlug: dept.slug, departmentName: dept.name, source: 'tribal-knowledge' });
    }
    const scalingRisks = await getScalingRisks(dept.id);
    for (const sr of scalingRisks) {
      risks.push({ id: `risk-${++riskId}`, description: `${sr.area}: ${sr.risk}`, type: 'process', severity: 'medium', departmentSlug: dept.slug, departmentName: dept.name, source: 'scaling-risk' });
    }
  }
  return risks;
}

export async function getStaffingOverview(orgId: string): Promise<StaffingOverview[]> {
  const departments = await getDepartments(orgId);
  const staffing: StaffingOverview[] = [];
  for (const dept of departments) {
    const team = await getTeamMembers(dept.id);
    const priorities = await getPriorities(dept.id);
    staffing.push({ slug: dept.slug, name: dept.name, teamSize: team.length, priorityCount: priorities.length, prioritiesPerPerson: team.length > 0 ? priorities.length / team.length : 0 });
  }
  return staffing;
}

export async function getCrossDepartmentDependencies(orgId: string): Promise<DepartmentDependency[]> {
  const departments = await getDepartments(orgId);
  const deps: DepartmentDependency[] = [];
  let depId = 0;

  for (const dept of departments) {
    const priorities = await getPriorities(dept.id);
    for (const p of priorities) {
      for (const dep of p.dependencies) {
        const target = departments.find((d) => dep.toLowerCase().includes(d.name.toLowerCase()));
        if (target && target.slug !== dept.slug) {
          deps.push({
            id: `dep-${++depId}`,
            sourceDepartment: dept.slug,
            sourceDepartmentName: dept.name,
            targetDepartment: target.slug,
            targetDepartmentName: target.name,
            description: dep,
            priorityNames: [p.name],
          });
        }
      }
    }
  }
  return deps;
}

export async function getStrategicBlockers(orgId: string): Promise<StrategicBlocker[]> {
  const allPriorities = await getAllPrioritiesForOrg(orgId);
  const depCounts = new Map<string, { departments: Set<string>; priorities: { departmentName: string; priorityName: string }[] }>();

  for (const p of allPriorities) {
    for (const dep of p.dependencies) {
      const key = dep.toLowerCase().trim();
      if (!depCounts.has(key)) depCounts.set(key, { departments: new Set(), priorities: [] });
      const entry = depCounts.get(key)!;
      entry.departments.add(p.department.name);
      entry.priorities.push({ departmentName: p.department.name, priorityName: p.name });
    }
  }

  const blockers: StrategicBlocker[] = [];
  let blockerId = 0;
  for (const [name, data] of depCounts) {
    if (data.priorities.length >= 2) {
      blockers.push({ id: `blocker-${++blockerId}`, name, affectedPriorityCount: data.priorities.length, departments: Array.from(data.departments), priorities: data.priorities });
    }
  }
  blockers.sort((a, b) => b.affectedPriorityCount - a.affectedPriorityCount);
  return blockers;
}

export async function getToolOverlap(orgId: string): Promise<ToolOverlap[]> {
  const departments = await getDepartments(orgId);
  const toolMap = new Map<string, { departments: string[]; slugs: string[] }>();

  for (const dept of departments) {
    for (const tool of dept.tools) {
      const key = tool.toLowerCase().trim();
      if (!toolMap.has(key)) toolMap.set(key, { departments: [], slugs: [] });
      toolMap.get(key)!.departments.push(dept.name);
      toolMap.get(key)!.slugs.push(dept.slug);
    }
  }

  const overlaps: ToolOverlap[] = Array.from(toolMap.entries()).map(([tool, data]) => ({
    tool,
    departments: data.departments,
    departmentSlugs: data.slugs,
    relatedPriorities: [],
  }));
  overlaps.sort((a, b) => b.departments.length - a.departments.length);
  return overlaps;
}
