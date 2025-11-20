import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetail, ProjectMilestone, ProjectTeamMember } from '../../models/project.model';

/**
 * Project Detail Panel Component
 *
 * Sliding drawer that displays comprehensive project information.
 *
 * Features:
 * - 800px wide drawer sliding from right
 * - Full team composition with roles and allocations
 * - Visual milestone timeline
 * - Technology stack breakdown with categories
 * - Analytics stat cards (budget, timeline, team size)
 * - External links with previews
 * - Edit/delete action buttons
 * - Backdrop overlay with click-to-close
 * - Smooth slide animation
 * - Escape key to close
 * - Fully accessible (ARIA labels, focus trap)
 *
 * Design:
 * - Premium cosmic dark aesthetic
 * - Pythia red accents (#DC2626)
 * - Smooth animations and transitions
 * - Responsive layout
 * - WCAG AA compliant
 */
@Component({
  selector: 'app-project-detail-panel',
  imports: [CommonModule],
  templateUrl: './project-detail-panel.component.html',
  styleUrl: './project-detail-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.open]': 'isOpen()',
    '[attr.role]': '"dialog"',
    '[attr.aria-modal]': 'isOpen()',
    '[attr.aria-labelledby]': '"panel-title"',
    '(keydown.escape)': 'close()',
  }
})
export class ProjectDetailPanelComponent {
  // ============================================================================
  // INPUTS
  // ============================================================================

  /** Project details to display */
  readonly project = input<ProjectDetail | null>(null);

  /** Panel open state */
  readonly isOpen = input(false);

  // ============================================================================
  // OUTPUTS
  // ============================================================================

  /** Emitted when panel should close */
  readonly closePanel = output<void>();

  /** Emitted when edit button is clicked */
  readonly edit = output<ProjectDetail>();

  /** Emitted when delete button is clicked */
  readonly delete = output<ProjectDetail>();

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /**
   * Calculate project health score based on multiple factors
   */
  protected readonly healthScore = computed(() => {
    const proj = this.project();
    if (!proj) return 0;

    let score = 0;
    const weights = {
      progress: 0.3,
      budget: 0.25,
      timeline: 0.25,
      satisfaction: 0.2
    };

    // Progress contribution
    score += (proj.analytics.progress.overall / 100) * weights.progress * 100;

    // Budget contribution (penalize over-budget)
    const budgetRatio = proj.analytics.budget.spent / proj.analytics.budget.allocated;
    const budgetScore = budgetRatio <= 1 ? 100 : Math.max(0, 100 - (budgetRatio - 1) * 100);
    score += budgetScore * weights.budget;

    // Timeline contribution
    const timelineScore = proj.analytics.timeline.onTrack ? 100 : 50;
    score += timelineScore * weights.timeline;

    // Satisfaction contribution
    score += (proj.analytics.satisfaction.overall / 5) * weights.satisfaction * 100;

    return Math.round(score);
  });

  /**
   * Health score color class
   */
  protected readonly healthScoreClass = computed(() => {
    const score = this.healthScore();
    if (score >= 80) return 'health-excellent';
    if (score >= 60) return 'health-good';
    if (score >= 40) return 'health-fair';
    return 'health-poor';
  });

  /**
   * Budget status class
   */
  protected readonly budgetStatusClass = computed(() => {
    const proj = this.project();
    if (!proj) return '';

    const spent = proj.analytics.budget.spent;
    const allocated = proj.analytics.budget.allocated;
    const ratio = spent / allocated;

    if (ratio <= 0.7) return 'budget-healthy';
    if (ratio <= 0.9) return 'budget-warning';
    return 'budget-critical';
  });

  /**
   * Active milestones (not completed)
   */
  protected readonly activeMilestones = computed(() => {
    const proj = this.project();
    if (!proj) return [];
    return proj.milestones.filter(m => m.status !== 'COMPLETED');
  });

  /**
   * Completed milestones
   */
  protected readonly completedMilestones = computed(() => {
    const proj = this.project();
    if (!proj) return [];
    return proj.milestones.filter(m => m.status === 'COMPLETED');
  });

  /**
   * Technologies grouped by category
   */
  protected readonly technologiesByCategory = computed(() => {
    const proj = this.project();
    if (!proj) return new Map<string, typeof proj.technologies>();

    const grouped = new Map<string, typeof proj.technologies>();
    proj.technologies.forEach(tech => {
      const category = tech.category || 'Other';
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category)!.push(tech);
    });

    return grouped;
  });

  /**
   * Team members grouped by role
   */
  protected readonly teamByRole = computed(() => {
    const proj = this.project();
    if (!proj) return new Map<string, ProjectTeamMember[]>();

    const grouped = new Map<string, ProjectTeamMember[]>();
    proj.team.members.forEach(member => {
      if (!grouped.has(member.role)) {
        grouped.set(member.role, []);
      }
      grouped.get(member.role)!.push(member);
    });

    return grouped;
  });

  /**
   * Format currency
   */
  protected formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /**
   * Format date
   */
  protected formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  /**
   * Calculate days until milestone
   */
  protected daysUntil(date: string): number {
    const target = new Date(date);
    const today = new Date();
    const diff = target.getTime() - today.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get milestone urgency class
   */
  protected getMilestoneUrgency(milestone: ProjectMilestone): string {
    if (milestone.status === 'COMPLETED') return 'milestone-completed';
    if (milestone.status === 'BLOCKED') return 'milestone-blocked';

    const days = this.daysUntil(milestone.targetDate);
    if (days < 0) return 'milestone-overdue';
    if (days <= 7) return 'milestone-urgent';
    if (days <= 30) return 'milestone-soon';
    return 'milestone-normal';
  }

  /**
   * Get role icon
   */
  protected getRoleIcon(role: string): string {
    const icons: Record<string, string> = {
      'Tech Lead': '👨‍💻',
      'Backend Developer': '⚙️',
      'Frontend Developer': '🎨',
      'UI/UX Designer': '🎭',
      'QA Engineer': '🔍',
      'DevOps Engineer': '🚀',
      'Product Manager': '📊',
      'Business Analyst': '📈',
      'Scrum Master': '🎯'
    };
    return icons[role] || '👤';
  }

  /**
   * Get technology category icon
   */
  protected getCategoryIcon(category: string): string {
    const icons: Record<string, string> = {
      'Frontend': '🎨',
      'Backend': '⚙️',
      'Database': '🗄️',
      'DevOps': '🚀',
      'Cloud': '☁️',
      'Mobile': '📱',
      'Testing': '🔍',
      'Other': '🔧'
    };
    return icons[category] || '🔧';
  }

  // ============================================================================
  // PUBLIC METHODS
  // ============================================================================

  /**
   * Close the panel
   */
  protected close(): void {
    this.closePanel.emit();
  }

  /**
   * Handle backdrop click
   */
  protected onBackdropClick(): void {
    this.close();
  }

  /**
   * Prevent panel click from closing
   */
  protected onPanelClick(event: Event): void {
    event.stopPropagation();
  }

  /**
   * Handle edit action
   */
  protected handleEdit(): void {
    const proj = this.project();
    if (proj) {
      this.edit.emit(proj);
    }
  }

  /**
   * Handle delete action
   */
  protected handleDelete(): void {
    const proj = this.project();
    if (proj) {
      this.delete.emit(proj);
    }
  }

  /**
   * Get entries from Map for template iteration
   */
  protected getMapEntries<K, V>(map: Map<K, V>): Array<[K, V]> {
    return Array.from(map.entries());
  }
}
