/**
 * Employee Feature Routes
 *
 * Lazy-loaded routes for employee management feature
 * Implements route-level code splitting for optimal performance
 *
 * Security:
 * - All routes inherit authGuard from parent route
 * - Profile route uses unsavedChangesGuard to prevent data loss
 */

import { Routes } from '@angular/router';
import { unsavedChangesGuard } from '../../core/auth';

export const EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/employee-list/employee-list.component')
      .then(m => m.EmployeeListComponent),
    data: {
      title: 'Employees',
      description: 'Browse and manage employees'
    }
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/employee-profile/employee-profile.component')
      .then(m => m.EmployeeProfileComponent),
    canDeactivate: [unsavedChangesGuard], // 🔒 Prevent data loss from unsaved changes
    data: {
      title: 'Employee Profile',
      description: 'View and edit employee profile'
    }
  }
];
