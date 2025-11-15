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
import { TechnologyUpdateItem } from '../../../../../models/employee-update.model';
import { MasterDataService, MasterTechnology } from '../../../services/master-data.service';

/**
 * Technologies Edit Component
 *
 * Editable form for employee technologies:
 * - Autocomplete technology selection from master data
 * - Proficiency level (Beginner, Intermediate, Advanced, Expert)
 * - Years of experience
 * - Add/Remove items
 *
 * IMPORTANT: Backend uses DELETE ALL + INSERT strategy
 * - Send complete array of technologies
 * - Empty array deletes all
 * - Omitting field keeps existing data
 */
@Component({
  selector: 'app-technologies-edit',
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
  templateUrl: './technologies-edit.component.html',
  styleUrl: './technologies-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechnologiesEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly masterDataService = inject(MasterDataService);

  // Inputs
  readonly employee = input.required<Employee>();

  // Master data
  readonly allTechnologies = this.masterDataService.technologies;
  readonly masterDataLoading = this.masterDataService.loading;

  // Form
  protected form: FormGroup;

  // Proficiency options
  protected readonly proficiencyOptions = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  // Form validity signal
  readonly isFormValid = signal<boolean>(false);

  // Filtered technologies for autocomplete
  readonly filteredTechnologies = computed(() => {
    return this.allTechnologies();
  });

  constructor() {
    this.form = this.fb.group({
      technologies: this.fb.array([])
    });

    // Load master data
    this.masterDataService.getTechnologies().subscribe();

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
   * Get technologies form array
   */
  get technologies(): FormArray {
    return this.form.get('technologies') as FormArray;
  }

  /**
   * Reset form to employee technologies
   */
  protected resetForm(emp: Employee): void {
    this.technologies.clear();

    emp.technologies.forEach(tech => {
      this.technologies.push(this.createTechnologyFormGroup({
        technologyId: tech.id,
        proficiency: tech.proficiency,
        years: tech.years
      }));
    });

    // Add one empty row if no technologies
    if (emp.technologies.length === 0) {
      this.addTechnology();
    }
  }

  /**
   * Create a technology form group
   */
  private createTechnologyFormGroup(tech?: Partial<TechnologyUpdateItem>): FormGroup {
    return this.fb.group({
      technologyId: [tech?.technologyId || null, Validators.required],
      technologyName: [''], // For display purposes
      proficiency: [tech?.proficiency || 'intermediate', Validators.required],
      years: [tech?.years || 1, [Validators.required, Validators.min(0), Validators.max(50)]]
    });
  }

  /**
   * Add new technology row
   */
  protected addTechnology(): void {
    this.technologies.push(this.createTechnologyFormGroup());
  }

  /**
   * Remove technology at index
   */
  protected removeTechnology(index: number): void {
    this.technologies.removeAt(index);

    // Ensure at least one empty row
    if (this.technologies.length === 0) {
      this.addTechnology();
    }
  }

  /**
   * Get technology name by ID
   */
  protected getTechnologyName(id: number | null): string {
    if (!id) return '';
    const tech = this.allTechnologies().find(t => t.id === id);
    return tech ? tech.name : '';
  }

  /**
   * Handle technology selection from autocomplete
   */
  protected onTechnologySelected(index: number, technology: MasterTechnology): void {
    const techGroup = this.technologies.at(index) as FormGroup;
    techGroup.patchValue({
      technologyId: technology.id,
      technologyName: technology.name
    });
  }

  /**
   * Display function for autocomplete
   */
  protected displayTechnology(techId: number | null): string {
    if (!techId) return '';
    return this.getTechnologyName(techId);
  }

  /**
   * Get form data for save
   * Returns array of TechnologyUpdateItem
   */
  getFormData(): TechnologyUpdateItem[] {
    return this.technologies.controls
      .map(control => control.value)
      .filter(tech => tech.technologyId) // Only include selected technologies
      .map(tech => ({
        technologyId: tech.technologyId,
        proficiency: tech.proficiency,
        years: tech.years
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
    // Valid if at least one technology selected or all rows are empty
    const data = this.getFormData();
    return data.length === 0 || this.form.valid;
  }

  /**
   * Check if there are any technologies
   */
  hasTechnologies(): boolean {
    return this.getFormData().length > 0;
  }
}
