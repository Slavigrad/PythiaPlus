/**
 * Employee Card Component - Pythia+ Visionary Design
 *
 * Features:
 * - Gradient avatar borders with animation
 * - Live status badge with pulse effect
 * - Quick action menu (hover reveal)
 * - Skill proficiency visualization
 * - Department color coding
 * - Experience badges
 * - Smooth micro-interactions
 * - 3D tilt effects (Ultra Premium)
 * - WCAG AA compliant
 */

import { Component, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Employee } from '../../../../models/employee.model';
import { AVAILABILITY_LABELS } from '../../../../core/constants/employee.constants';
import { SkillRadarMiniComponent } from '../skill-radar-mini/skill-radar-mini.component';
import { Tilt3dDirective } from '../../../../shared/directives/tilt-3d.directive';

@Component({
  selector: 'app-employee-card',
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatProgressBarModule,
    SkillRadarMiniComponent,
    Tilt3dDirective
  ],
  templateUrl: './employee-card.component.html',
  styleUrl: './employee-card.component.scss'
})
export class EmployeeCardComponent {
  // Inputs
  readonly employee = input.required<Employee>();
  readonly selectable = input(false);
  readonly selected = input(false);
  readonly enhanced = input(false); // Gallery mode with more details
  readonly enable3dTilt = input(false); // Ultra Premium 3D tilt effect

  // Outputs
  readonly selectToggle = output<number>();
  readonly actionClick = output<{ employeeId: number; action: string }>();

  // Internal State
  protected readonly showActions = signal(false);
  protected readonly showSkillRadar = signal(false);

  // Computed Properties
  protected readonly initials = computed(() => {
    const name = this.employee().fullName;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  protected readonly avatarColor = computed(() => {
    const colors = [
      '#d32f2f', // Pythia red
      '#1976d2', // Blue
      '#388e3c', // Green
      '#f57c00', // Orange
      '#7b1fa2', // Purple
      '#0097a7', // Cyan
    ];
    const id = this.employee().id;
    return colors[id % colors.length];
  });

  protected readonly departmentColor = computed(() => {
    const dept = this.employee().department.toLowerCase();
    const colorMap: Record<string, string> = {
      'engineering': '#1976d2',
      'design': '#7b1fa2',
      'product': '#388e3c',
      'marketing': '#f57c00',
      'sales': '#d32f2f',
      'hr': '#0097a7',
      'finance': '#5d4037'
    };
    return colorMap[dept] || '#616161';
  });

  protected readonly availabilityLabel = computed(() => {
    return AVAILABILITY_LABELS[this.employee().availability];
  });

  protected readonly availabilityClass = computed(() => {
    const availability = this.employee().availability;
    return `status-${availability}`;
  });

  protected readonly isPulsing = computed(() => {
    return this.employee().availability === 'available';
  });

  protected readonly topSkills = computed(() => {
    const employee = this.employee();
    const allSkills = [
      ...employee.technologies.map(t => ({ name: t.name, proficiency: t.proficiency, years: t.years })),
      ...employee.skills.map(s => ({ name: s.name, proficiency: s.proficiency, years: s.years }))
    ];

    // Sort by proficiency level and years
    return allSkills
      .sort((a, b) => {
        const proficiencyOrder: Record<string, number> = {
          expert: 4,
          advanced: 3,
          intermediate: 2,
          beginner: 1
        };
        const profDiff = proficiencyOrder[b.proficiency] - proficiencyOrder[a.proficiency];
        if (profDiff !== 0) return profDiff;
        return b.years - a.years;
      })
      .slice(0, this.enhanced() ? 6 : 4);
  });

  protected readonly skillProficiencyValue = computed(() => {
    const proficiencyMap: Record<string, number> = {
      beginner: 25,
      intermediate: 50,
      advanced: 75,
      expert: 100
    };
    return (skill: { proficiency: string }) => proficiencyMap[skill.proficiency] || 0;
  });

  protected readonly activeProjects = computed(() => {
    // In a real app, this would come from backend
    // For now, simulate based on availability
    return this.employee().availability === 'available' ? 0 : Math.floor(Math.random() * 5) + 1;
  });

  protected readonly performanceRating = computed(() => {
    // Simulated rating (would come from backend)
    return (Math.random() * 1.5 + 3.5).toFixed(1);
  });

  // Actions
  protected handleCardClick(event: Event): void {
    // Don't propagate if clicking action buttons
    const target = event.target as HTMLElement;
    if (target.closest('.quick-actions') || target.closest('mat-checkbox')) {
      event.stopPropagation();
      return;
    }
  }

  protected handleCheckboxChange(event: MatCheckboxChange): void {
    this.selectToggle.emit(this.employee().id);
  }

  protected handleAction(action: string, event: Event): void {
    event.stopPropagation();
    this.actionClick.emit({ employeeId: this.employee().id, action });
  }

  protected toggleSkillRadar(): void {
    this.showSkillRadar.update(current => !current);
  }

  protected getProfilePicture(): string {
    const profilePic = this.employee().profilePicture;
    // If no profile picture or it's a placeholder, return empty string to use avatar
    if (!profilePic || profilePic.includes('placeholder') || profilePic.includes('default')) {
      return '';
    }
    return profilePic;
  }
}
