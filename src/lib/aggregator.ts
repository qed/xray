import {
  getAllDepartments,
  getMilestones,
  getStatuses,
  parseTimeSavings,
} from './parser';
import type {
  CompanyOverview,
  DepartmentSummary,
  RankedOpportunity,
  AutomationPriority,
  UnfiledPriority,
  TimeSavingsRollup,
  DepartmentTimeSavings,
  ConsolidatedRisk,
  StaffingOverview,
} from './types';

const IMPACT_SCORES: Record<string, number> = {
  'Critical': 5,
  'Very High': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1,
};

const EFFORT_SCORES: Record<string, number> = {
  'Low': 3,
  'Medium': 2,
  'High': 1,
};

function scoreOpportunity(priority: AutomationPriority): number {
  const impactScore = IMPACT_SCORES[priority.impact] ?? 2;
  const effortScore = EFFORT_SCORES[priority.effort] ?? 2;
  return impactScore * effortScore;
}

function buildRankedOpportunity(
  priority: AutomationPriority,
  departmentName: string,
  milestoneStage: number,
  milestoneName: string
): RankedOpportunity {
  return {
    departmentSlug: priority.departmentSlug,
    departmentName,
    rank: priority.rank,
    name: priority.name,
    impact: priority.impact,
    complexity: priority.complexity,
    effort: priority.effort,
    estimatedTimeSavings: priority.estimatedTimeSavings,
    parsedTimeSavings: parseTimeSavings(priority.estimatedTimeSavings),
    milestoneStage,
    milestoneName,
    score: scoreOpportunity(priority),
    whatToAutomate: priority.whatToAutomate,
    currentState: priority.currentState,
    whyItMatters: priority.whyItMatters,
    dependencies: priority.dependencies,
    suggestedApproach: priority.suggestedApproach,
    successCriteria: priority.successCriteria,
  };
}

function getAllRankedOpportunities(): RankedOpportunity[] {
  const departments = getAllDepartments();
  const statuses = getStatuses();
  const milestones = getMilestones();

  const opportunities: RankedOpportunity[] = [];

  for (const dept of departments) {
    for (const priority of dept.priorities) {
      const statusKey = `${priority.departmentSlug}/priority-${priority.rank}`;
      const status = statuses[statusKey];
      const milestoneStage = status?.milestone ?? 0;
      const milestone = milestones.find((m) => m.id === milestoneStage);
      const milestoneName = milestone?.name ?? 'Not Started';

      opportunities.push(
        buildRankedOpportunity(
          priority,
          dept.profile.name,
          milestoneStage,
          milestoneName
        )
      );
    }
  }

  return opportunities;
}

export function getTopWins(n: number): RankedOpportunity[] {
  const all = getAllRankedOpportunities();
  all.sort((a, b) => b.score - a.score);
  return all.slice(0, n);
}

export function getCompanyOverview(): CompanyOverview {
  const departments = getAllDepartments();
  const statuses = getStatuses();
  const milestones = getMilestones();

  const byMilestoneStage: Record<number, number> = {};
  for (const milestone of milestones) {
    byMilestoneStage[milestone.id] = 0;
  }

  let totalOpportunities = 0;
  let totalCompleted = 0;
  const departmentSummaries: DepartmentSummary[] = [];

  for (const dept of departments) {
    let completed = 0;
    let inProgress = 0;
    let notStarted = 0;

    for (const priority of dept.priorities) {
      totalOpportunities++;
      const statusKey = `${priority.departmentSlug}/priority-${priority.rank}`;
      const status = statuses[statusKey];
      const milestoneStage = status?.milestone ?? 0;

      if (byMilestoneStage[milestoneStage] === undefined) {
        byMilestoneStage[milestoneStage] = 0;
      }
      byMilestoneStage[milestoneStage]++;

      if (milestoneStage === 3) {
        completed++;
        totalCompleted++;
      } else if (milestoneStage > 0) {
        inProgress++;
      } else {
        notStarted++;
      }
    }

    departmentSummaries.push({
      slug: dept.profile.slug,
      name: dept.profile.name,
      totalPriorities: dept.priorities.length,
      completed,
      inProgress,
      notStarted,
      progressPercent:
        dept.priorities.length > 0
          ? Math.round((completed / dept.priorities.length) * 100)
          : 0,
    });
  }

  return {
    totalOpportunities,
    byMilestoneStage,
    totalCompleted,
    departments: departmentSummaries,
    topWins: getTopWins(10),
  };
}

export function getOpportunitiesByMilestone(): Record<number, RankedOpportunity[]> {
  const milestones = getMilestones();
  const all = getAllRankedOpportunities();

  const grouped: Record<number, RankedOpportunity[]> = {};
  for (const milestone of milestones) {
    grouped[milestone.id] = [];
  }

  for (const opp of all) {
    if (!grouped[opp.milestoneStage]) {
      grouped[opp.milestoneStage] = [];
    }
    grouped[opp.milestoneStage].push(opp);
  }

  return grouped;
}

export function getUnfiledRankedOpportunities(): RankedOpportunity[] {
  const all = getAllRankedOpportunities();
  return all.filter((opp) => !opp.parsedTimeSavings.valid);
}

export function getTimeSavingsRollup(): TimeSavingsRollup {
  const departments = getAllDepartments();
  const statuses = getStatuses();

  let totalPotential = 0;
  let totalRealized = 0;
  const byDepartment: DepartmentTimeSavings[] = [];

  for (const dept of departments) {
    let deptPotential = 0;
    let deptRealized = 0;

    for (const priority of dept.priorities) {
      const parsed = parseTimeSavings(priority.estimatedTimeSavings);
      if (!parsed.valid) continue;

      deptPotential += parsed.midpoint;

      const statusKey = `${priority.departmentSlug}/priority-${priority.rank}`;
      const status = statuses[statusKey];
      const milestoneStage = status?.milestone ?? 0;

      if (milestoneStage === 3) {
        deptRealized += parsed.midpoint;
      }
    }

    byDepartment.push({
      slug: dept.profile.slug,
      name: dept.profile.name,
      potentialHoursPerWeek: Math.round(deptPotential * 10) / 10,
      realizedHoursPerWeek: Math.round(deptRealized * 10) / 10,
    });

    totalPotential += deptPotential;
    totalRealized += deptRealized;
  }

  const roundedPotential = Math.round(totalPotential * 10) / 10;
  const roundedRealized = Math.round(totalRealized * 10) / 10;

  return {
    totalPotentialHoursPerWeek: roundedPotential,
    realizedHoursPerWeek: roundedRealized,
    remainingHoursPerWeek: Math.round((roundedPotential - roundedRealized) * 10) / 10,
    byDepartment,
  };
}

export function getUnfiledPriorities(): UnfiledPriority[] {
  const all = getAllRankedOpportunities();
  return all
    .filter((opp) => !opp.parsedTimeSavings.valid)
    .map((opp) => {
      const parsed = opp.parsedTimeSavings;
      return {
        departmentSlug: opp.departmentSlug,
        departmentName: opp.departmentName,
        rank: opp.rank,
        name: opp.name,
        rawText: !parsed.valid ? parsed.rawText : '',
        issue: !parsed.valid ? parsed.issue : '',
      };
    });
}

function classifyRiskType(description: string): 'people' | 'process' | 'tool' {
  const lower = description.toLowerCase();

  // People-related keywords
  if (/\b(single|sole|only|one person|one employee)\b/.test(lower)) return 'people';
  // Check for capitalized names (e.g. "John", "Sarah") — two+ capital-letter words
  if (/\b[A-Z][a-z]+\s+[A-Z][a-z]+/.test(description)) return 'people';

  // Tool-related keywords
  if (/\b(software|system|platform|api|tool|excel|quickbooks|crm|erp|database|server|application|app|integration)\b/.test(lower)) return 'tool';

  return 'process';
}

export function getConsolidatedRisks(): ConsolidatedRisk[] {
  const departments = getAllDepartments();
  const risks: ConsolidatedRisk[] = [];
  let counter = 0;

  for (const dept of departments) {
    const { profile } = dept;

    for (const spof of profile.singlePointsOfFailure) {
      counter++;
      risks.push({
        id: `risk-${counter}`,
        description: spof,
        type: classifyRiskType(spof),
        severity: 'critical',
        departmentSlug: profile.slug,
        departmentName: profile.name,
        source: 'spof',
      });
    }

    for (const pain of profile.painPoints) {
      counter++;
      risks.push({
        id: `risk-${counter}`,
        description: pain,
        type: classifyRiskType(pain),
        severity: 'high',
        departmentSlug: profile.slug,
        departmentName: profile.name,
        source: 'pain-point',
      });
    }

    for (const tribal of profile.tribalKnowledgeRisks) {
      counter++;
      risks.push({
        id: `risk-${counter}`,
        description: tribal,
        type: classifyRiskType(tribal),
        severity: 'high',
        departmentSlug: profile.slug,
        departmentName: profile.name,
        source: 'tribal-knowledge',
      });
    }

    if (dept.scalingRisks) {
      for (const sr of dept.scalingRisks) {
        counter++;
        const description = `${sr.area}: ${sr.risk}`;
        risks.push({
          id: `risk-${counter}`,
          description,
          type: classifyRiskType(description),
          severity: 'medium',
          departmentSlug: profile.slug,
          departmentName: profile.name,
          source: 'scaling-risk',
        });
      }
    }
  }

  return risks;
}

export function getStaffingOverview(): StaffingOverview[] {
  const departments = getAllDepartments();
  const staffing: StaffingOverview[] = [];

  for (const dept of departments) {
    const teamSize = dept.profile.teamMembers.length;
    const priorityCount = dept.priorities.length;
    const prioritiesPerPerson = teamSize > 0
      ? Math.round((priorityCount / teamSize) * 10) / 10
      : 0;

    staffing.push({
      slug: dept.profile.slug,
      name: dept.profile.name,
      teamSize,
      priorityCount,
      prioritiesPerPerson,
    });
  }

  return staffing;
}
