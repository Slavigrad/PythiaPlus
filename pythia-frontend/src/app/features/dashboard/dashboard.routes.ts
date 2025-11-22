/**
 * Dashboard Feature Routes
 *
 * Lazy-loaded routes for analytics dashboard feature
 */

import { Routes } from '@angular/router';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/dashboard-page/dashboard-page.component')
      .then(m => m.DashboardPageComponent),
    data: {
      title: 'Dashboard',
      description: 'Analytics and insights overview'
    }
  }
];
