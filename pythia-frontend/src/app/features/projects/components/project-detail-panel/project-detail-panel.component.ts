import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectDetail, ProjectMilestone, ProjectTeamMember, ProjectTechnology } from '../../../../models';

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
      progress: 0.4,
      milestones: 0.3,
      teamStability: 0.3
    };

    // Progress contribution (0-100)
    score += proj.analytics.progress * weights.progress;

    // Milestones contribution (percentage on time)
    const milestonesScore = proj.analytics.milestonesOnTime * 100;
    score += milestonesScore * weights.milestones;

    // Team stability contribution (lower turnover = better)
    const teamScore = Math.max(0, 100 - (proj.analytics.teamTurnover * 10));
    score += teamScore * weights.teamStability;

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
   * Budget status class (based on project progress as proxy)
   */
  protected readonly budgetStatusClass = computed(() => {
    const proj = this.project();
    if (!proj) return '';

    const progress = proj.analytics.progress;

    if (progress >= 70) return 'budget-healthy';
    if (progress >= 40) return 'budget-warning';
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
    return proj.milestones.filter((m: ProjectMilestone) => m.status === 'COMPLETED');
  });

  /**
   * Technologies grouped by category
   */
  protected readonly technologiesByCategory = computed(() => {
    const proj = this.project();
    if (!proj) return new Map<string, ProjectTechnology[]>();

    const grouped = new Map<string, ProjectTechnology[]>();
    proj.technologies.forEach((tech: ProjectTechnology) => {
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
    proj.team.members.forEach((member: ProjectTeamMember) => {
      const role = member.assignment.role;
      if (!grouped.has(role)) {
        grouped.set(role, []);
      }
      grouped.get(role)!.push(member);
    });

    return grouped;
  });

  /**
   * External links computed from URL fields
   */
  protected readonly externalLinks = computed(() => {
    const proj = this.project();
    if (!proj) return [];

    const links: Array<{ url: string; type: string }> = [];

    if (proj.websiteUrl) {
      links.push({ url: proj.websiteUrl, type: 'Website' });
    }
    if (proj.repositoryUrl) {
      links.push({ url: proj.repositoryUrl, type: 'Repository' });
    }
    if (proj.documentationUrl) {
      links.push({ url: proj.documentationUrl, type: 'Documentation' });
    }

    return links;
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
   * Get initials from full name
   */
  protected getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
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
    if (milestone.status === 'CANCELLED') return 'milestone-blocked';
    if (milestone.status === 'DELAYED') return 'milestone-delayed';

    const days = this.daysUntil(milestone.dueDate);
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
