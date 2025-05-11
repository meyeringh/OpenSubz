import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabSettingsPage } from './tab-settings.page';

import { TabSettingsPageRoutingModule } from './tab-settings-routing.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonIcon, IonLabel } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        TabSettingsPageRoutingModule,
        FormsModule,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonContent,
        IonList,
        IonItem,
        IonIcon,
        IonLabel
    ],
    declarations: [TabSettingsPage]
})
export class TabSettingsPageModule { }
