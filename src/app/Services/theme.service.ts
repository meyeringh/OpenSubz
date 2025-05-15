import { Injectable } from '@angular/core';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(public preferencesService: PreferencesService) { }

  applyTheme() {
    if (window.navigator.userAgent.includes('AndroidDarkMode')) {
      document.body.classList.add('dark');
    }

    this.preferencesService.retrieveSettingsFromPreferences().then(settings => {
      if (settings.hasOwnProperty('forceDarkMode')) {
        if (settings.forceDarkMode) {
          document.body.classList.add('dark');
        } else {
          if (window.navigator.userAgent.includes('AndroidDarkMode')) {
            document.body.classList.add('dark');
          } else {
            document.body.classList.remove('dark');
          }
        }
      }
    });
  }
}
