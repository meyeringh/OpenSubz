import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabOverviewPage } from './tab-overview.page';
import { ModalAddSubscriptionComponent } from './Components/modal-add-subscription/modal-add-subscription.component';
import { SubscriptionCardComponent } from './Components/subscription-card/subscription-card.component';

import { TabOverviewPageRoutingModule } from './tab-overview-routing.module';

import { DaysUntilNextBillingPipe } from './Pipes/days-until-next-billing.pipe';
import { DaysUntilNextCancelationPeriodDeadlinePipe } from './Pipes/days-until-next-cancelation-period-deadline.pipe';
import { DaysUntilNotificationForNextCancelationPeriodDeadlinePipe } from './Pipes/days-until-notification-for-next-cancelation-period-deadline.pipe';
import { SearchSubscriptionsPipe } from './Pipes/search-subscriptions.pipe';
import { SortSubscriptionsPipe } from './Pipes/sort-subscriptions.pipe';
import { CostByBillingIntervalPipe } from './Pipes/cost-by-billing-interval.pipe';
import { TotalCostByBillingIntervalPipe } from './Pipes/total-cost-by-billing-interval.pipe';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TabOverviewPageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  declarations: [
    TabOverviewPage,
    ModalAddSubscriptionComponent,
    SubscriptionCardComponent,
    DaysUntilNextBillingPipe,
    DaysUntilNextCancelationPeriodDeadlinePipe,
    DaysUntilNotificationForNextCancelationPeriodDeadlinePipe,
    SearchSubscriptionsPipe,
    SortSubscriptionsPipe,
    CostByBillingIntervalPipe,
    TotalCostByBillingIntervalPipe
  ],
  entryComponents: [
    ModalAddSubscriptionComponent
  ],
  providers: [
    DaysUntilNextBillingPipe,
    DaysUntilNextCancelationPeriodDeadlinePipe,
    CostByBillingIntervalPipe
  ]
})
export class TabOverviewPageModule {}
