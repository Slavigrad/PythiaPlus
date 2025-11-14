import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Root Application Component for Pythia+
 *
 * Purpose: Main application shell with header and routing
 * Features: Pythia+ branding, sticky header, responsive layout
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  // Root component - no local state needed
  // All state management handled by feature components and services
}
