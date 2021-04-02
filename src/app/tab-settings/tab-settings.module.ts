import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TabSettingsPage } from './tab-settings.page';

import { TabSettingsPageRoutingModule } from './tab-settings-routing.module';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AppVersion } from '@ionic-native/app-version/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabSettingsPageRoutingModule,
    FormsModule,
    TranslateModule
  ],
  declarations: [TabSettingsPage],
  providers: [AppVersion]
})
export class TabSettingsPageModule {}
