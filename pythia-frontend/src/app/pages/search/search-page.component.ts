import { Component, signal, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { SearchService } from '../../services/search.service';
import { ComparisonService } from '../../services/comparison.service';
import { ExportService } from '../../services/export.service';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { SearchOptionsComponent } from '../../components/search-options/search-options.component';
import { CandidateListComponent } from '../../components/candidate-list/candidate-list.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { FacetPillsComponent } from '../../components/facet-pills/facet-pills.component';
import { StatsSummaryComponent } from '../../components/stats-summary/stats-summary.component';
import { ComparisonToolbarComponent } from '../../components/comparison-toolbar/comparison-toolbar.component';

/**
 * Search Page Component
 *
 * Purpose: Main search interface for Pythia+ with faceted search, candidate comparison, and export
 * Features: Search bar, facet filters, stats summary, advanced options, results display,
 *           URL persistence, candidate navigation, multi-candidate comparison, CSV/JSON export
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
    ComparisonToolbarComponent,
    MatRippleModule
  ],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchPageComponent implements OnInit {
  protected readonly searchService = inject(SearchService);
  protected readonly comparisonService = inject(ComparisonService);
  protected readonly exportService = inject(ExportService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

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

  /**
   * Handle candidate selection
   * Navigates to the employee profile page while preserving search query params
   *
   * This allows the user to click "back" and return to the same search results
   * without having to search again.
   */
  protected handleCandidateSelected(candidateId: string): void {
    // Preserve current query params so "back" button returns to this search
    const currentParams = this.route.snapshot.queryParams;

    this.router.navigate(['/employees', candidateId], {
      queryParams: currentParams
    });
  }

  /**
   * Handle selection toggle from candidate cards
   * Toggles the selection state in the comparison service
   */
  protected handleSelectionToggle(candidateId: string): void {
    this.comparisonService.toggleSelection(candidateId);
  }

  /**
   * Handle compare button click
   * Opens the comparison modal with selected candidates
   */
  protected async handleCompare(): Promise<void> {
    await this.comparisonService.openComparison();
    // Comparison modal will be implemented in Phase 2
    // For now, this loads the profiles and sets isComparing to true
  }

  /**
   * Handle export format selection
   * Exports selected candidates to CSV or JSON
   */
  protected handleExport(format: 'csv' | 'json'): void {
    const selectedIds = this.comparisonService.selectedIdsArray();
    const selectedCandidates = this.searchService.searchResults().filter(c =>
      selectedIds.includes(c.id)
    );

    if (selectedCandidates.length === 0) {
      console.warn('No candidates selected for export');
      return;
    }

    try {
      if (format === 'csv') {
        this.exportService.exportToCSV(selectedCandidates);
      } else if (format === 'json') {
        this.exportService.exportToJSON(selectedCandidates);
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Could show a snackbar notification here
    }
  }

  /**
   * Handle clear selections button click
   * Clears all selected candidates
   */
  protected handleClearSelections(): void {
    this.comparisonService.clearSelections();
  }
}
