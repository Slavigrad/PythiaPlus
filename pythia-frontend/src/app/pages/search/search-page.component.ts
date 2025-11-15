import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { SearchService } from '../../services/search.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchOptionsComponent } from '../../components/search-options/search-options.component';
import { CandidateListComponent } from '../../components/candidate-list/candidate-list.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { FacetPillsComponent } from '../../components/facet-pills/facet-pills.component';
import { StatsSummaryComponent } from '../../components/stats-summary/stats-summary.component';

/**
 * Search Page Component
 *
 * Purpose: Main search interface for Pythia+ with faceted search
 * Features: Search bar, facet filters, stats summary, advanced options, results display, URL persistence
 */
@Component({
  selector: 'app-search-page',
  imports: [
    SearchBarComponent,
    SearchOptionsComponent,
    CandidateListComponent,
    EmptyStateComponent,
    FacetPillsComponent,
    StatsSummaryComponent,
    MatRippleModule
  ],
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
    // Read URL params and restore search state with filters
    this.route.queryParams.subscribe(params => {
      const query = params['q'] || '';
      const topK = params['topK'] ? parseInt(params['topK'], 10) : 10;
      const minScore = params['minScore'] ? parseFloat(params['minScore']) : 0.7;

      // Parse filter params
      const location = params['location'] || undefined;
      const availability = params['availability'] || undefined;
      const technologies = params['technologies'] ? params['technologies'].split(',') : undefined;
      const skills = params['skills'] ? params['skills'].split(',') : undefined;
      const certifications = params['certifications'] ? params['certifications'].split(',') : undefined;
      const minYearsExperience = params['minYears'] ? parseInt(params['minYears'], 10) : undefined;

      // Update signals for child components
      this.urlQuery.set(query);
      this.urlTopK.set(topK);
      this.urlMinScore.set(minScore);

      // Restore search if query exists
      if (query && query.length >= 3) {
        this.searchService.search({
          query,
          topK,
          minScore,
          location,
          availability,
          technologies,
          skills,
          certifications,
          minYearsExperience
        }, false);
      }
    });
  }
}
