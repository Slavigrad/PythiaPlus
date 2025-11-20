/**
 * Project Model
 *
 * Core project entity with full details including team, technologies, and analytics
 */

/**
 * Project status enumeration
 */
export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'CANCELLED' | 'PLANNING';

/**
 * Project priority levels
 */
export type ProjectPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Project complexity levels
 */
export type ProjectComplexity = 'SIMPLE' | 'MODERATE' | 'COMPLEX' | 'ENTERPRISE';

/**
 * Milestone status
 */
export type MilestoneStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED' | 'CANCELLED';

/**
 * Skill importance level
 */
export type SkillImportance = 'REQUIRED' | 'PREFERRED' | 'NICE_TO_HAVE';

/**
 * Skill proficiency level
 */
export type SkillProficiency = 'beginner' | 'intermediate' | 'advanced' | 'expert';

/**
 * Team member within a project
 */
export interface ProjectTeamMember {
  employee: {
    id: number;
    fullName: string;
    title: string;
    email: string;
    avatar?: string;
    city?: string;
    country?: string;
    availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  };
  assignment: {
    role: string;
    roleId: number;
    startDate: string;
    endDate: string | null;
    allocation: number; // Percentage 0-100
    isLead: boolean;
    isArchitect: boolean;
    responsibilities?: string;
    achievements?: string;
    duration: string;
  };
}

/**
 * Project team summary (for list view)
 */
export interface ProjectTeamSummary {
  totalMembers: number;
  activeMembers: number;
  leads: Array<{
    id: number;
    name: string;
    role: string;
    avatar?: string;
  }>;
  architects: Array<{
    id: number;
    name: string;
    role: string;
    avatar?: string;
  }>;
}

/**
 * Project team detailed (for detail view)
 */
export interface ProjectTeamDetailed {
  totalMembers: number;
  activeMembers: number;
  formerMembers: number;
  members: ProjectTeamMember[];
}

/**
 * Technology used in project
 */
export interface ProjectTechnology {
  id: number;
  name: string;
  code?: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud' | 'DevOps' | 'Mobile' | 'Language' | 'Framework' | 'Other';
  isPrimary: boolean;
  version?: string;
  usageNotes?: string;
}

/**
 * Required skill for project
 */
export interface ProjectRequiredSkill {
  id: number;
  name: string;
  importance: SkillImportance;
  minProficiency: SkillProficiency;
}

/**
 * Project tag
 */
export interface ProjectTag {
  id: number;
  name: string;
  category?: string;
  color: string;
}

/**
 * Project milestone
 */
export interface ProjectMilestone {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  completedDate: string | null;
  status: MilestoneStatus;
  deliverables: string | null;
}

/**
 * Project timeline summary
 */
export interface ProjectTimeline {
  duration: string;
  durationDays: number;
  progress: number; // Percentage 0-100
  milestonesTotal: number;
  milestonesCompleted: number;
  nextMilestone?: {
    name: string;
    dueDate: string;
    daysRemaining: number;
  };
}

/**
 * Project analytics
 */
export interface ProjectAnalytics {
  duration: string;
  durationDays: number;
  progress: number;
  teamTurnover: number;
  averageAllocation: number;
  technologyCount: number;
  milestonesOnTime: number;
}

/**
 * Project (list view - compact)
 */
export interface Project {
  id: number;
  name: string;
  code: string;
  description: string;
  company: string;
  industry: string;
  projectType: string;
  budgetRange: string;
  teamSizeRange: string;
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  complexity: ProjectComplexity;
  successRating: number;
  clientSatisfaction: number;
  websiteUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  createdAt: string;
  updatedAt: string;
  team: ProjectTeamSummary;
  technologies: ProjectTechnology[];
  topSkills: string[];
  tags: ProjectTag[];
  timeline: ProjectTimeline;
}

/**
 * Project Detail (full view with all nested data)
 */
export interface ProjectDetail {
  id: number;
  name: string;
  code: string;
  description: string;
  company: string;
  industry: string;
  projectType: string;
  budgetRange: string;
  teamSizeRange: string;
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  complexity: ProjectComplexity;
  successRating: number;
  clientSatisfaction: number;
  websiteUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  createdAt: string;
  updatedAt: string;
  team: ProjectTeamDetailed;
  technologies: ProjectTechnology[];
  requiredSkills: ProjectRequiredSkill[];
  milestones: ProjectMilestone[];
  tags: ProjectTag[];
  analytics: ProjectAnalytics;
}

/**
 * Pagination metadata
 */
export interface PaginationMetadata {
  page: number;
  size: number;
  total: number;
  totalPages: number;
}

/**
 * Project list analytics summary
 */
export interface ProjectListAnalytics {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  cancelledProjects: number;
  totalEmployeesInvolved: number;
  averageTeamSize: number;
  averageProjectDuration: string;
  topTechnologies: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  topIndustries: Array<{
    name: string;
    count: number;
    percentage: number;
  }>;
  complexityDistribution: {
    SIMPLE: number;
    MODERATE: number;
    COMPLEX: number;
    ENTERPRISE: number;
  };
  averageSuccessRating: number;
  averageClientSatisfaction: number;
}

/**
 * Project list response
 */
export interface ProjectListResponse {
  projects: Project[];
  pagination: PaginationMetadata;
  analytics: ProjectListAnalytics;
}

/**
 * Project query parameters for filtering and pagination
 */
export interface ProjectQueryParams {
  status?: ProjectStatus[];
  industry?: string[];
  technology?: string[];
  company?: string;
  employee?: number;
  startDateFrom?: string;
  startDateTo?: string;
  complexity?: ProjectComplexity[];
  priority?: ProjectPriority[];
  hasOpenPositions?: boolean;
  search?: string;
  sort?: 'startDate' | 'endDate' | 'name' | 'teamSize' | 'priority';
  order?: 'asc' | 'desc';
  page?: number;
  size?: number;
}

/**
 * Create project request
 */
export interface CreateProjectRequest {
  name: string;
  code: string;
  description: string;
  company: string;
  industry: string;
  projectType: string;
  budgetRange: string;
  teamSizeRange: string;
  startDate: string;
  endDate?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  complexity: ProjectComplexity;
  websiteUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
}

/**
 * Update project request
 */
export interface UpdateProjectRequest {
  name?: string;
  code?: string;
  description?: string;
  company?: string;
  industry?: string;
  projectType?: string;
  budgetRange?: string;
  teamSizeRange?: string;
  startDate?: string;
  endDate?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  complexity?: ProjectComplexity;
  successRating?: number;
  clientSatisfaction?: number;
  websiteUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
}

/**
 * Add employee to project request
 */
export interface AddProjectTeamMemberRequest {
  employeeId: number;
  roleId: number;
  startDate: string;
  endDate?: string;
  allocation: number;
  isLead?: boolean;
  isArchitect?: boolean;
  responsibilities?: string;
}

/**
 * Update project team member request
 */
export interface UpdateProjectTeamMemberRequest {
  roleId?: number;
  startDate?: string;
  endDate?: string;
  allocation?: number;
  isLead?: boolean;
  isArchitect?: boolean;
  responsibilities?: string;
  achievements?: string;
}

/**
 * Add technology to project request
 */
export interface AddProjectTechnologyRequest {
  technologyId: number;
  isPrimary?: boolean;
  version?: string;
  usageNotes?: string;
}
