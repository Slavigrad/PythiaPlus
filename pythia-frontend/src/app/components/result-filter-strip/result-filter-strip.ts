import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  inject,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { Candidate } from '../../models/candidate.model';
import { SearchService } from '../../services/search';
import { InternalFilters } from '../../models/internal-filters.model';

/**
 * Quick Filter Chip
 * Represents a filterable item extracted from search results
 */
interface QuickFilterChip {
  label: string;
  value: string;
  category: 'technology' | 'skill' | 'certification';
  count: number;
  active: boolean;
}

/**
 * Result Filter Strip Component
 *
 * A visionary control center for refining search results in-memory
 * Features:
 *  - Expandable panel (default: collapsed)
 *  - Internal search input (searches within loaded results)
 *  - Quick filter chips (technologies, skills, certifications)
 *  - Multi-select combination filters
 *  - Instant client-side filtering (no backend calls)
 *  - Clear all filters functionality
 *
 * This component provides a legendary UX for narrowing down candidates
 * with lightning-fast, satisfying interactions.
 */
@Component({
  selector: 'app-result-filter-strip',
  imports: [CommonModule, FormsModule, MatRippleModule],
  templateUrl: './result-filter-strip.html',
  styleUrl: './result-filter-strip.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResultFilterStripComponent {
  protected readonly searchService = inject(SearchService);

  // Signal state
  protected readonly isExpanded = signal<boolean>(false);
  protected readonly internalSearchText = signal<string>('');

  // Computed signals from service
  protected readonly totalResults = this.searchService.totalResultCount;
  protected readonly filteredCount = this.searchService.resultCount;
  protected readonly hasInternalFilters = this.searchService.hasInternalFilters;
  protected readonly internalFilters = this.searchService.internalFilters;

  // Computed: result count message
  protected readonly resultMessage = computed(() => {
    const total = this.totalResults();
    const filtered = this.filteredCount();

    if (this.hasInternalFilters()) {
      return `${filtered} of ${total} candidates match`;
    }

    return `${total} candidate${total === 1 ? '' : 's'} found`;
  });

  // Computed: quick filter chips generated from current results
  protected readonly technologyChips = computed(() =>
    this.generateChips('technology')
  );
  protected readonly skillChips = computed(() =>
    this.generateChips('skill')
  );
  protected readonly certificationChips = computed(() =>
    this.generateChips('certification')
  );

  // Computed: has any chips available
  protected readonly hasChips = computed(() =>
    this.technologyChips().length > 0 ||
    this.skillChips().length > 0 ||
    this.certificationChips().length > 0
  );

  // Computed: active filter count
  protected readonly activeFilterCount = computed(() => {
    const filters = this.internalFilters();
    let count = 0;
    if (filters.searchText.trim() !== '') count++;
    count += filters.technologies.length;
    count += filters.skills.length;
    count += filters.certifications.length;
    return count;
  });

  constructor() {
    // Sync internal search text with service (debounced via effect)
    effect(() => {
      const searchText = this.internalSearchText();
      // Debounce is handled by the effect's cleanup
      const timeout = setTimeout(() => {
        this.searchService.updateInternalSearchText(searchText);
      }, 300);

      return () => clearTimeout(timeout);
    });
  }

  /**
   * Toggle expansion state
   */
  protected toggleExpanded(): void {
    this.isExpanded.update(expanded => !expanded);
  }

  /**
   * Toggle a technology filter chip
   */
  protected toggleTechnology(technology: string): void {
    this.searchService.toggleTechnologyFilter(technology);
  }

  /**
   * Toggle a skill filter chip
   */
  protected toggleSkill(skill: string): void {
    this.searchService.toggleSkillFilter(skill);
  }

  /**
   * Toggle a certification filter chip
   */
  protected toggleCertification(certification: string): void {
    this.searchService.toggleCertificationFilter(certification);
  }

  /**
   * Clear all internal filters
   */
  protected clearAllFilters(): void {
    this.internalSearchText.set('');
    this.searchService.clearInternalFilters();
  }

  /**
   * Generate quick filter chips from search results
   * Extracts unique values and counts occurrences
   */
  private generateChips(category: 'technology' | 'skill' | 'certification'): QuickFilterChip[] {
    const results = this.searchService.searchResults();
    const filters = this.internalFilters();

    // Map category to candidate field
    const fieldMap = {
      'technology': 'technologies',
      'skill': 'skills',
      'certification': 'certifications'
    } as const;

    const field = fieldMap[category];
    const activeFilters = filters[field === 'technologies' ? 'technologies' :
                                   field === 'skills' ? 'skills' : 'certifications'];

    // Count occurrences
    const countMap = new Map<string, number>();

    results.forEach(candidate => {
      const values = candidate[field] || [];
      values.forEach(value => {
        countMap.set(value, (countMap.get(value) || 0) + 1);
      });
    });

    // Convert to chips and sort by count
    const chips: QuickFilterChip[] = Array.from(countMap.entries())
      .map(([value, count]) => ({
        label: value,
        value,
        category,
        count,
        active: activeFilters.includes(value)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15); // Limit to top 15

    return chips;
  }

  /**
   * Check if a chip is active
   */
  protected isChipActive(chip: QuickFilterChip): boolean {
    return chip.active;
  }

  /**
   * Get chip category label
   */
  protected getCategoryLabel(category: 'technology' | 'skill' | 'certification'): string {
    const labels = {
      'technology': 'Technologies',
      'skill': 'Skills',
      'certification': 'Certifications'
    };
    return labels[category];
  }
}
