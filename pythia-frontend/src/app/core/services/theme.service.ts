/**
 * Theme Service - Pythia+ Ultra Premium
 *
 * Manages application theme (light/dark mode)
 * Features:
 * - Smooth theme transitions
 * - LocalStorage persistence
 * - System preference detection
 * - Signal-based reactivity
 */

import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private readonly STORAGE_KEY = 'pythia-theme';

  // Signals
  readonly theme = signal<Theme>('auto');
  readonly isDarkMode = signal(false);

  constructor() {
    if (this.isBrowser) {
      this.initializeTheme();
      this.setupEffects();
      this.listenToSystemPreference();
    }
  }

  private initializeTheme(): void {
    // Load from localStorage or default to 'auto'
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme;
    if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
      this.theme.set(savedTheme);
    }

    // Calculate initial dark mode state
    this.updateDarkMode();
  }

  private setupEffects(): void {
    // Effect: Apply theme when it changes
    effect(() => {
      const currentTheme = this.theme();
      this.updateDarkMode();

      // Save to localStorage
      localStorage.setItem(this.STORAGE_KEY, currentTheme);
    });

    // Effect: Apply CSS class when dark mode changes
    effect(() => {
      const isDark = this.isDarkMode();
      this.applyThemeClass(isDark);
    });
  }

  private updateDarkMode(): void {
    const currentTheme = this.theme();

    if (currentTheme === 'dark') {
      this.isDarkMode.set(true);
    } else if (currentTheme === 'light') {
      this.isDarkMode.set(false);
    } else {
      // Auto mode: detect system preference
      this.isDarkMode.set(this.getSystemPreference());
    }
  }

  private getSystemPreference(): boolean {
    if (!this.isBrowser) return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private listenToSystemPreference(): void {
    if (!this.isBrowser) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    mediaQuery.addEventListener('change', (e) => {
      if (this.theme() === 'auto') {
        this.isDarkMode.set(e.matches);
      }
    });
  }

  private applyThemeClass(isDark: boolean): void {
    if (!this.isBrowser) return;

    const html = document.documentElement;

    // Add transition class for smooth switching
    html.classList.add('theme-transition');

    if (isDark) {
      html.classList.add('dark-theme');
      html.classList.remove('light-theme');
    } else {
      html.classList.add('light-theme');
      html.classList.remove('dark-theme');
    }

    // Remove transition class after animation
    setTimeout(() => {
      html.classList.remove('theme-transition');
    }, 300);
  }

  // Public API
  setTheme(theme: Theme): void {
    this.theme.set(theme);
  }

  toggleTheme(): void {
    const current = this.theme();
    if (current === 'light') {
      this.setTheme('dark');
    } else if (current === 'dark') {
      this.setTheme('auto');
    } else {
      this.setTheme('light');
    }
  }

  getThemeIcon(): string {
    const theme = this.theme();
    if (theme === 'light') return 'light_mode';
    if (theme === 'dark') return 'dark_mode';
    return 'brightness_auto';
  }

  getThemeLabel(): string {
    const theme = this.theme();
    if (theme === 'light') return 'Light Mode';
    if (theme === 'dark') return 'Dark Mode';
    return 'Auto (System)';
  }
}
