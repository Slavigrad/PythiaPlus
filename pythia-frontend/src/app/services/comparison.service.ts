import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, tap } from 'rxjs';
import { Candidate } from '../models/candidate.model';
import { CandidateProfile } from '../models/candidate-profile.model';
import { environment } from '../../environments/environment';

/**
 * Comparison Service - Multi-Select Candidate Comparison
 *
 * Purpose: Manages candidate selection state for side-by-side comparison
 * Features: Signal-based state, max 3 selections, profile loading, comparison modal control
 */
@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/candidates`;
  private readonly MAX_SELECTIONS = 3;

  // Signal-based state (Angular 20)
  private readonly selectedIdsSignal = signal<Set<string>>(new Set());
  private readonly candidatesSignal = signal<CandidateProfile[]>([]);
  private readonly isComparingSignal = signal<boolean>(false);
  private readonly loadingSignal = signal<boolean>(false);
  private readonly errorSignal = signal<string | null>(null);

  // Read-only signal accessors
  readonly selectedIds = this.selectedIdsSignal.asReadonly();
  readonly candidates = this.candidatesSignal.asReadonly();
  readonly isComparing = this.isComparingSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  // Computed signals
  readonly selectionCount = computed(() => this.selectedIds().size);
  readonly hasSelections = computed(() => this.selectionCount() > 0);
  readonly canCompare = computed(() =>
    this.selectionCount() >= 2 && this.selectionCount() <= this.MAX_SELECTIONS
  );
  readonly isMaxReached = computed(() => this.selectionCount() >= this.MAX_SELECTIONS);
  readonly selectedIdsArray = computed(() => Array.from(this.selectedIds()));

  /**
   * Check if a candidate is currently selected
   */
  isSelected(candidateId: string): boolean {
    return this.selectedIds().has(candidateId);
  }

  /**
   * Toggle selection of a candidate
   * Enforces max 3 selections limit
   */
  toggleSelection(candidateId: string): void {
    const currentIds = new Set(this.selectedIds());

    if (currentIds.has(candidateId)) {
      // Remove from selection
      currentIds.delete(candidateId);
    } else {
      // Add to selection (if not at max)
      if (currentIds.size >= this.MAX_SELECTIONS) {
        console.warn(`Cannot select more than ${this.MAX_SELECTIONS} candidates`);
        return;
      }
      currentIds.add(candidateId);
    }

    this.selectedIdsSignal.set(currentIds);
  }

  /**
   * Add candidate to selection (if not at max)
   */
  addSelection(candidateId: string): void {
    if (this.isSelected(candidateId)) {
      return; // Already selected
    }

    if (this.isMaxReached()) {
      console.warn(`Cannot select more than ${this.MAX_SELECTIONS} candidates`);
      return;
    }

    const currentIds = new Set(this.selectedIds());
    currentIds.add(candidateId);
    this.selectedIdsSignal.set(currentIds);
  }

  /**
   * Remove candidate from selection
   */
  removeSelection(candidateId: string): void {
    const currentIds = new Set(this.selectedIds());
    currentIds.delete(candidateId);
    this.selectedIdsSignal.set(currentIds);

    // Also remove from loaded profiles
    const currentCandidates = this.candidates();
    this.candidatesSignal.set(
      currentCandidates.filter(c => c.id !== candidateId)
    );
  }

  /**
   * Clear all selections
   */
  clearSelections(): void {
    this.selectedIdsSignal.set(new Set());
    this.candidatesSignal.set([]);
    this.errorSignal.set(null);
  }

  /**
   * Select multiple candidates (up to max limit)
   */
  selectMultiple(candidateIds: string[]): void {
    const currentIds = new Set(this.selectedIds());
    let added = 0;

    for (const id of candidateIds) {
      if (currentIds.size + added >= this.MAX_SELECTIONS) {
        break;
      }
      if (!currentIds.has(id)) {
        currentIds.add(id);
        added++;
      }
    }

    this.selectedIdsSignal.set(currentIds);
  }

  /**
   * Load detailed profiles for selected candidates
   * Uses batch API endpoint for efficiency
   */
  async loadProfiles(): Promise<void> {
    const ids = this.selectedIdsArray();

    if (ids.length === 0) {
      console.warn('No candidates selected to load profiles');
      return;
    }

    if (ids.length < 2) {
      console.warn('At least 2 candidates required for comparison');
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      // Use batch endpoint for better performance
      const response = await this.http.post<{ candidates: CandidateProfile[], success: boolean }>(
        `${this.apiUrl}/batch-profiles`,
        { ids }
      ).pipe(
        tap(response => {
          if (response.success) {
            this.candidatesSignal.set(response.candidates);
            this.loadingSignal.set(false);
          }
        }),
        catchError(err => {
          console.error('Failed to load candidate profiles:', err);
          this.errorSignal.set('Failed to load candidate details. Please try again.');
          this.loadingSignal.set(false);
          return of({ candidates: [], success: false });
        })
      ).toPromise() as Promise<{ candidates: CandidateProfile[], success: boolean }>;

    } catch (err) {
      console.error('Error loading profiles:', err);
      this.errorSignal.set('Failed to load candidate details. Please try again.');
      this.loadingSignal.set(false);
    }
  }

  /**
   * Open comparison modal
   * Loads profiles if not already loaded
   */
  async openComparison(): Promise<void> {
    if (!this.canCompare()) {
      console.warn('Cannot compare: need 2-3 selected candidates');
      return;
    }

    // Load profiles if not already loaded or if selections changed
    const currentIds = this.selectedIdsArray();
    const loadedIds = this.candidates().map(c => c.id);
    const needsReload = currentIds.some(id => !loadedIds.includes(id));

    if (needsReload || this.candidates().length === 0) {
      await this.loadProfiles();
    }

    // Check if loading was successful
    if (!this.error()) {
      this.isComparingSignal.set(true);
    }
  }

  /**
   * Close comparison modal
   */
  closeComparison(): void {
    this.isComparingSignal.set(false);
  }

  /**
   * Get selection status message for accessibility
   */
  getSelectionMessage(): string {
    const count = this.selectionCount();
    if (count === 0) {
      return 'No candidates selected';
    } else if (count === 1) {
      return '1 candidate selected. Select at least 1 more to compare.';
    } else if (count === this.MAX_SELECTIONS) {
      return `${count} candidates selected (maximum reached)`;
    } else {
      return `${count} candidates selected`;
    }
  }
}
