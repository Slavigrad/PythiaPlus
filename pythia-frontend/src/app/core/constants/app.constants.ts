/**
 * Application Constants - Pythia+
 * Centralized configuration for the entire application
 *
 * Purpose: Single source of truth for all hardcoded values
 * Benefits: DRY principle, maintainability, self-documenting code
 */

// ========================================
// Search Configuration
// ========================================

/** Default number of search results to return */
export const DEFAULT_TOP_K = 10;

/** Default minimum match score threshold (0.0-1.0) */
export const DEFAULT_MIN_SCORE = 0.7;

/** Minimum query length required for search */
export const MIN_QUERY_LENGTH = 3;

/** Debounce delay for search input (milliseconds) */
export const SEARCH_DEBOUNCE_MS = 500;

/** Available topK options for user selection */
export const TOP_K_OPTIONS = [
  { value: 5, label: 'Top 5 matches' },
  { value: 10, label: 'Top 10 matches' },
  { value: 20, label: 'Top 20 matches' },
  { value: 50, label: 'All matches (50)' }
] as const;

// ========================================
// Match Score Configuration
// ========================================

/** Match score threshold for "excellent" rating (0.0-1.0) */
export const SCORE_THRESHOLD_EXCELLENT = 0.85;

/** Match score threshold for "good" rating (0.0-1.0) */
export const SCORE_THRESHOLD_GOOD = 0.70;

/** Match percentage threshold for green color (90%+) */
export const MATCH_PERCENTAGE_HIGH = 90;

/** Match percentage threshold for orange color (70-89%) */
export const MATCH_PERCENTAGE_MEDIUM = 70;

/** Match score zone labels */
export const SCORE_LABELS = {
  EXCELLENT: 'Only excellent',
  GOOD: 'Good matches',
  WIDE: 'Cast a wide net'
} as const;

// ========================================
// Color Palette (UI)
// ========================================

/**
 * Avatar color palette
 * Rotates based on candidate ID for consistent, colorful avatars
 */
export const AVATAR_COLORS = [
  '#FF6B35', // Orange
  '#4ECDC4', // Teal
  '#556FB5', // Blue
  '#9B59B6'  // Purple
] as const;

/**
 * Match score color scheme
 * Visual feedback for match quality
 */
export const MATCH_COLORS = {
  /** Green for 90%+ matches (excellent) */
  HIGH: '#4caf50',
  /** Orange for 70-89% matches (good) */
  MEDIUM: '#ff9800',
  /** Gray for <70% matches (lower quality) */
  LOW: '#757575'
} as const;

// ========================================
// Error Messages
// ========================================

export const ERROR_MESSAGES = {
  SEARCH_FAILED: 'Failed to search candidates. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_QUERY: 'Please enter at least 3 characters to search.'
} as const;

// ========================================
// Example Queries (UI)
// ========================================

/**
 * Pre-defined example queries to help users understand search capabilities
 */
export const EXAMPLE_QUERIES = [
  'Find React developers in Zurich',
  'Senior Python developers with 5+ years experience',
  'Show me available machine learning engineers'
] as const;

// ========================================
// Type Exports for Type Safety
// ========================================

/** Type for topK option objects */
export type TopKOption = typeof TOP_K_OPTIONS[number];

/** Type for avatar colors */
export type AvatarColor = typeof AVATAR_COLORS[number];

/** Type for score labels */
export type ScoreLabel = typeof SCORE_LABELS[keyof typeof SCORE_LABELS];

/** Type for example queries */
export type ExampleQuery = typeof EXAMPLE_QUERIES[number];
