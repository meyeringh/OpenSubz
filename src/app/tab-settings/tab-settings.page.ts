import { Component } from '@angular/core';
import { addIcons } from "ionicons";
import { easel, globe, documents, documentText, informationCircle, cloud } from "ionicons/icons";
import { IonRouterLink } from "@ionic/angular/standalone";

@Component({
    selector: 'app-tab-settings',
    templateUrl: 'tab-settings.page.html',
    styleUrls: ['tab-settings.page.scss'],
    standalone: false
})
export class TabSettingsPage {

    constructor() {
        addIcons({
            'easel':              easel,
            'globe':              globe,
            'documents':          documents,
            'document-text':      documentText,
            'information-circle': informationCircle,
            'cloud':              cloud
        });
    }

}
