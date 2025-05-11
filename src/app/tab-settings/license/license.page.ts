import { Component, OnInit } from '@angular/core';
import { licenseText } from './Helpers/mit-license-text';
import { addIcons } from "ionicons";
import { arrowBack } from "ionicons/icons";
import { IonRouterLink } from "@ionic/angular/standalone";

@Component({
    selector: 'app-license',
    templateUrl: './license.page.html',
    styleUrls: ['./license.page.scss'],
    standalone: false
})
export class LicensePage implements OnInit {
    licenseText = licenseText;

    constructor() {
        addIcons({ arrowBack });
    }

    ngOnInit() {
    }

}
