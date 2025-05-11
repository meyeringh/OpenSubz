import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabOverviewPage } from './tab-overview.page';
import { ModalAddSubscriptionComponent } from './Components/modal-add-subscription/modal-add-subscription.component';
import { SubscriptionCardComponent } from './Components/subscription-card/subscription-card.component';

import { TabOverviewPageRoutingModule } from './tab-overview-routing.module';

import { NextBillingPipe } from './Pipes/next-billing.pipe';
import { NextCancelationPeriodDeadlinePipe } from './Pipes/next-cancelation-period-deadline.pipe';
import { NotificationTimeForNextCancelationPeriodDeadlinePipe } from './Pipes/notification-time-for-next-cancelation-period-deadline.pipe';
import { SearchSubscriptionsPipe } from './Pipes/search-subscriptions.pipe';
import { SortSubscriptionsPipe } from './Pipes/sort-subscriptions.pipe';
import { CostByBillingIntervalPipe } from './Pipes/cost-by-billing-interval.pipe';
import { TotalCostByBillingIntervalPipe } from './Pipes/total-cost-by-billing-interval.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonCard, IonCardContent, IonSearchbar, IonItem, IonLabel, IonGrid, IonRow, IonCol, IonFabButton, IonList, IonListHeader, IonInput, IonSelect, IonSelectOption, IonDatetime, IonChip } from "@ionic/angular/standalone";

@NgModule({
    imports: [
        CommonModule,
        TabOverviewPageRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        IonHeader,
        IonToolbar,
        IonTitle,
        IonButtons,
        IonButton,
        IonIcon,
        IonContent,
        IonCard,
        IonCardContent,
        IonSearchbar,
        IonItem,
        IonLabel,
        IonGrid,
        IonRow,
        IonCol,
        IonFabButton,
        IonHeader,
        IonToolbar,
        IonButtons,
        IonButton,
        IonIcon,
        IonTitle,
        IonContent,
        IonList,
        IonListHeader,
        IonItem,
        IonLabel,
        IonInput,
        IonSelect,
        IonSelectOption,
        IonDatetime,
        IonGrid,
        IonRow,
        IonCol,
        IonCard,
        IonCardContent,
        IonGrid,
        IonRow,
        IonCol,
        IonChip,
        IonIcon,
        IonLabel
    ],
    declarations: [
        TabOverviewPage,
        ModalAddSubscriptionComponent,
        SubscriptionCardComponent,
        NextBillingPipe,
        NextCancelationPeriodDeadlinePipe,
        NotificationTimeForNextCancelationPeriodDeadlinePipe,
        SearchSubscriptionsPipe,
        SortSubscriptionsPipe,
        CostByBillingIntervalPipe,
        TotalCostByBillingIntervalPipe
    ],
    providers: [
        NextBillingPipe,
        NextCancelationPeriodDeadlinePipe,
        CostByBillingIntervalPipe,
        NotificationTimeForNextCancelationPeriodDeadlinePipe
    ]
})
export class TabOverviewPageModule { }
