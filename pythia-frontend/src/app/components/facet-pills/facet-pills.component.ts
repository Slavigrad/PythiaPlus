import { Component, input, inject, ChangeDetectionStrategy, computed } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FacetGroup } from '../../models/facet.model';
import { SearchService } from '../../services/search.service';

/**
 * Facet Pills Component
 *
 * Purpose: Display faceted search filters as clickable pill buttons
 * Features: Quick filters (locations, availabilities, technologies, skills, certifications)
 * Design: Pill buttons with counts, active state highlighting, clear filters button
 */
@Component({
  selector: 'app-facet-pills',
  imports: [MatChipsModule, MatIconModule, MatButtonModule],
  templateUrl: './facet-pills.component.html',
  styleUrl: './facet-pills.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FacetPillsComponent {
  protected readonly searchService = inject(SearchService);

  // Signal inputs
  readonly facets = input<FacetGroup | null>(null);

  // Computed signals for top facets (limit display)
  protected readonly topLocations = computed(() =>
    this.facets()?.locations?.slice(0, 5) || []
  );
  protected readonly topAvailabilities = computed(() =>
    this.facets()?.availabilities || []
  );
  protected readonly topTechnologies = computed(() =>
    this.facets()?.technologies?.slice(0, 10) || []
  );
  protected readonly topSkills = computed(() =>
    this.facets()?.skills?.slice(0, 8) || []
  );

  // Check if a filter is active
  protected isLocationActive(value: string): boolean {
    return this.searchService.activeFilters().location === value;
  }

  protected isAvailabilityActive(value: string): boolean {
    return this.searchService.activeFilters().availability === value;
  }

  protected isTechnologyActive(value: string): boolean {
    return this.searchService.activeFilters().technologies?.includes(value) || false;
  }

  protected isSkillActive(value: string): boolean {
    return this.searchService.activeFilters().skills?.includes(value) || false;
  }

  // Toggle filters
  protected toggleLocation(value: string): void {
    this.searchService.toggleFilter('location', value);
  }

  protected toggleAvailability(value: string): void {
    this.searchService.toggleFilter('availability', value);
  }

  protected toggleTechnology(value: string): void {
    this.searchService.toggleFilter('technologies', value);
  }

  protected toggleSkill(value: string): void {
    this.searchService.toggleFilter('skills', value);
  }

  protected clearAllFilters(): void {
    this.searchService.clearFilters();
  }

  // Availability icon mapping
  protected getAvailabilityIcon(value: string): string {
    if (value.toLowerCase().includes('available')) return 'check_circle';
    if (value.toLowerCase().includes('notice')) return 'schedule';
    return 'block';
  }

  // Availability color mapping
  protected getAvailabilityColor(value: string): string {
    if (value.toLowerCase().includes('available')) return 'success';
    if (value.toLowerCase().includes('notice')) return 'warning';
    return 'neutral';
  }
}
