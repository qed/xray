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
