/**
 * Unauthorized Page Component
 *
 * Displayed when user tries to access a resource they don't have permission for
 * Provides clear messaging and navigation options
 *
 * Features:
 * - User-friendly error message
 * - Navigation back to safe route
 * - Role/permission explanation
 * - Contact support option
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../core/auth';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatCardModule],
  template: `
    <div class="unauthorized-page">
      <mat-card class="unauthorized-card">
        <mat-card-header>
          <mat-icon class="unauthorized-icon" color="warn">lock</mat-icon>
          <mat-card-title>Access Denied</mat-card-title>
          <mat-card-subtitle>You don't have permission to access this resource</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          @if (currentUser()) {
            <div class="user-info">
              <p><strong>Current User:</strong> {{ currentUser()?.fullName }}</p>
              <p><strong>Role:</strong> {{ getRoleLabel(currentUser()?.role) }}</p>
            </div>

            <p class="explanation">
              This page requires
              @if (requiredRole()) {
                <strong>{{ getRoleLabel(requiredRole()) }}</strong> role
              } @else {
                higher permissions
              }
              to access.
            </p>

            <p class="help-text">
              If you believe you should have access to this resource, please contact your administrator
              or email <a href="mailto:support@pythia.com">support@pythia.com</a>.
            </p>
          } @else {
            <p class="explanation">
              You need to be logged in with the appropriate permissions to access this resource.
            </p>
          }
        </mat-card-content>

        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="goHome()">
            <mat-icon>home</mat-icon>
            Go to Home
          </button>
          <button mat-stroked-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Go Back
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .unauthorized-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 64px);
      padding: var(--spacing-lg);
      background: var(--color-background);
    }

    .unauthorized-card {
      max-width: 600px;
      width: 100%;
      text-align: center;
    }

    mat-card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: var(--spacing-xl) var(--spacing-lg);
    }

    .unauthorized-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      margin-bottom: var(--spacing-md);
    }

    mat-card-title {
      font-size: var(--font-size-xxl);
      font-weight: var(--font-weight-bold);
      margin: var(--spacing-sm) 0;
    }

    mat-card-subtitle {
      font-size: var(--font-size-md);
      color: var(--color-text-secondary);
    }

    mat-card-content {
      padding: var(--spacing-xl);
      text-align: left;
    }

    .user-info {
      background: var(--color-background-secondary);
      padding: var(--spacing-md);
      border-radius: var(--border-radius-md);
      margin-bottom: var(--spacing-lg);

      p {
        margin: var(--spacing-xs) 0;
        color: var(--color-text-primary);
      }
    }

    .explanation {
      font-size: var(--font-size-md);
      margin: var(--spacing-md) 0;
      color: var(--color-text-primary);
    }

    .help-text {
      font-size: var(--font-size-sm);
      color: var(--color-text-secondary);
      margin-top: var(--spacing-lg);

      a {
        color: var(--color-primary);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    mat-card-actions {
      display: flex;
      gap: var(--spacing-md);
      justify-content: center;
      padding: var(--spacing-lg);

      button {
        min-width: 140px;

        mat-icon {
          margin-right: var(--spacing-xs);
        }
      }
    }

    @media (max-width: 600px) {
      .unauthorized-page {
        padding: var(--spacing-md);
      }

      mat-card-actions {
        flex-direction: column;

        button {
          width: 100%;
        }
      }
    }
  `]
})
export class UnauthorizedComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  protected readonly currentUser = this.authService.currentUser;

  /**
   * Get required role from route data (if available)
   */
  protected requiredRole(): string | null {
    // Try to get from navigation extras or route snapshot
    const navigation = this.router.getCurrentNavigation();
    const requiredRoles = navigation?.extras?.state?.['requiredRoles'];
    return requiredRoles?.[0] || null;
  }

  /**
   * Navigate to home page
   */
  protected goHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigate back to previous page
   */
  protected goBack(): void {
    window.history.back();
  }

  /**
   * Get human-readable role label
   */
  protected getRoleLabel(role?: string): string {
    if (!role) return 'Unknown';

    const roleLabels: Record<string, string> = {
      admin: 'Administrator',
      hr: 'HR Manager',
      manager: 'Manager',
      viewer: 'Viewer'
    };

    return roleLabels[role] || role;
  }
}
