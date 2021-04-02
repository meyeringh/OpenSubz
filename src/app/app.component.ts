import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import { TabHideService } from './Services/tab-hide.service';
import { ActivatedRoute, Router } from '@angular/router';

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
    private router: Router,
    private route: ActivatedRoute
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
    // Register all suported locales other than english (en)
    registerLocaleData(localeDe);

    this.translateService.setDefaultLang('en');
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang.match(/en|de/) ? browserLang : 'en');
  }
}
