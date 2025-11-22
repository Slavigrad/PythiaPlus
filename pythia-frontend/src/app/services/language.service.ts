import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from '../core/services/base-data.service';
import { Language, LanguageResponse, LanguageRequest } from '../models/language.model';

/**
 * Language Service
 *
 * Manages CRUD operations for language master data.
 * Extends BaseDataService for standardized data management.
 */
@Injectable({
  providedIn: 'root'
})
export class LanguageService extends BaseDataService<Language, LanguageRequest> {
  protected getEndpoint(): string {
    return 'languages';
  }

  protected getSearchFields(language: Language): string[] {
    return [
      language.name,
      language.nativeName,
      language.code
    ];
  }

  protected getItemNotFoundMessage(): string {
    return 'Language not found.';
  }

  protected getDuplicateMessage(): string {
    return 'A language with this name already exists.';
  }

  // Backward compatibility aliases
  loadLanguages(): Observable<LanguageResponse> {
    return this.load();
  }

  createLanguage(request: LanguageRequest): Observable<Language> {
    return this.create(request);
  }

  updateLanguage(id: number, request: LanguageRequest): Observable<Language> {
    return this.update(id, request);
  }

  deleteLanguage(id: number): Observable<void> {
    return this.delete(id);
  }

  get languages() {
    return this.data;
  }

  get filteredLanguages() {
    return this.filteredData;
  }
}
