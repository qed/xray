export interface DepartmentProfile {
  slug: string;                    // e.g. "accounting", "sales-operations"
  name: string;                    // e.g. "Accounting"
  mission: string;
  scope: string;
  teamMembers: TeamMember[];
  tools: string[];
  singlePointsOfFailure: string[];
  painPoints: string[];
  tribalKnowledgeRisks: string[];
}

export interface TeamMember {
  name: string;
  title: string;
  responsibilities: string;
}

export interface AutomationPriority {
  departmentSlug: string;
  rank: number;
  name: string;
  effort: 'Low' | 'Medium' | 'High';
  complexity: 'Low' | 'Medium' | 'Medium-High' | 'High';
  impact: 'Low' | 'Medium' | 'High' | 'Very High' | 'Critical';
  whatToAutomate: string;
  currentState: string;
  whyItMatters: string;
  estimatedTimeSavings: string;
  dependencies: string[];
  suggestedApproach: string;
  successCriteria: string;
  status: string;                  // "Not started", "In Progress", etc.
}

export interface MilestoneConfig {
  id: number;
  name: string;
  definition: string;
}

export interface MilestoneStatus {
  milestone: number;
  updated: string;
  notes: string;
}

export interface Department {
  profile: DepartmentProfile;
  priorities: AutomationPriority[];
  quickWins?: string[];
  thirtyDayTargets?: string[];
  ninetyDayTargets?: string[];
  scalingRisks?: ScalingRisk[];
}

export interface ScalingRisk {
  area: string;
  risk: string;
  mitigation: string;
}

export interface CompanyOverview {
  totalOpportunities: number;
  byMilestoneStage: Record<number, number>;
  totalCompleted: number;
  departments: DepartmentSummary[];
  topWins: RankedOpportunity[];
}

export interface DepartmentSummary {
  slug: string;
  name: string;
  totalPriorities: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  progressPercent: number;
}

export interface RankedOpportunity {
  departmentSlug: string;
  departmentName: string;
  rank: number;
  name: string;
  impact: string;
  complexity: string;
  effort: string;
  estimatedTimeSavings: string;
  parsedTimeSavings: ParsedTimeSavings;
  milestoneStage: number;
  milestoneName: string;
  score: number;                   // computed impact/effort ratio for ranking
  whatToAutomate: string;
  currentState: string;
  whyItMatters: string;
  dependencies: string[];
  suggestedApproach: string;
  successCriteria: string;
}

export type ParsedTimeSavings =
  | { valid: true; min: number; max: number; midpoint: number; display: string }
  | { valid: false; rawText: string; issue: string };

export interface UnfiledPriority {
  departmentSlug: string;
  departmentName: string;
  rank: number;
  name: string;
  rawText: string;
  issue: string;
}

export interface TimeSavingsRollup {
  totalPotentialHoursPerWeek: number;
  realizedHoursPerWeek: number;
  remainingHoursPerWeek: number;
  byDepartment: DepartmentTimeSavings[];
}

export interface DepartmentTimeSavings {
  slug: string;
  name: string;
  potentialHoursPerWeek: number;
  realizedHoursPerWeek: number;
}

export interface ConsolidatedRisk {
  id: string;
  description: string;
  type: 'people' | 'process' | 'tool';
  severity: 'critical' | 'high' | 'medium';
  departmentSlug: string;
  departmentName: string;
  source: 'spof' | 'pain-point' | 'tribal-knowledge' | 'scaling-risk';
}

export interface StaffingOverview {
  slug: string;
  name: string;
  teamSize: number;
  priorityCount: number;
  prioritiesPerPerson: number;
}
