/**
 * Backend Project DTOs
 *
 * These interfaces represent the actual API response structure from the backend.
 * They are transformed into the frontend models using mapper functions.
 *
 * Separation of backend DTOs from frontend models follows SOLID principles
 * and makes the frontend resilient to backend changes.
 */

import { ProjectStatus, ProjectPriority, ProjectComplexity } from './project.model';

/**
 * Technology from backend (simplified structure)
 */
export interface ProjectTechnologyBackend {
  technologyId: number;
  technologyName: string;
  category: string | null;
  isPrimary: boolean;
  version: string | null;
  usageNotes: string | null;
}

/**
 * Skill from backend
 */
export interface ProjectSkillBackend {
  skillId: number;
  skillName: string;
  importance: string;
  minProficiency: string | null;
}

/**
 * Tag from backend
 */
export interface ProjectTagBackend {
  id: number;
  name: string;
  category: string;
  color: string;
}

/**
 * Team member from backend (if exists in detail view)
 */
export interface ProjectTeamMemberBackend {
  employeeId: number;
  employeeName: string;
  employeeTitle: string;
  employeeEmail: string;
  employeeAvatar?: string;
  role: string;
  roleId: number;
  startDate: string;
  endDate: string | null;
  allocation: number;
  isLead: boolean;
  isArchitect: boolean;
  responsibilities?: string;
  achievements?: string;
}

/**
 * Milestone from backend
 */
export interface ProjectMilestoneBackend {
  id: number;
  name: string;
  description: string;
  dueDate: string;
  completedDate: string | null;
  status: string;
  deliverables: string | null;
}

/**
 * Project from backend (list response)
 *
 * This matches the actual API response structure where team and timeline
 * data are flattened rather than nested.
 */
export interface ProjectBackend {
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
  complexity: string;
  successRating: number | null;
  clientSatisfaction: number | null;
  websiteUrl?: string;
  repositoryUrl?: string;
  documentationUrl?: string;
  createdAt: string;
  updatedAt: string;

  // Flattened team data (backend structure)
  teamMembers: ProjectTeamMemberBackend[];
  teamSize: number;
  activeTeamSize: number;

  // Flattened milestone data (backend structure)
  milestones: ProjectMilestoneBackend[];
  completedMilestones: number;
  totalMilestones: number;

  // Technologies, skills, tags
  technologies: ProjectTechnologyBackend[];
  skills?: ProjectSkillBackend[];
  tags: ProjectTagBackend[];
}

/**
 * Project list response from backend
 *
 * UPDATED: 2025-11-22
 * Backend now returns complete pagination object (no more root-level "total")
 * Matches Spring Boot Page<T> structure after backend implementation
 *
 * @see BACKEND-PAGINATION-SPEC.md for full specification
 */
export interface ProjectListResponseBackend {
  /** Array of projects on current page */
  projects: ProjectBackend[];

  /**
   * Pagination metadata
   *
   * REQUIRED: Backend must always return complete pagination object
   * Contains page number, page size, total elements, and total pages
   */
  pagination: {
    /** Current page number (0-indexed from backend) */
    page: number;

    /** Number of items per page */
    size: number;

    /** Total number of items across all pages */
    totalElements: number;

    /** Total number of pages */
    totalPages: number;
  };

  /**
   * Active filters applied to the query
   * Optional - only present if filters were applied
   */
  filters?: {
    status: string;
    industry: string;
    company: string;
  };

  /**
   * Analytics summary for the filtered result set
   * Optional - may not be present in all responses
   */
  analytics?: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    onHoldProjects: number;
    cancelledProjects: number;
    totalEmployeesInvolved: number;
    averageTeamSize: number;
    averageProjectDuration: string;
    totalBudget: number;
    totalSpent: number;
    averageProgress: number;
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
  };
}
