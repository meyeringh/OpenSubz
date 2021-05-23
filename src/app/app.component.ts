import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';
import localeNb from '@angular/common/locales/nb';
import localeRu from '@angular/common/locales/ru';
import { TabHideService } from './Services/tab-hide.service';
import { Router } from '@angular/router';
import { ThemeService } from './Services/theme.service';
import { NotificationService } from './Services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private translateService: TranslateService,
    public tabHideService: TabHideService,
    private router: Router,
    public notificationService: NotificationService,
    public themeService: ThemeService,
  ) { this.initializeApp(); }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setupInternationalisation().subscribe(() => { this.notificationService.scheduleNotifications(); });
      this.themeService.applyTheme();

      this.platform.backButton.subscribeWithPriority(0, () => {
        const url = this.router.url;

        if (url === '/tabs/overview' || url === '/tabs/settings') {
          navigator['app'].exitApp();
        } else if (url === '/tabs/settings/ui'
          || url === '/tabs/settings/region'
          || url === '/tabs/settings/data-management'
          || url === '/tabs/settings/license'
          || url === '/tabs/settings/about') {
          this.router.navigate(['/tabs/settings']);
        }
      });
    });
  }

  setupInternationalisation(): Observable<any> {
    this.translateService.setDefaultLang('en');
    const browserLang = this.translateService.getBrowserLang();

    // Register locales in order for built in pipes to work
    switch (browserLang) {
      case 'de': {
        registerLocaleData(localeDe);
        return this.translateService.use('de');
      }
      case 'fr': {
        registerLocaleData(localeFr);
        return this.translateService.use('fr');
      }
      case 'it': {
        registerLocaleData(localeIt);
        return this.translateService.use('it');
      }
      case 'nb': {
        registerLocaleData(localeNb);
        return this.translateService.use('nb_NO');
      }
      case 'ru': {
        registerLocaleData(localeRu);
        return this.translateService.use('ru');
      }
      default: {
        return this.translateService.use('en');
      }
    }
  }

}
