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
  PaginationMetadata,
  ProjectListAnalytics,
  ProjectListResponse
} from '../../../models/project.model';

import {
  ProjectBackend,
  ProjectListResponseBackend,
  ProjectTechnologyBackend,
  ProjectTagBackend,
  ProjectTeamMemberBackend,
  ProjectMilestoneBackend
} from '../../../models/project-backend.model';

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
 */
function mapComplexity(complexity: string): ProjectComplexity {
  const complexityMap: Record<string, ProjectComplexity> = {
    'LOW': 'SIMPLE',
    'MEDIUM': 'MODERATE',
    'HIGH': 'COMPLEX',
    'VERY_HIGH': 'ENTERPRISE',
    'SIMPLE': 'SIMPLE',
    'MODERATE': 'MODERATE',
    'COMPLEX': 'COMPLEX',
    'ENTERPRISE': 'ENTERPRISE'
  };

  return complexityMap[complexity] || 'MODERATE';
}

/**
 * Map backend technology to frontend technology model
 */
export function mapTechnology(tech: ProjectTechnologyBackend): ProjectTechnology {
  return {
    id: tech.technologyId,
    name: tech.technologyName,
    category: tech.category as any || 'Other',
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
 */
export function mapProjectListResponse(backend: ProjectListResponseBackend): ProjectListResponse {
  return {
    projects: backend.projects.map(mapProject),
    pagination: {
      page: backend.pagination?.page || 1,
      size: backend.pagination?.size || 20,
      total: backend.total,
      totalPages: backend.pagination?.totalPages || Math.ceil(backend.total / (backend.pagination?.size || 20))
    },
    analytics: backend.analytics || {
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
    }
  };
}
