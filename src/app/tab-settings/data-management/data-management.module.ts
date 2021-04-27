import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DataManagementPageRoutingModule } from './data-management-routing.module';

import { DataManagementPage } from './data-management.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DataManagementPageRoutingModule,
    TranslateModule
  ],
  declarations: [DataManagementPage]
})
export class DataManagementPageModule {}
