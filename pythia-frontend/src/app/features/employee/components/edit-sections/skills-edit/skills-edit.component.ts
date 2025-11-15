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
import { SkillUpdateItem } from '../../../../../models/employee-update.model';
import { MasterDataService, MasterSkill } from '../../../services/master-data.service';

/**
 * Skills Edit Component
 *
 * Editable form for employee skills:
 * - Autocomplete skill selection from master data
 * - Proficiency level (Beginner, Intermediate, Advanced, Expert)
 * - Years of experience
 * - Add/Remove items
 *
 * IMPORTANT: Backend uses DELETE ALL + INSERT strategy
 * - Send complete array of skills
 * - Empty array deletes all
 * - Omitting field keeps existing data
 */
@Component({
  selector: 'app-skills-edit',
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
  templateUrl: './skills-edit.component.html',
  styleUrl: './skills-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SkillsEditComponent {
  private readonly fb = inject(FormBuilder);
  private readonly masterDataService = inject(MasterDataService);

  // Inputs
  readonly employee = input.required<Employee>();

  // Master data
  readonly allSkills = this.masterDataService.skills;
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

  // Filtered skills for autocomplete
  readonly filteredSkills = computed(() => {
    return this.allSkills();
  });

  constructor() {
    this.form = this.fb.group({
      skills: this.fb.array([])
    });

    // Load master data
    this.masterDataService.getSkills().subscribe();

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
   * Get skills form array
   */
  get skills(): FormArray {
    return this.form.get('skills') as FormArray;
  }

  /**
   * Reset form to employee skills
   */
  protected resetForm(emp: Employee): void {
    this.skills.clear();

    emp.skills.forEach(skill => {
      this.skills.push(this.createSkillFormGroup({
        skillId: skill.id,
        proficiency: skill.proficiency,
        years: skill.years
      }));
    });

    // Add one empty row if no skills
    if (emp.skills.length === 0) {
      this.addSkill();
    }
  }

  /**
   * Create a skill form group
   */
  private createSkillFormGroup(skill?: Partial<SkillUpdateItem>): FormGroup {
    return this.fb.group({
      skillId: [skill?.skillId || null, Validators.required],
      skillName: [''], // For display purposes
      proficiency: [skill?.proficiency || 'intermediate', Validators.required],
      years: [skill?.years || 1, [Validators.required, Validators.min(0), Validators.max(50)]]
    });
  }

  /**
   * Add new skill row
   */
  protected addSkill(): void {
    this.skills.push(this.createSkillFormGroup());
  }

  /**
   * Remove skill at index
   */
  protected removeSkill(index: number): void {
    this.skills.removeAt(index);

    // Ensure at least one empty row
    if (this.skills.length === 0) {
      this.addSkill();
    }
  }

  /**
   * Get skill name by ID
   */
  protected getSkillName(id: number | null): string {
    if (!id) return '';
    const skill = this.allSkills().find(s => s.id === id);
    return skill ? skill.name : '';
  }

  /**
   * Handle skill selection from autocomplete
   */
  protected onSkillSelected(index: number, skill: MasterSkill): void {
    const skillGroup = this.skills.at(index) as FormGroup;
    skillGroup.patchValue({
      skillId: skill.id,
      skillName: skill.name
    });
  }

  /**
   * Display function for autocomplete
   */
  protected displaySkill(skillId: number | null): string {
    if (!skillId) return '';
    return this.getSkillName(skillId);
  }

  /**
   * Get form data for save
   * Returns array of SkillUpdateItem
   */
  getFormData(): SkillUpdateItem[] {
    return this.skills.controls
      .map(control => control.value)
      .filter(skill => skill.skillId) // Only include selected skills
      .map(skill => ({
        skillId: skill.skillId,
        proficiency: skill.proficiency,
        years: skill.years
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
    // Valid if at least one skill selected or all rows are empty
    const data = this.getFormData();
    return data.length === 0 || this.form.valid;
  }

  /**
   * Check if there are any skills
   */
  hasSkills(): boolean {
    return this.getFormData().length > 0;
  }
}
