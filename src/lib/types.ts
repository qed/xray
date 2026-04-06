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
  definition?: string;
}

export interface MilestoneStatus {
  milestone: number;
  updated?: string;
  notes?: string;
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
  id: string;
  departmentSlug: string;
  departmentName: string;
  rank: number;
  name: string;
  complexity: string;
  effort: string;
  estimatedTimeSavings: string;
  parsedTimeSavings: ParsedTimeSavings;
  milestoneStage: number;
  milestoneName: string;
  score: number;                   // computed from time savings and effort for ranking
  whatToAutomate: string;
  currentState: string;
  whyItMatters: string;
  dependencies: string[];
  suggestedApproach: string;
  successCriteria: string;
  completeness: Completeness;
}

export type ParsedTimeSavings =
  | { valid: true; min: number; max: number; midpoint: number; display: string }
  | { valid: false; rawText: string; issue: string };

export interface Completeness {
  score: number;   // 0-9
  total: number;   // always 9
  missing: string[]; // DB column names that are empty
}

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

export interface DepartmentDependency {
  id: string;
  sourceDepartment: string;
  sourceDepartmentName: string;
  targetDepartment: string;
  targetDepartmentName: string;
  description: string;
  priorityNames: string[];
}

export interface StrategicBlocker {
  id: string;
  name: string;
  affectedPriorityCount: number;
  departments: string[];
  priorities: { departmentName: string; priorityName: string }[];
}

export interface ToolOverlap {
  tool: string;
  departments: string[];
  departmentSlugs: string[];
  relatedPriorities: { departmentName: string; priorityName: string }[];
}

// --- Multi-tenant types ---

export interface Organization {
  id: string;
  name: string;
  slug: string;
  team_names: string[];
  created_at: string;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  joined_at: string;
}

export interface Invite {
  id: string;
  org_id: string;
  code: string;
  email: string | null;
  role: 'owner' | 'admin' | 'member';
  max_uses: number | null;
  use_count: number;
  expires_at: string | null;
  created_by: string;
  created_at: string;
}

export interface DbDepartment {
  id: string;
  org_id: string;
  slug: string;
  name: string;
  mission: string;
  scope: string;
  tools: string[];
  single_points_of_failure: string[];
  pain_points: string[];
  tribal_knowledge_risks: string[];
}

export interface DbTeamMember {
  id: string;
  department_id: string;
  name: string;
  title: string;
  responsibilities: string;
}

export interface DbPriority {
  id: string;
  department_id: string;
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
  status: string;
}

export interface DbMilestone {
  id: string;
  priority_id: string;
  stage: number;
  updated_at: string;
  notes: string;
}

export interface ProjectBrief {
  id: string;
  org_id: string;
  department_id: string;
  title: string;
  summary: string;
  profile_snapshot: {
    name: string;
    mission: string;
    scope: string;
    tools: string[];
    singlePointsOfFailure: string[];
    painPoints: string[];
    tribalKnowledgeRisks: string[];
  };
  priorities_snapshot: {
    rank: number;
    name: string;
    whatToAutomate: string;
    estimatedTimeSavings: string;
    effort: string;
    complexity: string;
  }[];
  team_count: number;
  total_potential_hours_per_week: number;
  created_at: string;
  created_by: string | null;
}
