import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NextcloudPageRoutingModule } from './nextcloud-routing.module';

import { NextcloudPage } from './nextcloud.page';
import { TranslateModule } from '@ngx-translate/core';
import {
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonIcon,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonInput,
    IonNote,
    IonSpinner
} from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        NextcloudPageRoutingModule,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonButton,
        IonIcon,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonLabel,
        IonInput,
        IonNote,
        IonSpinner
    ],
    declarations: [NextcloudPage]
})
export class NextcloudPageModule { }
