/**
 * Project Data Mappers
 *
 * Transform backend DTOs into frontend models.
 *
 * Design Philosophy:
 * - Adapter Pattern: Isolate backend structure from frontend concerns
 * - Single Responsibility: Each mapper has one job
 * - Type Safety: Full TypeScript type checking
 * - Defensive Programming: Handle missing/null data gracefully
 *
 * Benefits:
 * - Resilient to backend changes
 * - Easy to test
 * - Centralized transformation logic (DRY)
 * - Clean separation of concerns (SOLID)
 */

import {
  Project,
  ProjectTeamSummary,
  ProjectTimeline,
  ProjectTechnology,
  ProjectTag,
  ProjectComplexity,
  ProjectListAnalytics,
  ProjectListResponse,
  ProjectDetail,
  ProjectTeamDetailed,
  ProjectTeamMember,
  ProjectAnalytics,
  ProjectMilestone,
  ProjectRequiredSkill
} from '../../../models/project.model';

import { PaginationMetadata } from '../../../models/pagination.model';

import {
  ProjectBackend,
  ProjectListResponseBackend,
  ProjectTechnologyBackend,
  ProjectTagBackend,
  ProjectTeamMemberBackend,
  ProjectMilestoneBackend,
  ProjectSkillBackend
} from '../../../models/project-backend.model';

import {
  parseComplexity,
  parseMilestoneStatus,
  parseSkillImportance,
  parseSkillProficiency,
  parseTechnologyCategory
} from './type-guards';

/**
 * Calculate project duration in human-readable format
 */
function calculateDuration(startDate: string, endDate: string | null): string {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 30) {
    return `${diffDays} days`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''}`;
  } else {
    const years = Math.floor(diffDays / 365);
    const remainingMonths = Math.floor((diffDays % 365) / 30);
    return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
  }
}

/**
 * Calculate duration in days
 */
function calculateDurationDays(startDate: string, endDate: string | null): number {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Calculate project progress percentage
 */
function calculateProgress(completedMilestones: number, totalMilestones: number): number {
  if (totalMilestones === 0) return 0;
  return Math.round((completedMilestones / totalMilestones) * 100);
}

/**
 * Find next upcoming milestone
 */
function findNextMilestone(milestones: ProjectMilestoneBackend[]): ProjectTimeline['nextMilestone'] | undefined {
  const now = new Date();
  const upcomingMilestones = milestones
    .filter(m => m.status !== 'COMPLETED' && m.status !== 'CANCELLED')
    .map(m => ({
      name: m.name,
      dueDate: m.dueDate,
      daysRemaining: Math.ceil((new Date(m.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    }))
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  return upcomingMilestones.length > 0 ? upcomingMilestones[0] : undefined;
}

/**
 * Map backend complexity string to frontend enum
 *
 * @deprecated Use parseComplexity from type-guards instead
 * Kept for backward compatibility during migration
 */
function mapComplexity(complexity: string): ProjectComplexity {
  return parseComplexity(complexity);
}

/**
 * Map backend technology to frontend technology model
 */
export function mapTechnology(tech: ProjectTechnologyBackend): ProjectTechnology {
  return {
    id: tech.technologyId,
    name: tech.technologyName,
    category: parseTechnologyCategory(tech.category),
    isPrimary: tech.isPrimary,
    version: tech.version || undefined,
    usageNotes: tech.usageNotes || undefined
  };
}

/**
 * Map backend tag to frontend tag model
 */
export function mapTag(tag: ProjectTagBackend): ProjectTag {
  return {
    id: tag.id,
    name: tag.name,
    category: tag.category,
    color: tag.color
  };
}

/**
 * Map backend team members to frontend team summary
 */
export function mapTeamSummary(
  teamMembers: ProjectTeamMemberBackend[],
  teamSize: number,
  activeTeamSize: number
): ProjectTeamSummary {
  const leads = teamMembers
    .filter(m => m.isLead)
    .map(m => ({
      id: m.employeeId,
      name: m.employeeName,
      role: m.role,
      avatar: m.employeeAvatar
    }));

  const architects = teamMembers
    .filter(m => m.isArchitect && !m.isLead) // Avoid duplicates if someone is both lead and architect
    .map(m => ({
      id: m.employeeId,
      name: m.employeeName,
      role: m.role,
      avatar: m.employeeAvatar
    }));

  return {
    totalMembers: teamSize,
    activeMembers: activeTeamSize,
    leads,
    architects
  };
}

/**
 * Map backend milestone data to frontend timeline summary
 */
export function mapTimeline(
  startDate: string,
  endDate: string | null,
  completedMilestones: number,
  totalMilestones: number,
  milestones: ProjectMilestoneBackend[]
): ProjectTimeline {
  return {
    duration: calculateDuration(startDate, endDate),
    durationDays: calculateDurationDays(startDate, endDate),
    progress: calculateProgress(completedMilestones, totalMilestones),
    milestonesTotal: totalMilestones,
    milestonesCompleted: completedMilestones,
    nextMilestone: findNextMilestone(milestones)
  };
}

/**
 * Map backend project to frontend project model
 *
 * This is the main mapper that transforms the backend DTO
 * into the frontend model expected by components.
 */
export function mapProject(backend: ProjectBackend): Project {
  return {
    id: backend.id,
    name: backend.name,
    code: backend.code,
    description: backend.description,
    company: backend.company,
    industry: backend.industry,
    projectType: backend.projectType,
    budgetRange: backend.budgetRange,
    teamSizeRange: backend.teamSizeRange,
    startDate: backend.startDate,
    endDate: backend.endDate,
    status: backend.status,
    priority: backend.priority,
    complexity: mapComplexity(backend.complexity),
    successRating: backend.successRating ?? 0,
    clientSatisfaction: backend.clientSatisfaction ?? 0,
    websiteUrl: backend.websiteUrl,
    repositoryUrl: backend.repositoryUrl,
    documentationUrl: backend.documentationUrl,
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,

    // Transform flattened backend data into nested frontend structures
    team: mapTeamSummary(
      backend.teamMembers || [],
      backend.teamSize || 0,
      backend.activeTeamSize || 0
    ),

    timeline: mapTimeline(
      backend.startDate,
      backend.endDate,
      backend.completedMilestones || 0,
      backend.totalMilestones || 0,
      backend.milestones || []
    ),

    technologies: (backend.technologies || []).map(mapTechnology),
    topSkills: (backend.skills || []).slice(0, 5).map(s => s.skillName),
    tags: (backend.tags || []).map(mapTag)
  };
}

/**
 * Map backend project list response to frontend response
 *
 * UPDATED: 2025-11-22
 * Simplified to pure transformation - no fallbacks, no calculations
 * Assumes backend returns complete, valid pagination object
 * Use validateProjectListResponse() before calling this function
 *
 * @param backend - Validated backend response
 * @returns Frontend project list response
 */
export function mapProjectListResponse(backend: ProjectListResponseBackend): ProjectListResponse {
  return {
    projects: backend.projects.map(mapProject),

    // ✅ Direct mapping - no fallbacks, no calculations
    pagination: {
      page: backend.pagination.page,
      size: backend.pagination.size,
      totalElements: backend.pagination.totalElements,
      totalPages: backend.pagination.totalPages
    },

    analytics: backend.analytics || createEmptyAnalytics()
  };
}

/**
 * Create empty analytics object
 *
 * Used as default when backend doesn't provide analytics
 */
function createEmptyAnalytics(): ProjectListAnalytics {
  return {
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    onHoldProjects: 0,
    cancelledProjects: 0,
    totalEmployeesInvolved: 0,
    averageTeamSize: 0,
    averageProjectDuration: '0 days',
    totalBudget: 0,
    totalSpent: 0,
    averageProgress: 0,
    topTechnologies: [],
    topIndustries: [],
    complexityDistribution: {
      SIMPLE: 0,
      MODERATE: 0,
      COMPLEX: 0,
      ENTERPRISE: 0
    },
    averageSuccessRating: 0,
    averageClientSatisfaction: 0
  };
}

/**
 * Map backend team member to frontend team member model
 */
function mapTeamMember(member: ProjectTeamMemberBackend): ProjectTeamMember {
  return {
    employee: {
      id: member.employeeId,
      fullName: member.employeeName,
      title: member.employeeTitle,
      email: member.employeeEmail,
      avatar: member.employeeAvatar,
      city: undefined,
      country: undefined,
      availability: 'AVAILABLE' // Default, could be enhanced later
    },
    assignment: {
      role: member.role,
      roleId: member.roleId,
      startDate: member.startDate,
      endDate: member.endDate,
      allocation: member.allocation,
      isLead: member.isLead,
      isArchitect: member.isArchitect,
      responsibilities: member.responsibilities,
      achievements: member.achievements,
      duration: calculateDuration(member.startDate, member.endDate)
    }
  };
}

/**
 * Map backend team members to frontend team detailed model
 */
function mapTeamDetailed(
  teamMembers: ProjectTeamMemberBackend[],
  teamSize: number,
  activeTeamSize: number
): ProjectTeamDetailed {
  const members = (teamMembers || []).map(mapTeamMember);
  const formerMembers = teamSize - activeTeamSize;

  return {
    totalMembers: teamSize,
    activeMembers: activeTeamSize,
    formerMembers: formerMembers > 0 ? formerMembers : 0,
    members
  };
}

/**
 * Map backend milestone to frontend milestone model
 */
function mapMilestone(milestone: ProjectMilestoneBackend): ProjectMilestone {
  return {
    id: milestone.id,
    name: milestone.name,
    description: milestone.description,
    dueDate: milestone.dueDate,
    completedDate: milestone.completedDate,
    status: parseMilestoneStatus(milestone.status),
    deliverables: milestone.deliverables
  };
}

/**
 * Map backend skill to frontend required skill model
 */
function mapRequiredSkill(skill: ProjectSkillBackend): ProjectRequiredSkill {
  return {
    id: skill.skillId,
    name: skill.skillName,
    importance: parseSkillImportance(skill.importance),
    minProficiency: parseSkillProficiency(skill.minProficiency)
  };
}

/**
 * Calculate team turnover rate
 * Formula: (former members / total members) * 100
 */
function calculateTeamTurnover(teamSize: number, activeTeamSize: number): number {
  if (teamSize === 0) return 0;
  const formerMembers = teamSize - activeTeamSize;
  return formerMembers / teamSize;
}

/**
 * Calculate average team allocation
 */
function calculateAverageAllocation(teamMembers: ProjectTeamMemberBackend[]): number {
  if (!teamMembers || teamMembers.length === 0) return 0;
  const totalAllocation = teamMembers.reduce((sum, member) => sum + member.allocation, 0);
  return Math.round(totalAllocation / teamMembers.length);
}

/**
 * Calculate milestones on-time percentage
 * Formula: (completed on time / total completed) or (upcoming not delayed / total upcoming)
 */
function calculateMilestonesOnTime(milestones: ProjectMilestoneBackend[]): number {
  if (!milestones || milestones.length === 0) return 1; // 100% if no milestones

  const completed = milestones.filter(m => m.status === 'COMPLETED');
  const delayed = milestones.filter(m => m.status === 'DELAYED');

  // If we have completed milestones, calculate based on those
  if (completed.length > 0) {
    const onTime = completed.length - delayed.length;
    return Math.max(0, onTime / completed.length);
  }

  // Otherwise, if there are any delayed milestones, it's 0%
  if (delayed.length > 0) {
    return 0;
  }

  // All milestones are on track
  return 1;
}

/**
 * Map backend analytics data to frontend analytics model
 * This function calculates analytics from available backend data
 */
function mapAnalytics(backend: ProjectBackend): ProjectAnalytics {
  const durationDays = calculateDurationDays(backend.startDate, backend.endDate);
  const progress = calculateProgress(backend.completedMilestones || 0, backend.totalMilestones || 0);
  const teamTurnover = calculateTeamTurnover(backend.teamSize || 0, backend.activeTeamSize || 0);
  const averageAllocation = calculateAverageAllocation(backend.teamMembers || []);
  const milestonesOnTime = calculateMilestonesOnTime(backend.milestones || []);

  return {
    duration: calculateDuration(backend.startDate, backend.endDate),
    durationDays,
    progress,
    teamTurnover,
    averageAllocation,
    technologyCount: backend.technologies?.length || 0,
    milestonesOnTime
  };
}

/**
 * Map backend project detail response to frontend project detail model
 *
 * This mapper transforms the backend DTO structure (with flat arrays)
 * into the nested frontend structure expected by detail components.
 */
export function mapProjectDetail(backend: ProjectBackend): ProjectDetail {
  return {
    id: backend.id,
    name: backend.name,
    code: backend.code,
    description: backend.description,
    company: backend.company,
    industry: backend.industry,
    projectType: backend.projectType,
    budgetRange: backend.budgetRange,
    teamSizeRange: backend.teamSizeRange,
    startDate: backend.startDate,
    endDate: backend.endDate,
    status: backend.status,
    priority: backend.priority,
    complexity: mapComplexity(backend.complexity),
    successRating: backend.successRating ?? 0,
    clientSatisfaction: backend.clientSatisfaction ?? 0,
    websiteUrl: backend.websiteUrl,
    repositoryUrl: backend.repositoryUrl,
    documentationUrl: backend.documentationUrl,
    createdAt: backend.createdAt,
    updatedAt: backend.updatedAt,

    // Transform flattened backend data into nested frontend structures
    team: mapTeamDetailed(
      backend.teamMembers || [],
      backend.teamSize || 0,
      backend.activeTeamSize || 0
    ),

    technologies: (backend.technologies || []).map(mapTechnology),
    requiredSkills: (backend.skills || []).map(mapRequiredSkill),
    milestones: (backend.milestones || []).map(mapMilestone),
    tags: (backend.tags || []).map(mapTag),

    // Calculate analytics from available data
    analytics: mapAnalytics(backend)
  };
}
