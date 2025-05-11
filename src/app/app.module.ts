import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationService } from './Services/notification.service';
import { StorageService } from './Services/storage.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NextCancelationPeriodDeadlinePipe } from './tab-overview/Pipes/next-cancelation-period-deadline.pipe';
import { NotificationTimeForNextCancelationPeriodDeadlinePipe } from './tab-overview/Pipes/notification-time-for-next-cancelation-period-deadline.pipe';
import { TabHideService } from './Services/tab-hide.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        IonicModule.forRoot(),
        AppRoutingModule,
    ],
    providers: [
        NotificationService,
        StorageService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        NextCancelationPeriodDeadlinePipe,
        NotificationTimeForNextCancelationPeriodDeadlinePipe,
        TabHideService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
