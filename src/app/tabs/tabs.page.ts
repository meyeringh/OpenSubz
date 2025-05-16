import { Component } from '@angular/core';
import { addIcons } from "ionicons";
import { list, settings } from "ionicons/icons";

@Component({
    selector: 'app-tabs',
    templateUrl: 'tabs.page.html',
    styleUrls: ['tabs.page.scss'],
    standalone: false
})
export class TabsPage {

    constructor() {
        addIcons({
            'list':     list,
            'settings': settings
        });
    }

}
