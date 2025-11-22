import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from '../core/services/base-data.service';
import { Skill, SkillResponse, SkillRequest } from '../models/skill.model';

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

  protected getItemNotFoundMessage(): string {
    return 'Skill not found.';
  }

  protected getDuplicateMessage(): string {
    return 'A skill with this name already exists.';
  }

  // Backward compatibility aliases
  loadSkills(): Observable<SkillResponse> {
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
