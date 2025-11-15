import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { SearchService } from '../../services/search.service';

/**
 * Stats Summary Component
 *
 * Purpose: Display search results statistics summary
 * Features: Total results, showing count, average match score, active filters
 * Design: Horizontal stat cards with icons and labels
 */
@Component({
  selector: 'app-stats-summary',
  imports: [MatIconModule],
  templateUrl: './stats-summary.component.html',
  styleUrl: './stats-summary.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatsSummaryComponent {
  protected readonly searchService = inject(SearchService);
}
