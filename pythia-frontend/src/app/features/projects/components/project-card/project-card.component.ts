import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../../models';

/**
 * Enhanced Project Card Component
 *
 * A visually rich card displaying project information with:
 * - Status indicators and priority badges
 * - Team member avatars
 * - Technology stack icons
 * - Progress visualization
 * - Quick action buttons
 * - Smooth hover effects
 *
 * Variants:
 * - compact: List view card (default)
 * - detailed: Modal/drawer preview
 * - mini: Constellation hover tooltip
 */
@Component({
  selector: 'app-project-card',
  imports: [CommonModule],
  templateUrl: './project-card.component.html',
  styleUrl: './project-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.variant-compact]': 'variant() === "compact"',
    '[class.variant-detailed]': 'variant() === "detailed"',
    '[class.variant-mini]': 'variant() === "mini"'
  }
})
export class ProjectCardComponent {
  // ============================================================================
  // INPUTS
  // ============================================================================

  /** Project data to display */
  readonly project = input.required<Project>();

  /** Card display variant */
  readonly variant = input<'compact' | 'detailed' | 'mini'>('compact');

  /** Show quick action buttons */
  readonly showActions = input(true);

  // ============================================================================
  // OUTPUTS
  // ============================================================================

  /** Emitted when card is clicked */
  readonly cardClick = output<Project>();

  /** Emitted when edit action is clicked */
  readonly edit = output<Project>();

  /** Emitted when delete action is clicked */
  readonly delete = output<Project>();

  /** Emitted when view details is clicked */
  readonly viewDetails = output<Project>();

  // ============================================================================
  // COMPUTED PROPERTIES
  // ============================================================================

  /** Get status badge color class */
  protected readonly statusClass = computed(() => {
    const status = this.project().status;
    return `status-${status.toLowerCase().replace('_', '-')}`;
  });

  /** Get priority badge color class */
  protected readonly priorityClass = computed(() => {
    const priority = this.project().priority;
    return `priority-${priority.toLowerCase()}`;
  });

  /** Get complexity indicator class */
  protected readonly complexityClass = computed(() => {
    const complexity = this.project().complexity;
    return `complexity-${complexity.toLowerCase()}`;
  });

  /** Get progress percentage for visualization */
  protected readonly progress = computed(() => {
    return this.project().timeline.progress;
  });

  /** Get progress color based on percentage */
  protected readonly progressColor = computed(() => {
    const progress = this.progress();
    if (progress >= 75) return 'success';
    if (progress >= 50) return 'warning';
    if (progress >= 25) return 'info';
    return 'danger';
  });

  /** Get visible technologies (max 4) */
  protected readonly visibleTechnologies = computed(() => {
    return this.project().technologies.slice(0, 4);
  });

  /** Get remaining technology count */
  protected readonly remainingTechCount = computed(() => {
    const total = this.project().technologies.length;
    return total > 4 ? total - 4 : 0;
  });

  /** Get team member avatars (max 4) */
  protected readonly teamAvatars = computed(() => {
    const leads = this.project().team.leads;
    const architects = this.project().team.architects;
    return [...leads, ...architects].slice(0, 4);
  });

  /** Get remaining team member count */
  protected readonly remainingTeamCount = computed(() => {
    const total = this.project().team.totalMembers;
    const visible = this.teamAvatars().length;
    return Math.max(0, total - visible);
  });

  /** Check if project has next milestone */
  protected readonly hasNextMilestone = computed(() => {
    return !!this.project().timeline.nextMilestone;
  });

  /** Get days remaining text */
  protected readonly daysRemainingText = computed(() => {
    const milestone = this.project().timeline.nextMilestone;
    if (!milestone) return '';

    const days = milestone.daysRemaining;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    if (days < 0) return `${Math.abs(days)} days overdue`;
    return `${days} days remaining`;
  });

  /** Get urgency class for next milestone */
  protected readonly milestoneUrgencyClass = computed(() => {
    const milestone = this.project().timeline.nextMilestone;
    if (!milestone) return '';

    const days = milestone.daysRemaining;
    if (days < 0) return 'overdue';
    if (days <= 7) return 'urgent';
    if (days <= 14) return 'soon';
    return 'normal';
  });

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handle card click
   */
  protected handleCardClick(): void {
    this.cardClick.emit(this.project());
  }

  /**
   * Handle edit button click
   */
  protected handleEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.project());
  }

  /**
   * Handle delete button click
   */
  protected handleDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.project());
  }

  /**
   * Handle view details button click
   */
  protected handleViewDetails(event: Event): void {
    event.stopPropagation();
    this.viewDetails.emit(this.project());
  }

  /**
   * Get avatar URL or generate initials fallback
   */
  protected getAvatarDisplay(member: { name: string; avatar?: string }): { type: 'image' | 'initials'; value: string } {
    if (member.avatar) {
      return { type: 'image', value: member.avatar };
    }

    const initials = member.name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

    return { type: 'initials', value: initials };
  }

  /**
   * Get technology category icon
   */
  protected getTechIcon(category: string): string {
    const icons: Record<string, string> = {
      'Frontend': 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
      'Backend': 'M20 13H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1v-6c0-.55-.45-1-1-1zM7 19c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM20 3H4c-.55 0-1 .45-1 1v6c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1zM7 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z',
      'Database': 'M12 3c-4.97 0-9 1.34-9 3v12c0 1.66 4.03 3 9 3s9-1.34 9-3V6c0-1.66-4.03-3-9-3zm0 14c-3.87 0-7-1.12-7-2.5V11c1.88 1.02 4.67 1.5 7 1.5s5.12-.48 7-1.5v3.5c0 1.38-3.13 2.5-7 2.5z',
      'Cloud': 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z',
      'DevOps': 'M22 9V7h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2v-2h-2V9h2zm-4 10H4V5h14v14zM6 13h5v4H6zm6-6h4v3h-4zM6 7h5v5H6zm6 4h4v6h-4z',
      'Mobile': 'M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z',
      'Language': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
      'Framework': 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z',
      'Other': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'
    };

    return icons[category] || icons['Other'];
  }
}
