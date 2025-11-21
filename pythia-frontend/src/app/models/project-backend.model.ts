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
 */
export interface ProjectListResponseBackend {
  projects: ProjectBackend[];
  total: number;
  filters?: {
    status: string;
    industry: string;
    company: string;
  };
  pagination?: {
    page: number;
    size: number;
    total: number;
    totalPages: number;
  };
  analytics?: any; // Analytics structure from backend
}
