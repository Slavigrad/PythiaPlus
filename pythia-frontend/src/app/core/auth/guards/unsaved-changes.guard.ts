/**
 * Unsaved Changes Guard
 *
 * Prevents navigation away from forms with unsaved changes
 * Shows confirmation dialog before allowing navigation
 *
 * Usage in Component:
 * export class EmployeeEditComponent implements ComponentCanDeactivate {
 *   canDeactivate(): boolean {
 *     return !this.hasUnsavedChanges();
 *   }
 * }
 *
 * Usage in Routes:
 * {
 *   path: 'employees/edit/:id',
 *   component: EmployeeEditComponent,
 *   canDeactivate: [unsavedChangesGuard]
 * }
 */

import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Interface for components that can be deactivated
 */
export interface ComponentCanDeactivate {
  canDeactivate: () => boolean | Observable<boolean> | Promise<boolean>;
}

export const unsavedChangesGuard: CanDeactivateFn<ComponentCanDeactivate> = (
  component: ComponentCanDeactivate
) => {
  // If component doesn't implement canDeactivate, allow navigation
  if (!component.canDeactivate) {
    return true;
  }

  const result = component.canDeactivate();

  // If component says it's OK to deactivate, allow navigation
  if (result === true) {
    return true;
  }

  // If result is Observable or Promise, handle async
  if (result instanceof Observable || result instanceof Promise) {
    const observable = result instanceof Observable ? result : new Observable(obs => {
      Promise.resolve(result).then(value => {
        obs.next(value);
        obs.complete();
      });
    });

    return observable.pipe(
      map(canDeactivate => {
        if (canDeactivate) {
          return true;
        }
        return confirmNavigation();
      })
    );
  }

  // Show confirmation dialog
  return confirmNavigation();
};

/**
 * Show native browser confirmation dialog
 * Can be replaced with custom Material Dialog for better UX
 */
function confirmNavigation(): boolean {
  return window.confirm(
    'You have unsaved changes. Are you sure you want to leave this page? Your changes will be lost.'
  );
}

/**
 * Custom Confirmation Dialog (Material Design)
 *
 * For better UX, use this with MatDialog instead of native confirm()
 *
 * Example:
 * const dialogRef = dialog.open(ConfirmDialogComponent, {
 *   data: {
 *     title: 'Unsaved Changes',
 *     message: 'You have unsaved changes. Do you want to leave?',
 *     confirmText: 'Leave',
 *     cancelText: 'Stay'
 *   }
 * });
 * return dialogRef.afterClosed().pipe(map(result => !!result));
 */
