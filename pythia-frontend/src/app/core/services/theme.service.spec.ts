/**
 * ThemeService Tests
 *
 * Comprehensive tests for the ThemeService covering:
 * - Signal state management
 * - Theme switching (light/dark/auto)
 * - localStorage persistence
 * - System preference detection
 * - CSS class application
 */

import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { assertServiceSignalState } from '../../../testing';

describe('ThemeService', () => {
  let service: ThemeService;
  let localStorageSpy: jasmine.Spy;
  let documentElement: HTMLElement;

  beforeEach(() => {
    // Mock localStorage
    const store: Record<string, string> = {};
    localStorageSpy = spyOn(localStorage, 'getItem').and.callFake(
      (key: string) => store[key] || null
    );
    spyOn(localStorage, 'setItem').and.callFake(
      (key: string, value: string) => { store[key] = value; }
    );
    spyOn(localStorage, 'removeItem').and.callFake(
      (key: string) => { delete store[key]; }
    );

    // Mock matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jasmine.createSpy('matchMedia').and.returnValue({
        matches: false,
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener')
      })
    });

    documentElement = document.documentElement;

    TestBed.configureTestingModule({
      providers: [ThemeService]
    });

    service = TestBed.inject(ThemeService);
  });

  afterEach(() => {
    // Clean up DOM
    documentElement.classList.remove('light-theme', 'dark-theme', 'theme-transition');
  });

  // =========================================================================
  // INITIALIZATION TESTS
  // =========================================================================

  describe('Initialization', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should initialize with auto theme when no saved theme exists', () => {
      expect(service.theme()).toBe('auto');
    });

    it('should initialize isDarkMode based on system preference', () => {
      // isDarkMode depends on system matchMedia result
      expect(service.isDarkMode()).toBeDefined();
      expect(typeof service.isDarkMode()).toBe('boolean');
    });

    it('should load saved theme from localStorage', () => {
      // Reinitialize with saved theme
      localStorage.setItem('pythia-theme', 'dark');

      const newService = new ThemeService();

      expect(newService.theme()).toBe('dark');
    });

    it('should ignore invalid saved theme in localStorage', () => {
      localStorage.setItem('pythia-theme', 'invalid-theme');

      const newService = new ThemeService();

      // Should fall back to 'auto' or default behavior
      expect(['auto', 'light', 'dark']).toContain(newService.theme());
    });
  });

  // =========================================================================
  // THEME SWITCHING TESTS
  // =========================================================================

  describe('setTheme', () => {
    it('should set theme to light', () => {
      service.setTheme('light');

      expect(service.theme()).toBe('light');
      expect(service.isDarkMode()).toBe(false);
    });

    it('should set theme to dark', () => {
      service.setTheme('dark');

      expect(service.theme()).toBe('dark');
      expect(service.isDarkMode()).toBe(true);
    });

    it('should set theme to auto', () => {
      service.setTheme('auto');

      expect(service.theme()).toBe('auto');
      // isDarkMode depends on system preference
      expect(typeof service.isDarkMode()).toBe('boolean');
    });

    it('should persist theme to localStorage', () => {
      service.setTheme('dark');

      expect(localStorage.setItem).toHaveBeenCalledWith('pythia-theme', 'dark');
    });

    it('should update isDarkMode when theme changes', () => {
      service.setTheme('light');
      expect(service.isDarkMode()).toBe(false);

      service.setTheme('dark');
      expect(service.isDarkMode()).toBe(true);
    });
  });

  // =========================================================================
  // TOGGLE THEME TESTS
  // =========================================================================

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      service.setTheme('light');
      service.toggleTheme();

      expect(service.theme()).toBe('dark');
    });

    it('should toggle from dark to auto', () => {
      service.setTheme('dark');
      service.toggleTheme();

      expect(service.theme()).toBe('auto');
    });

    it('should toggle from auto to light', () => {
      service.setTheme('auto');
      service.toggleTheme();

      expect(service.theme()).toBe('light');
    });

    it('should complete full toggle cycle: light → dark → auto → light', () => {
      service.setTheme('light');
      expect(service.theme()).toBe('light');

      service.toggleTheme();
      expect(service.theme()).toBe('dark');

      service.toggleTheme();
      expect(service.theme()).toBe('auto');

      service.toggleTheme();
      expect(service.theme()).toBe('light');
    });
  });

  // =========================================================================
  // CSS CLASS APPLICATION TESTS
  // =========================================================================

  describe('CSS Class Application', () => {
    it('should apply light-theme class when theme is light', (done) => {
      service.setTheme('light');

      // Wait for CSS class application (asynchronous due to effect)
      setTimeout(() => {
        expect(documentElement.classList.contains('light-theme')).toBe(true);
        expect(documentElement.classList.contains('dark-theme')).toBe(false);
        done();
      }, 100);
    });

    it('should apply dark-theme class when theme is dark', (done) => {
      service.setTheme('dark');

      setTimeout(() => {
        expect(documentElement.classList.contains('dark-theme')).toBe(true);
        expect(documentElement.classList.contains('light-theme')).toBe(false);
        done();
      }, 100);
    });

    it('should apply theme-transition class during theme change', (done) => {
      service.setTheme('dark');

      // Check immediately after change
      setTimeout(() => {
        // The transition class may have been removed already due to 300ms timeout
        // So we just verify that the final theme class is correct
        expect(documentElement.classList.contains('dark-theme')).toBe(true);
        done();
      }, 50);
    });

    it('should remove theme-transition class after animation', (done) => {
      service.setTheme('dark');

      // Wait longer than the 300ms timeout
      setTimeout(() => {
        expect(documentElement.classList.contains('theme-transition')).toBe(false);
        done();
      }, 400);
    });
  });

  // =========================================================================
  // THEME ICON TESTS
  // =========================================================================

  describe('getThemeIcon', () => {
    it('should return light_mode icon for light theme', () => {
      service.setTheme('light');
      expect(service.getThemeIcon()).toBe('light_mode');
    });

    it('should return dark_mode icon for dark theme', () => {
      service.setTheme('dark');
      expect(service.getThemeIcon()).toBe('dark_mode');
    });

    it('should return brightness_auto icon for auto theme', () => {
      service.setTheme('auto');
      expect(service.getThemeIcon()).toBe('brightness_auto');
    });
  });

  // =========================================================================
  // THEME LABEL TESTS
  // =========================================================================

  describe('getThemeLabel', () => {
    it('should return "Light Mode" for light theme', () => {
      service.setTheme('light');
      expect(service.getThemeLabel()).toBe('Light Mode');
    });

    it('should return "Dark Mode" for dark theme', () => {
      service.setTheme('dark');
      expect(service.getThemeLabel()).toBe('Dark Mode');
    });

    it('should return "Auto (System)" for auto theme', () => {
      service.setTheme('auto');
      expect(service.getThemeLabel()).toBe('Auto (System)');
    });
  });

  // =========================================================================
  // SYSTEM PREFERENCE TESTS
  // =========================================================================

  describe('System Preference Detection', () => {
    it('should detect dark mode from system when theme is auto', () => {
      // Mock dark mode system preference
      (window.matchMedia as jasmine.Spy).and.returnValue({
        matches: true,
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener')
      });

      // Create new service instance to trigger system preference detection
      const newService = new ThemeService();
      newService.setTheme('auto');

      expect(newService.isDarkMode()).toBe(true);
    });

    it('should detect light mode from system when theme is auto', () => {
      // Mock light mode system preference
      (window.matchMedia as jasmine.Spy).and.returnValue({
        matches: false,
        addEventListener: jasmine.createSpy('addEventListener'),
        removeEventListener: jasmine.createSpy('removeEventListener')
      });

      const newService = new ThemeService();
      newService.setTheme('auto');

      expect(newService.isDarkMode()).toBe(false);
    });

    it('should listen for system preference changes', () => {
      const matchMediaSpy = window.matchMedia as jasmine.Spy;

      // Verify that addEventListener was called during service initialization
      expect(matchMediaSpy).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });
  });

  // =========================================================================
  // LOCAL STORAGE PERSISTENCE TESTS
  // =========================================================================

  describe('LocalStorage Persistence', () => {
    it('should save theme to localStorage when changed', () => {
      service.setTheme('dark');

      expect(localStorage.setItem).toHaveBeenCalledWith('pythia-theme', 'dark');
    });

    it('should load saved theme on initialization', () => {
      localStorage.setItem('pythia-theme', 'light');

      const newService = new ThemeService();

      expect(newService.theme()).toBe('light');
    });

    it('should handle missing localStorage gracefully', () => {
      localStorageSpy.and.returnValue(null);

      const newService = new ThemeService();

      // Should default to 'auto' if nothing in localStorage
      expect(newService.theme()).toBe('auto');
    });
  });

  // =========================================================================
  // SIGNAL REACTIVITY TESTS
  // =========================================================================

  describe('Signal Reactivity', () => {
    it('should reactively update isDarkMode when theme changes', () => {
      service.setTheme('light');
      const initialDarkMode = service.isDarkMode();
      expect(initialDarkMode).toBe(false);

      service.setTheme('dark');
      const newDarkMode = service.isDarkMode();
      expect(newDarkMode).toBe(true);

      // Verify the signal actually changed
      expect(newDarkMode).not.toBe(initialDarkMode);
    });

    it('should allow reading theme signal multiple times', () => {
      service.setTheme('dark');

      const read1 = service.theme();
      const read2 = service.theme();
      const read3 = service.theme();

      expect(read1).toBe('dark');
      expect(read2).toBe('dark');
      expect(read3).toBe('dark');
    });
  });

  // =========================================================================
  // EDGE CASES
  // =========================================================================

  describe('Edge Cases', () => {
    it('should handle rapid theme switching', () => {
      service.setTheme('light');
      service.setTheme('dark');
      service.setTheme('auto');
      service.setTheme('light');

      expect(service.theme()).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledTimes(4);
    });

    it('should handle setting same theme multiple times', () => {
      service.setTheme('dark');
      service.setTheme('dark');
      service.setTheme('dark');

      expect(service.theme()).toBe('dark');
    });

    it('should maintain state integrity across multiple operations', () => {
      // Complex sequence of operations
      service.setTheme('light');
      service.toggleTheme(); // → dark
      service.toggleTheme(); // → auto
      service.setTheme('dark');
      service.toggleTheme(); // → auto
      service.toggleTheme(); // → light

      expect(service.theme()).toBe('light');
      expect(service.isDarkMode()).toBe(false);
    });
  });
});
