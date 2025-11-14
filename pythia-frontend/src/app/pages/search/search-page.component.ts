import { Component, signal, inject } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchOptionsComponent } from '../../components/search-options/search-options.component';
import { CandidateListComponent } from '../../components/candidate-list/candidate-list.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

/**
 * Search Page Component
 *
 * Purpose: Main search interface for Pythia+
 * Features: Search bar, advanced options, results display, empty state
 */
@Component({
  selector: 'app-search-page',
  imports: [SearchBarComponent, SearchOptionsComponent, CandidateListComponent, EmptyStateComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css'
})
export class SearchPageComponent {
  protected readonly searchService = inject(SearchService);
}
