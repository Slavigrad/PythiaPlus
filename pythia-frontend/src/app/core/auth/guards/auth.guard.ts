/**
 * Authentication Guard
 *
 * Protects routes from unauthenticated access
 * Redirects to login page if user is not authenticated
 *
 * Usage:
 * {
 *   path: 'dashboard',
 *   component: DashboardPage,
 *   canActivate: [authGuard]
 * }
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Store intended URL for redirect after login
  authService.redirectUrl.set(state.url);

  // Redirect to login page
  router.navigate(['/login']);
  return false;
};
