import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeFr from '@angular/common/locales/fr';
import localeIt from '@angular/common/locales/it';
import localeNb from '@angular/common/locales/nb';
import localeRu from '@angular/common/locales/ru';
import { TabHideService } from './Services/tab-hide.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateService: TranslateService,
    public tabHideService: TabHideService,
    private router: Router
  ) {
    this.setupInternationalisation();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.platform.backButton.subscribeWithPriority(0, () => {
        const url = this.router.url;

        if (url === '/tabs/overview' || url === '/tabs/settings') {
          navigator['app'].exitApp();
        } else if (url === '/tabs/settings/ui' || url === '/tabs/settings/region' || url === '/tabs/settings/data-management' || url === '/tabs/settings/license' || url === '/tabs/settings/about') {
          this.router.navigate(['/tabs/settings']);
        }
      });
    });
  }

  setupInternationalisation() {
    this.translateService.setDefaultLang('en');
    const browserLang = this.translateService.getBrowserLang();

    // Register locales in order for built in pipes to work
    switch(browserLang) { 
      case 'de': { 
        registerLocaleData(localeDe);
        this.translateService.use('de');
        break; 
      }
      case 'fr': { 
        registerLocaleData(localeFr);
        this.translateService.use('fr');
        break; 
      }
      case 'it': { 
        registerLocaleData(localeIt);
        this.translateService.use('it');
        break; 
      }
      case 'nb': { 
        registerLocaleData(localeNb);
        this.translateService.use('nb_NO');
        break; 
      }
      case 'ru': { 
        registerLocaleData(localeRu);
        this.translateService.use('ru');
        break; 
      }
      default: { 
        this.translateService.use('en');
        break; 
      }
    }
  }

}
