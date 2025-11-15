import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Notification service for displaying snackbar messages
 * Provides consistent styling and behavior for success, error, warning, and info messages
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'bottom',
  };

  /**
   * Show success message
   * @param message - Message to display
   * @param duration - Duration in milliseconds (default: 4000)
   */
  success(message: string, duration?: number): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: ['snackbar-success']
    });
  }

  /**
   * Show error message
   * @param message - Message to display
   * @param duration - Duration in milliseconds (default: 6000 for errors)
   */
  error(message: string, duration?: number): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration: duration || 6000,
      panelClass: ['snackbar-error']
    });
  }

  /**
   * Show warning message
   * @param message - Message to display
   * @param duration - Duration in milliseconds (default: 5000)
   */
  warning(message: string, duration?: number): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration: duration || 5000,
      panelClass: ['snackbar-warning']
    });
  }

  /**
   * Show info message
   * @param message - Message to display
   * @param duration - Duration in milliseconds (default: 4000)
   */
  info(message: string, duration?: number): void {
    this.snackBar.open(message, 'Close', {
      ...this.defaultConfig,
      duration: duration || this.defaultConfig.duration,
      panelClass: ['snackbar-info']
    });
  }

  /**
   * Dismiss all snackbars
   */
  dismiss(): void {
    this.snackBar.dismiss();
  }
}
