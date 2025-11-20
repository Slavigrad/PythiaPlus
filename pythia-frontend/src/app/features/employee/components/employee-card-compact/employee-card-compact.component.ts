/**
 * Employee Card Compact Component - Pythia+
 *
 * Horizontal layout for list view with:
 * - Compact horizontal design
 * - Essential information only
 * - Quick actions inline
 * - Fast scanning optimized
 */

import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule, MatCheckboxChange } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';

import { Employee } from '../../../../models/employee.model';
import { AVAILABILITY_LABELS } from '../../../../core/constants/employee.constants';

@Component({
  selector: 'app-employee-card-compact',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatChipsModule
  ],
  templateUrl: './employee-card-compact.component.html',
  styleUrl: './employee-card-compact.component.scss'
})
export class EmployeeCardCompactComponent {
  // Inputs
  readonly employee = input.required<Employee>();
  readonly selectable = input(false);
  readonly selected = input(false);

  // Outputs
  readonly selectToggle = output<number>();
  readonly actionClick = output<{ employeeId: number; action: string }>();

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
      '#d32f2f', '#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#0097a7'
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

  protected readonly availabilityIcon = computed(() => {
    const icons: Record<string, string> = {
      'available': 'check_circle',
      'busy': 'schedule',
      'unavailable': 'block',
      'notice_period': 'event'
    };
    return icons[this.employee().availability] || 'help';
  });

  protected readonly topSkills = computed(() => {
    const employee = this.employee();
    const allSkills = [
      ...employee.technologies.map(t => t.name),
      ...employee.skills.map(s => s.name)
    ];
    return allSkills.slice(0, 5);
  });

  protected readonly getProfilePicture = computed(() => {
    const profilePic = this.employee().profilePicture;
    if (!profilePic || profilePic.includes('placeholder') || profilePic.includes('default')) {
      return '';
    }
    return profilePic;
  });

  // Actions
  protected handleCheckboxChange(event: MatCheckboxChange): void {
    this.selectToggle.emit(this.employee().id);
  }

  protected handleAction(action: string, event: Event): void {
    event.stopPropagation();
    this.actionClick.emit({ employeeId: this.employee().id, action });
  }
}
