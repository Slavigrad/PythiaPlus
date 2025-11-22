import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseDataService } from '../core/services/base-data.service';
import { Training, TrainingResponse, TrainingRequest } from '../models/training.model';

/**
 * Training Service
 *
 * Manages CRUD operations for training master data.
 * Extends BaseDataService for standardized data management.
 */
@Injectable({
  providedIn: 'root'
})
export class TrainingService extends BaseDataService<Training, TrainingRequest> {
  protected getEndpoint(): string {
    return 'trainings';
  }

  protected getSearchFields(training: Training): string[] {
    return [
      training.name,
      training.description,
      training.provider,
      training.code || ''
    ];
  }

  protected getItemNotFoundMessage(): string {
    return 'Training not found.';
  }

  protected getDuplicateMessage(): string {
    return 'A training with this name already exists.';
  }

  // Backward compatibility aliases
  loadTrainings(): Observable<TrainingResponse> {
    return this.load();
  }

  createTraining(request: TrainingRequest): Observable<Training> {
    return this.create(request);
  }

  updateTraining(id: number, request: TrainingRequest): Observable<Training> {
    return this.update(id, request);
  }

  deleteTraining(id: number): Observable<void> {
    return this.delete(id);
  }

  get trainings() {
    return this.data;
  }

  get filteredTrainings() {
    return this.filteredData;
  }
}
