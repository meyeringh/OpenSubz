import { Injectable } from '@angular/core';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(public preferencesService: PreferencesService) { }

  applyTheme() {
    this.preferencesService.retrieveSettingsFromPreferences().then(settings => {
      const themePreference = settings.themePreference || 'system';

      switch (themePreference) {
        case 'dark':
          document.body.classList.add('dark');
          break;
        case 'light':
          document.body.classList.remove('dark');
          break;
        case 'system':
        default:
          if (window.navigator.userAgent.includes('AndroidDarkMode')) {
            document.body.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
          }
          break;
      }
    });
  }
}
