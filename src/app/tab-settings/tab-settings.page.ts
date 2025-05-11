import { Component } from '@angular/core';
import { addIcons } from "ionicons";
import { easel, globe, documents, documentText, informationCircle } from "ionicons/icons";
import { IonRouterLink } from "@ionic/angular/standalone";

@Component({
    selector: 'app-tab-settings',
    templateUrl: 'tab-settings.page.html',
    styleUrls: ['tab-settings.page.scss']
})
export class TabSettingsPage {

    constructor() {
        addIcons({ easel, globe, documents, documentText, informationCircle });
    }

}
