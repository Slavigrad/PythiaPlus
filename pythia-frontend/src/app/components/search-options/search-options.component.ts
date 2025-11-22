import { Component, signal, effect, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { SearchService } from '../../services/search';
import {
  DEFAULT_TOP_K,
  DEFAULT_MIN_SCORE,
  MIN_QUERY_LENGTH,
  TOP_K_OPTIONS,
  SCORE_THRESHOLD_EXCELLENT,
  SCORE_THRESHOLD_GOOD,
  SCORE_LABELS
} from '../../core/constants';

/**
 * Search Options Component
 *
 * Purpose: Advanced search controls (topK, minScore)
 * Features: Collapsible panel, dropdown, slider with visual zones, URL state restoration, ripple effects
 */
@Component({
  selector: 'app-search-options',
  imports: [FormsModule, MatRippleModule],
  templateUrl: './search-options.component.html',
  styleUrl: './search-options.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchOptionsComponent {
  private readonly searchService = inject(SearchService);

  // Input from URL (for initial state)
  readonly initialTopK = input<number>(DEFAULT_TOP_K);
  readonly initialMinScore = input<number>(DEFAULT_MIN_SCORE);

  // UI state
  protected readonly isExpanded = signal(false);

  // Search parameters
  protected readonly topK = signal(DEFAULT_TOP_K);
  protected readonly minScore = signal(DEFAULT_MIN_SCORE);
  private isInitialized = false;

  // TopK options (from constants)
  protected readonly topKOptions = TOP_K_OPTIONS;

  constructor() {
    // Initialize from URL input
    effect(() => {
      const urlTopK = this.initialTopK();
      const urlMinScore = this.initialMinScore();
      if (!this.isInitialized && (urlTopK !== DEFAULT_TOP_K || urlMinScore !== DEFAULT_MIN_SCORE)) {
        this.topK.set(urlTopK);
        this.minScore.set(urlMinScore);
        this.isInitialized = true;
      }
    });

    // Trigger search when parameters change
    effect(() => {
      const query = this.searchService.lastQuery();
      const currentTopK = this.topK();
      const currentMinScore = this.minScore();

      // Only search if we have a query
      if (query && query.length >= MIN_QUERY_LENGTH) {
        this.searchService.search({
          query,
          topK: currentTopK,
          minScore: currentMinScore
        });
      }
    });
  }

  protected toggleExpanded(): void {
    this.isExpanded.update(v => !v);
  }

  protected getScoreLabel(score: number): string {
    if (score >= SCORE_THRESHOLD_EXCELLENT) return SCORE_LABELS.EXCELLENT;
    if (score >= SCORE_THRESHOLD_GOOD) return SCORE_LABELS.GOOD;
    return SCORE_LABELS.WIDE;
  }

  protected getScorePercentage(score: number): number {
    return Math.round(score * 100);
  }
}
