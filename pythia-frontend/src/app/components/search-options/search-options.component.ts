import { Component, signal, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../services/search.service';

/**
 * Search Options Component
 *
 * Purpose: Advanced search controls (topK, minScore)
 * Features: Collapsible panel, dropdown, slider with visual zones
 */
@Component({
  selector: 'app-search-options',
  imports: [FormsModule],
  templateUrl: './search-options.component.html',
  styleUrl: './search-options.component.css'
})
export class SearchOptionsComponent {
  private readonly searchService = inject(SearchService);

  // UI state
  protected readonly isExpanded = signal(false);

  // Search parameters
  protected readonly topK = signal(10);
  protected readonly minScore = signal(0.7);

  // TopK options
  protected readonly topKOptions = [
    { value: 5, label: 'Top 5 matches' },
    { value: 10, label: 'Top 10 matches' },
    { value: 20, label: 'Top 20 matches' },
    { value: 50, label: 'All matches (50)' }
  ];

  constructor() {
    // Trigger search when parameters change
    effect(() => {
      const query = this.searchService.lastQuery();
      const currentTopK = this.topK();
      const currentMinScore = this.minScore();

      // Only search if we have a query
      if (query && query.length >= 3) {
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
    if (score >= 0.85) return 'Only excellent';
    if (score >= 0.70) return 'Good matches';
    return 'Cast a wide net';
  }

  protected getScorePercentage(score: number): number {
    return Math.round(score * 100);
  }
}
