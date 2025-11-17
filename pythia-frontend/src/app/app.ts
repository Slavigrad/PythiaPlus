import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

/**
 * Root Application Component for Pythia+
 *
 * Purpose: Main application shell with header and routing
 * Features: Pythia+ branding, sticky header, responsive layout, navigation
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  // Root component - no local state needed
  // All state management handled by feature components and services
}
