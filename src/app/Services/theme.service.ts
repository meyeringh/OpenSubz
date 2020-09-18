import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(public storageService: StorageService) { }

  setTheme() {
    this.storageService.retrieveSettingsFromStorage().then(settings => {
      if (settings.forceDarkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    });
  }
}
