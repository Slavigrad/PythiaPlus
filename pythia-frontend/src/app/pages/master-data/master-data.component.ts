import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TechnologyService } from '../../services/technology.service';
import { Technology } from '../../models/technology.model';
import { TechnologyEditDialogComponent } from './components/technology-edit-dialog/technology-edit-dialog.component';
import { RoleService } from '../../services/role.service';
import { Role } from '../../models/role.model';
import { RoleEditDialogComponent } from './components/role-edit-dialog/role-edit-dialog.component';
import { TrainingService } from '../../services/training.service';
import { Training } from '../../models/training.model';
import { TrainingEditDialogComponent } from './components/training-edit-dialog/training-edit-dialog.component';
import { CertificateService } from '../../services/certificate.service';
import { Certificate } from '../../models/certificate.model';
import { CertificateEditDialogComponent } from './components/certificate-edit-dialog/certificate-edit-dialog.component';

/**
 * Master Data Management Component
 *
 * Purpose: Central hub for managing master data (technologies, roles, trainings, etc.)
 * Features:
 * - Tabbed interface for different data categories
 * - CRUD operations for each category
 * - Professional, corporate design optimized for HR/Managers
 * - Material Design 3 with Pythia+ brand theme
 */
@Component({
  selector: 'app-master-data',
  imports: [
    CommonModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './master-data.component.html',
  styleUrl: './master-data.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MasterDataComponent implements OnInit {
  protected readonly technologyService = inject(TechnologyService);
  protected readonly roleService = inject(RoleService);
  protected readonly trainingService = inject(TrainingService);
  protected readonly certificateService = inject(CertificateService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Active tab index
  protected readonly activeTabIndex = signal(0);

  ngOnInit(): void {
    // Load technologies on component initialization
    this.loadTechnologies();
    // Load roles on component initialization
    this.loadRoles();
    // Load trainings on component initialization
    this.loadTrainings();
    // Load certificates on component initialization
    this.loadCertificates();
  }

  /**
   * Load technologies from API
   */
  protected loadTechnologies(): void {
    this.technologyService.loadTechnologies().subscribe({
      error: (error) => {
        this.showError('Failed to load technologies');
        console.error('Error loading technologies:', error);
      }
    });
  }

  /**
   * Open dialog to add new technology
   */
  protected addTechnology(): void {
    const dialogRef = this.dialog.open(TechnologyEditDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.technologyService.createTechnology(result).subscribe({
          next: () => {
            this.showSuccess('Technology added successfully');
          },
          error: (error) => {
            this.showError('Failed to add technology');
            console.error('Error creating technology:', error);
          }
        });
      }
    });
  }

  /**
   * Open dialog to edit existing technology
   */
  protected editTechnology(technology: Technology): void {
    const dialogRef = this.dialog.open(TechnologyEditDialogComponent, {
      width: '600px',
      data: { mode: 'edit', technology }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.technologyService.updateTechnology(technology.id, result).subscribe({
          next: () => {
            this.showSuccess('Technology updated successfully');
          },
          error: (error) => {
            this.showError('Failed to update technology');
            console.error('Error updating technology:', error);
          }
        });
      }
    });
  }

  /**
   * Delete technology with confirmation
   */
  protected deleteTechnology(technology: Technology): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${technology.name}"?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      this.technologyService.deleteTechnology(technology.id).subscribe({
        next: () => {
          this.showSuccess('Technology deleted successfully');
        },
        error: (error) => {
          this.showError('Failed to delete technology');
          console.error('Error deleting technology:', error);
        }
      });
    }
  }

  /**
   * Show success notification
   */
  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Show error notification
   */
  private showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }

  /**
   * Load roles from API
   */
  protected loadRoles(): void {
    this.roleService.loadRoles().subscribe({
      error: (error) => {
        this.showError('Failed to load roles');
        console.error('Error loading roles:', error);
      }
    });
  }

  /**
   * Open dialog to add new role
   */
  protected addRole(): void {
    const dialogRef = this.dialog.open(RoleEditDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.createRole(result).subscribe({
          next: () => {
            this.showSuccess('Role added successfully');
          },
          error: (error) => {
            this.showError('Failed to add role');
            console.error('Error creating role:', error);
          }
        });
      }
    });
  }

  /**
   * Open dialog to edit existing role
   */
  protected editRole(role: Role): void {
    const dialogRef = this.dialog.open(RoleEditDialogComponent, {
      width: '600px',
      data: { mode: 'edit', role }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.roleService.updateRole(role.id, result).subscribe({
          next: () => {
            this.showSuccess('Role updated successfully');
          },
          error: (error) => {
            this.showError('Failed to update role');
            console.error('Error updating role:', error);
          }
        });
      }
    });
  }

  /**
   * Delete role with confirmation
   */
  protected deleteRole(role: Role): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${role.name}"?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      this.roleService.deleteRole(role.id).subscribe({
        next: () => {
          this.showSuccess('Role deleted successfully');
        },
        error: (error) => {
          this.showError('Failed to delete role');
          console.error('Error deleting role:', error);
        }
      });
    }
  }

  /**
   * Load trainings from API
   */
  protected loadTrainings(): void {
    this.trainingService.loadTrainings().subscribe({
      error: (error) => {
        this.showError('Failed to load trainings');
        console.error('Error loading trainings:', error);
      }
    });
  }

  /**
   * Open dialog to add new training
   */
  protected addTraining(): void {
    const dialogRef = this.dialog.open(TrainingEditDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.createTraining(result).subscribe({
          next: () => {
            this.showSuccess('Training added successfully');
          },
          error: (error) => {
            this.showError('Failed to add training');
            console.error('Error creating training:', error);
          }
        });
      }
    });
  }

  /**
   * Open dialog to edit existing training
   */
  protected editTraining(training: Training): void {
    const dialogRef = this.dialog.open(TrainingEditDialogComponent, {
      width: '600px',
      data: { mode: 'edit', training }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.updateTraining(training.id, result).subscribe({
          next: () => {
            this.showSuccess('Training updated successfully');
          },
          error: (error) => {
            this.showError('Failed to update training');
            console.error('Error updating training:', error);
          }
        });
      }
    });
  }

  /**
   * Delete training with confirmation
   */
  protected deleteTraining(training: Training): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${training.name}"?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      this.trainingService.deleteTraining(training.id).subscribe({
        next: () => {
          this.showSuccess('Training deleted successfully');
        },
        error: (error) => {
          this.showError('Failed to delete training');
          console.error('Error deleting training:', error);
        }
      });
    }
  }

  /**
   * Load certificates from API
   */
  protected loadCertificates(): void {
    this.certificateService.loadCertificates().subscribe({
      error: (error) => {
        this.showError('Failed to load certificates');
        console.error('Error loading certificates:', error);
      }
    });
  }

  /**
   * Open dialog to add new certificate
   */
  protected addCertificate(): void {
    const dialogRef = this.dialog.open(CertificateEditDialogComponent, {
      width: '600px',
      data: { mode: 'create' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.certificateService.createCertificate(result).subscribe({
          next: () => {
            this.showSuccess('Certificate added successfully');
          },
          error: (error) => {
            this.showError('Failed to add certificate');
            console.error('Error creating certificate:', error);
          }
        });
      }
    });
  }

  /**
   * Open dialog to edit existing certificate
   */
  protected editCertificate(certificate: Certificate): void {
    const dialogRef = this.dialog.open(CertificateEditDialogComponent, {
      width: '600px',
      data: { mode: 'edit', certificate }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.certificateService.updateCertificate(certificate.id, result).subscribe({
          next: () => {
            this.showSuccess('Certificate updated successfully');
          },
          error: (error) => {
            this.showError('Failed to update certificate');
            console.error('Error updating certificate:', error);
          }
        });
      }
    });
  }

  /**
   * Delete certificate with confirmation
   */
  protected deleteCertificate(certificate: Certificate): void {
    const confirmed = confirm(
      `Are you sure you want to delete "${certificate.name}"?\n\nThis action cannot be undone.`
    );

    if (confirmed) {
      this.certificateService.deleteCertificate(certificate.id).subscribe({
        next: () => {
          this.showSuccess('Certificate deleted successfully');
        },
        error: (error) => {
          this.showError('Failed to delete certificate');
          console.error('Error deleting certificate:', error);
        }
      });
    }
  }
}
