/**
 * Match Score Model (Search Domain)
 *
 * Represents semantic search match score
 * Based on cosine similarity of embeddings (0.0 to 1.0)
 */
export interface MatchScore {
  /** Matched score (0.0 to 1.0) - cosine similarity */
  matched: number;

  /** Total possible score (always 1.0 for normalized scores) */
  total: number;
}

/**
 * Match score thresholds for categorization
 */
export enum MatchScoreCategory {
  EXCELLENT = 'Excellent',  // >= 0.9
  HIGH = 'High',            // >= 0.8
  GOOD = 'Good',            // >= 0.7
  FAIR = 'Fair',            // >= 0.6
  LOW = 'Low'               // < 0.6
}

/**
 * Get match score as percentage (0-100)
 */
export function getMatchScorePercentage(matchScore: MatchScore): number {
  return Math.round(matchScore.matched * 100);
}

/**
 * Get match score as formatted percentage string (e.g., "85%")
 */
export function formatMatchScore(matchScore: MatchScore): string {
  return `${getMatchScorePercentage(matchScore)}%`;
}

/**
 * Categorize match score
 */
export function categorizeMatchScore(matchScore: MatchScore): MatchScoreCategory {
  if (matchScore.matched >= 0.9) return MatchScoreCategory.EXCELLENT;
  if (matchScore.matched >= 0.8) return MatchScoreCategory.HIGH;
  if (matchScore.matched >= 0.7) return MatchScoreCategory.GOOD;
  if (matchScore.matched >= 0.6) return MatchScoreCategory.FAIR;
  return MatchScoreCategory.LOW;
}

/**
 * Get color for match score category (for badges/chips)
 */
export function getMatchScoreColor(matchScore: MatchScore): string {
  const category = categorizeMatchScore(matchScore);
  switch (category) {
    case MatchScoreCategory.EXCELLENT:
      return 'success';
    case MatchScoreCategory.HIGH:
      return 'primary';
    case MatchScoreCategory.GOOD:
      return 'accent';
    case MatchScoreCategory.FAIR:
      return 'warn';
    case MatchScoreCategory.LOW:
      return 'basic';
  }
}

/**
 * Check if match score is high quality (>= threshold)
 */
export function isHighQualityMatch(matchScore: MatchScore, threshold: number = 0.8): boolean {
  return matchScore.matched >= threshold;
}

/**
 * Compare two match scores (for sorting)
 * Returns: negative if a < b, positive if a > b, zero if equal
 */
export function compareMatchScores(a: MatchScore, b: MatchScore): number {
  return b.matched - a.matched;  // Descending order (highest first)
}
