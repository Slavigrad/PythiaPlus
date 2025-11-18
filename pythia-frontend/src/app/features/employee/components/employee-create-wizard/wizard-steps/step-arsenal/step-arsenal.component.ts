import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSliderModule } from '@angular/material/slider';
import { EmployeeCreateService } from '../../../../services/employee-create.service';
import { TechnologyService } from '../../../../../../services/technology.service';
import { SkillService } from '../../../../../../services/skill.service';
import { Technology } from '../../../../../../models/technology.model';
import { Skill } from '../../../../../../models/skill.model';
import { EmployeeCreateTechnology, EmployeeCreateSkill } from '../../../../../../models/employee-create.model';
import { PROFICIENCY_LEVELS, Proficiency } from '../../../../../../core/constants/employee.constants';

/**
 * Step 3: The Arsenal - Technologies & Skills
 *
 * Interactive selection of technologies and skills with:
 * - Autocomplete search for technologies
 * - Autocomplete search for skills
 * - Proficiency slider (Beginner → Expert)
 * - Years of experience input
 * - Beautiful chip display with edit/remove
 * - Smooth add/remove animations
 */
@Component({
  selector: 'app-step-arsenal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatSliderModule
  ],
  templateUrl: './step-arsenal.component.html',
  styleUrl: './step-arsenal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StepArsenalComponent implements OnInit {
  private readonly createService = inject(EmployeeCreateService);
  protected readonly technologyService = inject(TechnologyService);
  protected readonly skillService = inject(SkillService);

  // =============================================================================
  // FORM CONTROLS
  // =============================================================================

  protected readonly techSearchControl = new FormControl('');
  protected readonly skillSearchControl = new FormControl('');

  // =============================================================================
  // STATE SIGNALS
  // =============================================================================

  /**
   * Selected technologies with proficiency and years
   */
  protected readonly selectedTechnologies = signal<EmployeeCreateTechnology[]>([]);

  /**
   * Selected skills with proficiency and years
   */
  protected readonly selectedSkills = signal<EmployeeCreateSkill[]>([]);

  /**
   * Proficiency levels for sliders
   */
  protected readonly proficiencyLevels = PROFICIENCY_LEVELS;

  /**
   * Expose Math for template usage
   */
  protected readonly Math = Math;

  // =============================================================================
  // LIFECYCLE
  // =============================================================================

  ngOnInit(): void {
    // Load master data
    this.technologyService.loadTechnologies().subscribe();
    this.skillService.loadSkills().subscribe();

    // Load existing selections
    const existingData = this.createService.formData();

    if (existingData.technologies && existingData.technologies.length > 0) {
      this.selectedTechnologies.set([...existingData.technologies]);
    }

    if (existingData.skills && existingData.skills.length > 0) {
      this.selectedSkills.set([...existingData.skills]);
    }
  }

  // =============================================================================
  // TECHNOLOGY METHODS
  // =============================================================================

  /**
   * Add technology with default proficiency
   */
  protected addTechnology(tech: Technology): void {
    // Check if already added
    const exists = this.selectedTechnologies().some(t => t.name === tech.name);
    if (exists) {
      return;
    }

    const newTech: EmployeeCreateTechnology = {
      name: tech.name,
      proficiency: 'Intermediate',
      yearsOfExperience: 1
    };

    this.selectedTechnologies.update(techs => [...techs, newTech]);
    this.techSearchControl.setValue('');
    this.saveToService();
  }

  /**
   * Remove technology
   */
  protected removeTechnology(index: number): void {
    this.selectedTechnologies.update(techs =>
      techs.filter((_, i) => i !== index)
    );
    this.saveToService();
  }

  /**
   * Update technology proficiency
   */
  protected updateTechProficiency(index: number, proficiency: Proficiency): void {
    this.selectedTechnologies.update(techs => {
      const updated = [...techs];
      updated[index] = { ...updated[index], proficiency };
      return updated;
    });
    this.saveToService();
  }

  /**
   * Update technology years
   */
  protected updateTechYears(index: number, years: number): void {
    this.selectedTechnologies.update(techs => {
      const updated = [...techs];
      updated[index] = { ...updated[index], yearsOfExperience: years };
      return updated;
    });
    this.saveToService();
  }

  /**
   * Get technology name by ID
   */
  protected getTechnologyName(id: number): string {
    const tech = this.technologyService.technologies().find(t => t.id === id);
    return tech?.name || `Technology #${id}`;
  }

  // =============================================================================
  // SKILL METHODS
  // =============================================================================

  /**
   * Add skill with default proficiency
   */
  protected addSkill(skill: Skill): void {
    // Check if already added
    const exists = this.selectedSkills().some(s => s.name === skill.name);
    if (exists) {
      return;
    }

    const newSkill: EmployeeCreateSkill = {
      name: skill.name,
      proficiency: 'Intermediate',
      yearsOfExperience: 1
    };

    this.selectedSkills.update(skills => [...skills, newSkill]);
    this.skillSearchControl.setValue('');
    this.saveToService();
  }

  /**
   * Remove skill
   */
  protected removeSkill(index: number): void {
    this.selectedSkills.update(skills =>
      skills.filter((_, i) => i !== index)
    );
    this.saveToService();
  }

  /**
   * Update skill proficiency
   */
  protected updateSkillProficiency(index: number, proficiency: Proficiency): void {
    this.selectedSkills.update(skills => {
      const updated = [...skills];
      updated[index] = { ...updated[index], proficiency };
      return updated;
    });
    this.saveToService();
  }

  /**
   * Update skill years
   */
  protected updateSkillYears(index: number, years: number): void {
    this.selectedSkills.update(skills => {
      const updated = [...skills];
      updated[index] = { ...updated[index], yearsOfExperience: years };
      return updated;
    });
    this.saveToService();
  }

  /**
   * Get skill name by ID
   */
  protected getSkillName(id: number): string {
    const skill = this.skillService.skills().find(s => s.id === id);
    return skill?.name || `Skill #${id}`;
  }

  // =============================================================================
  // HELPER METHODS
  // =============================================================================

  /**
   * Get proficiency color
   */
  protected getProficiencyColor(proficiency: Proficiency): string {
    switch (proficiency) {
      case 'beginner':
        return '#10b981'; // green
      case 'intermediate':
        return '#3b82f6'; // blue
      case 'advanced':
        return '#f59e0b'; // amber
      case 'expert':
        return '#ef4444'; // red
      default:
        return '#9e9e9e';
    }
  }

  /**
   * Get proficiency label
   */
  protected getProficiencyLabel(proficiency: Proficiency): string {
    return proficiency.charAt(0).toUpperCase() + proficiency.slice(1);
  }

  /**
   * Save to service
   */
  private saveToService(): void {
    this.createService.updateFormData({
      technologies: this.selectedTechnologies().length > 0
        ? this.selectedTechnologies()
        : undefined,
      skills: this.selectedSkills().length > 0
        ? this.selectedSkills()
        : undefined
    });
  }

  /**
   * Display function for autocomplete
   */
  protected displayTech(tech: Technology | null): string {
    return tech?.name || '';
  }

  /**
   * Display function for autocomplete
   */
  protected displaySkill(skill: Skill | null): string {
    return skill?.name || '';
  }
}
