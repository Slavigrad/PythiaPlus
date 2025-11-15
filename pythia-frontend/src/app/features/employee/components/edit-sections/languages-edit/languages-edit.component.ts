import { Component, input, signal, effect, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '../../../../../models/employee.model';
import { LanguageUpdateItem } from '../../../../../models/employee-update.model';
import { MasterDataService, MasterLanguage } from '../../../services/master-data.service';

/**
 * Languages Edit Component
 *
 * Editable form for employee languages:
 * - Autocomplete language selection from master data
 * - Proficiency level (A1, A2, B1, B2, C1, C2, Native)
 * - Add/Remove items
 *
 * IMPORTANT: Backend uses DELETE ALL + INSERT strategy
 * - Send complete array of languages
 * - Empty array deletes all
 * - Omitting field keeps existing data
 */
@Component({
  selector: 'app-languages-edit',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './languages-edit.component.html',
  styleUrl: './languages-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguagesEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly masterDataService = inject(MasterDataService);

  // Inputs
  readonly employee = input.required<Employee>();

  // Master data
  readonly allLanguages = this.masterDataService.languages;
  readonly masterDataLoading = this.masterDataService.loading;

  // Form
  protected form: FormGroup;

  // Proficiency levels (CEFR + Native)
  protected readonly proficiencyLevels = [
    { value: 'A1', label: 'A1 - Beginner' },
    { value: 'A2', label: 'A2 - Elementary' },
    { value: 'B1', label: 'B1 - Intermediate' },
    { value: 'B2', label: 'B2 - Upper Intermediate' },
    { value: 'C1', label: 'C1 - Advanced' },
    { value: 'C2', label: 'C2 - Proficient' },
    { value: 'native', label: 'Native' }
  ];

  // Form validity signal
  readonly isFormValid = signal<boolean>(false);

  // Filtered languages for autocomplete
  readonly filteredLanguages = computed(() => {
    return this.allLanguages();
  });

  constructor() {
    this.form = this.fb.group({
      languages: this.fb.array([])
    });

    // Load master data
    this.masterDataService.getLanguages().subscribe();

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
   * Get languages form array
   */
  get languages(): FormArray {
    return this.form.get('languages') as FormArray;
  }

  /**
   * Reset form to employee languages
   */
  protected resetForm(emp: Employee): void {
    this.languages.clear();

    emp.languages.forEach(lang => {
      this.languages.push(this.createLanguageFormGroup({
        languageId: lang.id,
        level: lang.level || lang.proficiency
      }));
    });

    // Add one empty row if no languages
    if (emp.languages.length === 0) {
      this.addLanguage();
    }
  }

  /**
   * Create a language form group
   */
  private createLanguageFormGroup(lang?: Partial<LanguageUpdateItem>): FormGroup {
    return this.fb.group({
      languageId: [lang?.languageId || null, Validators.required],
      languageName: [''], // For display purposes
      level: [lang?.level || 'B1', Validators.required]
    });
  }

  /**
   * Add new language row
   */
  protected addLanguage(): void {
    this.languages.push(this.createLanguageFormGroup());
  }

  /**
   * Remove language at index
   */
  protected removeLanguage(index: number): void {
    this.languages.removeAt(index);

    // Ensure at least one empty row
    if (this.languages.length === 0) {
      this.addLanguage();
    }
  }

  /**
   * Get language name by ID
   */
  protected getLanguageName(id: number | null): string {
    if (!id) return '';
    const lang = this.allLanguages().find(l => l.id === id);
    return lang ? lang.name : '';
  }

  /**
   * Handle language selection from autocomplete
   */
  protected onLanguageSelected(index: number, language: MasterLanguage): void {
    const langGroup = this.languages.at(index) as FormGroup;
    langGroup.patchValue({
      languageId: language.id,
      languageName: language.name
    });
  }

  /**
   * Display function for autocomplete
   */
  protected displayLanguage(langId: number | null): string {
    if (!langId) return '';
    return this.getLanguageName(langId);
  }

  /**
   * Get form data for save
   * Returns array of LanguageUpdateItem
   */
  getFormData(): LanguageUpdateItem[] {
    return this.languages.controls
      .map(control => control.value)
      .filter(lang => lang.languageId) // Only include selected languages
      .map(lang => ({
        languageId: lang.languageId,
        level: lang.level
      }));
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
    // Valid if at least one language selected or all rows are empty
    const data = this.getFormData();
    return data.length === 0 || this.form.valid;
  }

  /**
   * Check if there are any languages
   */
  hasLanguages(): boolean {
    return this.getFormData().length > 0;
  }
}
