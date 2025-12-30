import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    public preferencesService: PreferencesService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  applyTheme() {
    this.preferencesService.retrieveSettingsFromPreferences().then(settings => {
      const themePreference = settings.themePreference || 'system';

      // Remove all theme classes first
      this.document.body.classList.remove('dark', 'light');
      this.document.documentElement.classList.remove('dark', 'light');

      let shouldBeDark = false;
      let isManual = false;

      switch (themePreference) {
        case 'dark':
          shouldBeDark = true;
          isManual = true;
          break;
        case 'light':
          shouldBeDark = false;
          isManual = true;
          break;
        case 'system':
        default:
          // Check system preference using matchMedia
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          // Fallback: also check Android user agent string
          const androidDarkMode = window.navigator.userAgent.includes('AndroidDarkMode');
          shouldBeDark = prefersDark || androidDarkMode;
          isManual = false;
          break;
      }

      // Apply the theme class
      if (shouldBeDark) {
        this.document.body.classList.add('dark');
        this.document.documentElement.classList.add('dark');
      } else if (isManual) {
        // Only add 'light' class when manually set to light, not for system default
        this.document.body.classList.add('light');
        this.document.documentElement.classList.add('light');
      }

      // Update meta tag for better support
      const metaThemeColor = this.document.querySelector('meta[name="color-scheme"]');
      if (metaThemeColor) {
        if (themePreference === 'dark') {
          metaThemeColor.setAttribute('content', 'dark');
        } else if (themePreference === 'light') {
          metaThemeColor.setAttribute('content', 'light');
        } else {
          metaThemeColor.setAttribute('content', 'light dark');
        }
      }
    });
  }
}
