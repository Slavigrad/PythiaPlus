import { Component, ChangeDetectionStrategy, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { SkeletonLoaderComponent } from '../../components/shared/skeleton-loader/skeleton-loader.component';
import { EmployeeCreateButtonComponent } from '../../components/employee-create-button/employee-create-button.component';
import { EmployeeCreateWizardComponent } from '../../components/employee-create-wizard/employee-create-wizard.component';

/**
 * Employee List Page Component
 *
 * Displays all employees in a grid layout with cards
 * Features: Loading states, error handling, click to navigate to detail
 */
@Component({
  selector: 'app-employee-list',
  imports: [CommonModule, SkeletonLoaderComponent, EmployeeCreateButtonComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent implements OnInit {
  protected readonly employeeService = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly dialog = inject(MatDialog);

  // Expose service signals to template
  protected readonly employees = this.employeeService.employees;
  protected readonly loading = this.employeeService.listLoading;
  protected readonly error = this.employeeService.listError;

  ngOnInit(): void {
    this.employeeService.getEmployees();
  }

  /**
   * Navigate to employee detail page
   */
  protected navigateToEmployee(id: number | undefined): void {
    if (!id) {
      console.error('Cannot navigate: employee ID is undefined');
      return;
    }
    this.router.navigate(['/employees', id]);
  }

  /**
   * Get initials from full name
   */
  protected getInitials(fullName: string): string {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Get a consistent color for initials based on name
   * Returns a color from a predefined palette
   */
  protected getInitialsColor(fullName: string): string {
    const colors = [
      '#10b981', // green
      '#3b82f6', // blue
      '#f59e0b', // amber
      '#ef4444', // red
      '#8b5cf6', // purple
      '#ec4899', // pink
      '#06b6d4', // cyan
      '#f97316', // orange
      '#14b8a6', // teal
      '#6366f1', // indigo
    ];

    // Generate a consistent hash from the name
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Use absolute value and modulo to get consistent index
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  }

  /**
   * Handle image load error - will show initials instead
   */
  protected onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  /**
   * Get availability badge color class
   */
  protected getAvailabilityClass(availability: string): string {
    switch (availability) {
      case 'available':
        return 'badge-success';
      case 'notice':
        return 'badge-warning';
      case 'unavailable':
        return 'badge-error';
      default:
        return 'badge-neutral';
    }
  }

  /**
   * Format availability text
   */
  protected formatAvailability(availability: string): string {
    switch (availability) {
      case 'available':
        return 'Available';
      case 'notice':
        return 'Notice Period';
      case 'unavailable':
        return 'Unavailable';
      default:
        return availability;
    }
  }

  /**
   * Handle create new employee button click
   * Opens the employee creation wizard modal
   */
  protected onCreateEmployee(): void {
    const dialogRef = this.dialog.open(EmployeeCreateWizardComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      maxHeight: '900px',
      panelClass: 'wizard-dialog',
      disableClose: false, // Allow closing with ESC or backdrop click
      autoFocus: true,
      restoreFocus: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('✨ Employee created:', result);
        // Refresh employee list
        this.employeeService.getEmployees();
      }
    });
  }
}
