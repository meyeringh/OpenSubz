import { Component, OnInit } from '@angular/core';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular/standalone';
import { addIcons } from "ionicons";
import { arrowBack } from "ionicons/icons";
import { IonRouterLink } from "@ionic/angular/standalone";

@Component({
    selector: 'app-about',
    templateUrl: './about.page.html',
    styleUrls: ['./about.page.scss'],
    standalone: false
})
export class AboutPage implements OnInit {
    version: string;

    constructor(
        private platform: Platform
    ) {
        addIcons({ 'arrow-back': arrowBack });
    }

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
