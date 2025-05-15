import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicRouteStrategy, provideIonicAngular, IonApp, IonRouterOutlet } from '@ionic/angular/standalone';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotificationService } from './Services/notification.service';
import { PreferencesService } from './Services/preferences.service';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NextCancelationPeriodDeadlinePipe } from './tab-overview/Pipes/next-cancelation-period-deadline.pipe';
import { NotificationTimeForNextCancelationPeriodDeadlinePipe } from './tab-overview/Pipes/notification-time-for-next-cancelation-period-deadline.pipe';
import { TabHideService } from './Services/tab-hide.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(httpClient);
}

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent], imports: [BrowserModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        }),
        AppRoutingModule,
        IonApp,
        IonRouterOutlet
    ], providers: [
        NotificationService,
        PreferencesService,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        NextCancelationPeriodDeadlinePipe,
        NotificationTimeForNextCancelationPeriodDeadlinePipe,
        TabHideService,
        provideHttpClient(withInterceptorsFromDi()),
        provideIonicAngular()
    ]
})
export class AppModule { }
