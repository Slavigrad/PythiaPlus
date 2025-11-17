/**
 * Dashboard Data Models
 *
 * TypeScript interfaces for dashboard facets, charts, and summary statistics
 */

/**
 * Facet item from search API
 */
export interface Facet {
  value: string;
  count: number;
}

/**
 * Complete facets response from API
 */
export interface FacetsResponse {
  results: any[]; // Search results (ignored for dashboard)
  totalCount: number;
  facets: {
    availability: Facet[];
    cities: Facet[];
    countries: Facet[];
    skills: Facet[];
    technologies: Facet[];
    certifications: Facet[];
  };
}

/**
 * Chart.js data structure
 */
export interface ChartData {
  labels?: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    borderRadius?: number;
  }[];
}

/**
 * Summary statistics for dashboard cards
 */
export interface SummaryStats {
  totalProfiles: number;
  availableNow: number;
  onNotice: number;
  citiesCovered: number;
}

/**
 * Chart configuration types
 */
export type ChartColorScheme = 'blue' | 'purple' | 'green' | 'amber' | 'red';

export type ChartType = 'doughnut' | 'bar' | 'line' | 'pie';

/**
 * View mode for toggleable charts
 */
export type LocationViewMode = 'cities' | 'countries';
export type SkillViewMode = 'skills' | 'technologies';

/**
 * Availability status constants
 */
export const AVAILABILITY_STATUS = {
  AVAILABLE: 'available',
  NOTICE: 'notice',
  UNAVAILABLE: 'unavailable'
} as const;

export type AvailabilityStatus = typeof AVAILABILITY_STATUS[keyof typeof AVAILABILITY_STATUS];

/**
 * Color mapping for availability statuses
 */
export const AVAILABILITY_COLORS: Record<AvailabilityStatus, string> = {
  available: '#10b981',    // Green
  notice: '#f59e0b',       // Amber
  unavailable: '#ef4444'   // Red
};

/**
 * Color gradients for charts
 */
export const CHART_COLOR_SCHEMES = {
  blue: {
    background: 'rgba(59, 130, 246, 0.8)',
    border: 'rgba(59, 130, 246, 1)'
  },
  purple: {
    background: 'rgba(139, 92, 246, 0.8)',
    border: 'rgba(139, 92, 246, 1)'
  },
  green: {
    background: 'rgba(16, 185, 129, 0.8)',
    border: 'rgba(16, 185, 129, 1)'
  },
  amber: {
    background: 'rgba(245, 158, 11, 0.8)',
    border: 'rgba(245, 158, 11, 1)'
  },
  red: {
    background: 'rgba(239, 68, 68, 0.8)',
    border: 'rgba(239, 68, 68, 1)'
  }
};
