/**
 * Employee Feature Routes
 *
 * Lazy-loaded routes for employee management feature
 * Implements route-level code splitting for optimal performance
 */

import { Routes } from '@angular/router';

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
    data: {
      title: 'Employee Profile',
      description: 'View and edit employee profile'
    }
  }
];
