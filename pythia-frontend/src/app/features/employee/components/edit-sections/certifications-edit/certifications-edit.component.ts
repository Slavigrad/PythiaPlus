import { Component, input, signal, effect, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Employee } from '../../../../../models/employee.model';
import { CertificationUpdateItem } from '../../../../../models/employee-update.model';
import { MasterDataService, MasterCertification } from '../../../services/master-data.service';

/**
 * Certifications Edit Component
 *
 * Editable form for employee certifications:
 * - Autocomplete certification selection from master data
 * - Issue date (required)
 * - Expiry date (optional)
 * - Add/Remove items
 * - Validation: expiry date must be after issue date
 *
 * IMPORTANT: Backend uses DELETE ALL + INSERT strategy
 * - Send complete array of certifications
 * - Empty array deletes all
 * - Omitting field keeps existing data
 */
@Component({
  selector: 'app-certifications-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './certifications-edit.component.html',
  styleUrl: './certifications-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificationsEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly masterDataService = inject(MasterDataService);

  // Inputs
  readonly employee = input.required<Employee>();

  // Master data
  readonly allCertifications = this.masterDataService.certifications;
  readonly masterDataLoading = this.masterDataService.loading;

  // Form
  protected form: FormGroup;

  // Form validity signal
  readonly isFormValid = signal<boolean>(false);

  // Filtered certifications for autocomplete
  readonly filteredCertifications = computed(() => {
    return this.allCertifications();
  });

  constructor() {
    this.form = this.fb.group({
      certifications: this.fb.array([])
    });

    // Load master data
    this.masterDataService.getCertifications().subscribe();

    // Update form when employee changes
    effect(() => {
      const emp = this.employee();
      if (emp) {
        this.resetForm(emp);
      }
    });

    // Track form validity
    this.form.statusChanges.subscribe(() => {
      this.isFormValid.set(this.form.valid);
    });
  }

  /**
   * Get certifications form array
   */
  get certifications(): FormArray {
    return this.form.get('certifications') as FormArray;
  }

  /**
   * Reset form to employee certifications
   */
  protected resetForm(emp: Employee): void {
    this.certifications.clear();

    emp.certifications.forEach(cert => {
      this.certifications.push(this.createCertificationFormGroup({
        certificationId: cert.id,
        issuedOn: cert.issuedOn,
        expiresOn: cert.expiresOn || undefined
      }));
    });

    // Add one empty row if no certifications
    if (emp.certifications.length === 0) {
      this.addCertification();
    }
  }

  /**
   * Create a certification form group
   */
  private createCertificationFormGroup(cert?: Partial<CertificationUpdateItem>): FormGroup {
    return this.fb.group({
      certificationId: [cert?.certificationId || null, Validators.required],
      certificationName: [''], // For display purposes
      issuedOn: [cert?.issuedOn ? new Date(cert.issuedOn) : null, Validators.required],
      expiresOn: [cert?.expiresOn ? new Date(cert.expiresOn) : null]
    }, {
      validators: this.dateRangeValidator
    });
  }

  /**
   * Date range validator: expiry must be after issue date
   */
  private dateRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const issuedOn = group.get('issuedOn')?.value;
    const expiresOn = group.get('expiresOn')?.value;

    if (issuedOn && expiresOn && new Date(expiresOn) <= new Date(issuedOn)) {
      return { dateRange: true };
    }

    return null;
  }

  /**
   * Add new certification row
   */
  protected addCertification(): void {
    this.certifications.push(this.createCertificationFormGroup());
  }

  /**
   * Remove certification at index
   */
  protected removeCertification(index: number): void {
    this.certifications.removeAt(index);

    // Ensure at least one empty row
    if (this.certifications.length === 0) {
      this.addCertification();
    }
  }

  /**
   * Get certification name by ID
   */
  protected getCertificationName(id: number | null): string {
    if (!id) return '';
    const cert = this.allCertifications().find(c => c.id === id);
    return cert ? cert.name : '';
  }

  /**
   * Handle certification selection from autocomplete
   */
  protected onCertificationSelected(index: number, certification: MasterCertification): void {
    const certGroup = this.certifications.at(index) as FormGroup;
    certGroup.patchValue({
      certificationId: certification.id,
      certificationName: certification.name
    });
  }

  /**
   * Display function for autocomplete
   */
  protected displayCertification(certId: number | null): string {
    if (!certId) return '';
    return this.getCertificationName(certId);
  }

  /**
   * Get form data for save
   * Returns array of CertificationUpdateItem
   */
  getFormData(): CertificationUpdateItem[] {
    return this.certifications.controls
      .map(control => control.value)
      .filter(cert => cert.certificationId) // Only include selected certifications
      .map(cert => ({
        certificationId: cert.certificationId,
        issuedOn: cert.issuedOn ? this.formatDate(cert.issuedOn) : undefined,
        expiresOn: cert.expiresOn ? this.formatDate(cert.expiresOn) : undefined
      }));
  }

  /**
   * Format date to ISO string (YYYY-MM-DD)
   */
  private formatDate(date: Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Reset form to original employee values
   */
  reset(): void {
    this.resetForm(this.employee());
  }

  /**
   * Check if form is valid
   */
  isValid(): boolean {
    // Valid if at least one certification selected or all rows are empty
    const data = this.getFormData();
    return data.length === 0 || this.form.valid;
  }

  /**
   * Check if there are any certifications
   */
  hasCertifications(): boolean {
    return this.getFormData().length > 0;
  }

  /**
   * Check if certification group has date range error
   */
  protected hasDateRangeError(index: number): boolean {
    const certGroup = this.certifications.at(index) as FormGroup;
    return certGroup.hasError('dateRange') && certGroup.touched;
  }
}
