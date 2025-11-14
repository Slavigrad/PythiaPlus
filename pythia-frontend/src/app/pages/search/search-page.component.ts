import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchOptionsComponent } from '../../components/search-options/search-options.component';
import { CandidateListComponent } from '../../components/candidate-list/candidate-list.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

/**
 * Search Page Component
 *
 * Purpose: Main search interface for Pythia+
 * Features: Search bar, advanced options, results display, empty state, URL persistence
 */
@Component({
  selector: 'app-search-page',
  imports: [SearchBarComponent, SearchOptionsComponent, CandidateListComponent, EmptyStateComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements OnInit {
  protected readonly searchService = inject(SearchService);
  private readonly route = inject(ActivatedRoute);

  // Signals for URL-driven state
  readonly urlQuery = signal<string>('');
  readonly urlTopK = signal<number>(10);
  readonly urlMinScore = signal<number>(0.7);

  ngOnInit(): void {
    // Read URL params and restore search state
    this.route.queryParams.subscribe(params => {
      const query = params['q'] || '';
      const topK = params['topK'] ? parseInt(params['topK'], 10) : 10;
      const minScore = params['minScore'] ? parseFloat(params['minScore']) : 0.7;

      // Update signals for child components
      this.urlQuery.set(query);
      this.urlTopK.set(topK);
      this.urlMinScore.set(minScore);

      // Restore search if query exists
      if (query && query.length >= 3) {
        this.searchService.search({ query, topK, minScore }, false);
      }
    });
  }
}
