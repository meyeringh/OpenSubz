import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UiPageRoutingModule } from './ui-routing.module';

import { UiPage } from './ui.page';
import { TranslateModule } from '@ngx-translate/core';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonList, IonItem, IonLabel, IonNote, IonCheckbox, IonInput } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        UiPageRoutingModule,
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
        IonNote,
        IonCheckbox,
        IonInput
    ],
    declarations: [UiPage]
})
export class UiPageModule { }
