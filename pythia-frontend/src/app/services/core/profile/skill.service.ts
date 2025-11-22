import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService, DataResponse } from '../core/services/base-data.service';
import { Skill, SkillRequest } from '../models/skill.model';

/**
 * Skill Service
 *
 * Manages CRUD operations for skill master data.
 * Extends BaseDataService for standardized data management.
 */
@Injectable({
  providedIn: 'root'
})
export class SkillService extends BaseDataService<Skill, SkillRequest> {
  protected getEndpoint(): string {
    return 'skills';
  }

  protected getSearchFields(skill: Skill): string[] {
    return [
      skill.name,
      skill.description,
      skill.category,
      skill.code || ''
    ];
  }

  protected override getItemNotFoundMessage(): string {
    return 'Skill not found.';
  }

  protected override getDuplicateMessage(): string {
    return 'A skill with this name already exists.';
  }

  // Backward compatibility aliases
  loadSkills(): Observable<DataResponse<Skill>> {
    return this.load();
  }

  createSkill(request: SkillRequest): Observable<Skill> {
    return this.create(request);
  }

  updateSkill(id: number, request: SkillRequest): Observable<Skill> {
    return this.update(id, request);
  }

  deleteSkill(id: number): Observable<void> {
    return this.delete(id);
  }

  get skills() {
    return this.data;
  }

  get filteredSkills() {
    return this.filteredData;
  }
}
