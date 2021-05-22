import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  version: string;

  constructor(
    private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        App.getInfo().then(appInfo => {
          this.version = appInfo.version;
        });
      }
      else if (this.platform.is('mobileweb')) {
        // Don't show version
      }
    });
  }

}
