import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UiPageRoutingModule } from './ui-routing.module';

import { UiPage } from './ui.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UiPageRoutingModule,
    TranslateModule
  ],
  declarations: [UiPage]
})
export class UiPageModule {}
