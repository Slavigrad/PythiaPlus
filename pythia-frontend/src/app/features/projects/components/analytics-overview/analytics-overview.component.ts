import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListAnalytics } from '../../../../models';

/**
 * Analytics Overview Component
 *
 * Displays key performance indicators (KPIs) in a grid of cards.
 *
 * Features:
 * - 8 KPI metric cards
 * - Animated count-up numbers
 * - Trend indicators
 * - Color-coded statuses
 * - Responsive grid layout
 *
 * Design:
 * - 2x4 grid on desktop
 * - 2x4 grid on tablet
 * - 1 column on mobile
 * - Cosmic dark aesthetic
 * - Pythia red accents
 */
@Component({
  selector: 'app-analytics-overview',
  imports: [CommonModule],
  templateUrl: './analytics-overview.component.html',
  styleUrl: './analytics-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsOverviewComponent {
  // ============================================================================
  // INPUTS
  // ============================================================================

  /** Analytics data from service */
  readonly analytics = input.required<ProjectListAnalytics | null>();

  /** Total project count */
  readonly totalProjects = input(0);

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Active projects count
   */
  protected readonly activeProjects = computed(() => {
    return this.analytics()?.activeProjects ?? 0;
  });

  /**
   * Completed projects count
   */
  protected readonly completedProjects = computed(() => {
    return this.analytics()?.completedProjects ?? 0;
  });

  /**
   * Success rate (completed / total)
   */
  protected readonly successRate = computed(() => {
    const total = this.totalProjects();
    const completed = this.completedProjects();
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  });

  /**
   * Total budget allocated across all projects
   */
  protected readonly totalBudget = computed(() => {
    return this.analytics()?.totalBudget ?? 0;
  });

  /**
   * Total budget spent
   */
  protected readonly totalSpent = computed(() => {
    return this.analytics()?.totalSpent ?? 0;
  });

  /**
   * Budget utilization percentage
   */
  protected readonly budgetUtilization = computed(() => {
    const allocated = this.totalBudget();
    const spent = this.totalSpent();
    return allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
  });

  /**
   * Projects on track (using active projects as proxy)
   */
  protected readonly onTrackProjects = computed(() => {
    return this.analytics()?.activeProjects ?? 0;
  });

  /**
   * Timeline performance (on-track / total active)
   */
  protected readonly timelinePerformance = computed(() => {
    const active = this.activeProjects();
    const onTrack = this.onTrackProjects();
    return active > 0 ? Math.round((onTrack / active) * 100) : 0;
  });

  /**
   * Total team members (from totalEmployeesInvolved)
   */
  protected readonly totalTeamMembers = computed(() => {
    return this.analytics()?.totalEmployeesInvolved ?? 0;
  });

  /**
   * Unique technologies count (from topTechnologies)
   */
  protected readonly uniqueTechnologies = computed(() => {
    return this.analytics()?.topTechnologies.length ?? 0;
  });

  /**
   * Average project progress
   */
  protected readonly averageProgress = computed(() => {
    return this.analytics()?.averageProgress ?? 0;
  });

  /**
   * Get budget status class
   */
  protected readonly budgetStatus = computed(() => {
    const utilization = this.budgetUtilization();
    if (utilization > 90) return 'critical';
    if (utilization > 75) return 'warning';
    return 'healthy';
  });

  /**
   * Get timeline status class
   */
  protected readonly timelineStatus = computed(() => {
    const performance = this.timelinePerformance();
    if (performance >= 80) return 'excellent';
    if (performance >= 60) return 'good';
    return 'needs-attention';
  });

  /**
   * Get progress status class
   */
  protected readonly progressStatus = computed(() => {
    const progress = this.averageProgress();
    if (progress >= 75) return 'excellent';
    if (progress >= 50) return 'good';
    if (progress >= 25) return 'fair';
    return 'poor';
  });

  /**
   * Format currency
   */
  protected formatCurrency(value: number): string {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  }

  /**
   * Format number with K/M suffix
   */
  protected formatNumber(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  }
}
