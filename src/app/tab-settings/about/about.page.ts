import { Component, OnInit } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  version: string;

  constructor(
    private platform: Platform,
    private appVersion: AppVersion
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.appVersion.getVersionNumber().then(appVersion => {
          this.version = appVersion;
        })
      }
      else if (this.platform.is('mobileweb')) {
        // Don't show version
      }
    });
  }

}
