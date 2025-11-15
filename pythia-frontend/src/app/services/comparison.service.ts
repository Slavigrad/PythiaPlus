import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { catchError, of, tap, firstValueFrom } from 'rxjs';
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
  private readonly dialog = inject(MatDialog);
  private readonly apiUrl = `${environment.apiUrl}/candidates`;
  private readonly MAX_SELECTIONS = 3;

  // Profile cache for performance optimization
  // Caches loaded profiles by ID to avoid re-fetching
  private readonly profileCache = new Map<string, CandidateProfile>();

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
   * Uses cache first, then batch API endpoint for efficiency
   * Performance: Only fetches profiles not in cache
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
      // Check cache first
      const cachedProfiles: CandidateProfile[] = [];
      const uncachedIds: string[] = [];

      for (const id of ids) {
        const cached = this.profileCache.get(id);
        if (cached) {
          cachedProfiles.push(cached);
        } else {
          uncachedIds.push(id);
        }
      }

      // If all profiles are cached, use them
      if (uncachedIds.length === 0) {
        this.candidatesSignal.set(cachedProfiles);
        this.loadingSignal.set(false);
        return;
      }

      // Fetch uncached profiles
      const response = await firstValueFrom(
        this.http.post<{ candidates: CandidateProfile[], success: boolean }>(
          `${this.apiUrl}/batch-profiles`,
          { ids: uncachedIds }
        ).pipe(
          tap(response => {
            if (response.success) {
              // Cache newly loaded profiles
              response.candidates.forEach(profile => {
                this.profileCache.set(profile.id, profile);
              });

              // Combine cached + newly loaded profiles
              const allProfiles = [
                ...cachedProfiles,
                ...response.candidates
              ];

              this.candidatesSignal.set(allProfiles);
              this.loadingSignal.set(false);
            }
          }),
          catchError(err => {
            console.error('Failed to load candidate profiles:', err);
            this.errorSignal.set('Failed to load candidate details. Please try again.');
            this.loadingSignal.set(false);
            return of({ candidates: [], success: false });
          })
        )
      );

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

      // Open the comparison modal
      // Lazy load the component to reduce initial bundle
      const { ComparisonModalComponent } = await import('../components/comparison-modal/comparison-modal.component');

      const dialogRef = this.dialog.open(ComparisonModalComponent, {
        width: '95vw',
        maxWidth: '1200px',
        height: '90vh',
        maxHeight: '900px',
        panelClass: 'comparison-modal-panel',
        disableClose: false,
        hasBackdrop: true,
        backdropClass: 'comparison-modal-backdrop'
      });

      // When dialog closes, update comparison state
      dialogRef.afterClosed().subscribe(() => {
        this.isComparingSignal.set(false);
      });
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
