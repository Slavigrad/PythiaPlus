import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService } from './core/services/theme.service';

/**
 * Root Application Component for Pythia+
 *
 * Purpose: Main application shell with header and routing
 * Features: Pythia+ branding, sticky header, responsive layout, navigation, global dark mode toggle
 */
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  /**
   * Theme service for global dark/light mode management
   * Accessible from all pages via header toggle
   */
  protected readonly themeService = inject(ThemeService);
}
