/**
 * Role-Based Authorization Guard
 *
 * Protects routes based on user roles
 * Supports hierarchical role checking (admin > hr > manager > viewer)
 *
 * Usage:
 * {
 *   path: 'master-data',
 *   component: MasterDataPage,
 *   canActivate: [authGuard, roleGuard(['admin', 'hr'])]
 * }
 */

import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (allowedRoles: UserRole[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    // Check if user has any of the allowed roles
    const hasAccess = allowedRoles.some(role => authService.hasRoleSync(role));

    if (hasAccess) {
      return true;
    }

    // User is authenticated but doesn't have required role
    router.navigate(['/unauthorized']);
    return false;
  };
};

/**
 * Permission-Based Authorization Guard
 *
 * More granular than role guard - checks specific permissions
 *
 * Usage:
 * {
 *   path: 'employees/edit/:id',
 *   component: EmployeeEditPage,
 *   canActivate: [authGuard, permissionGuard(['employees.write'])]
 * }
 */
export const permissionGuard = (requiredPermissions: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    const user = authService.currentUser();

    if (!user) {
      router.navigate(['/login']);
      return false;
    }

    // Check if user has all required permissions
    const hasAccess = requiredPermissions.every(permission =>
      authService.hasPermissionSync(permission)
    );

    if (hasAccess) {
      return true;
    }

    router.navigate(['/unauthorized']);
    return false;
  };
};
