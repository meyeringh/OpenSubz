import { Component, Input } from '@angular/core';
import { ISubscription } from '../../Interfaces/subscriptionInterface';
import { ToastController } from '@ionic/angular';
import { DaysUntilNextBillingPipe } from '../../Pipes/days-until-next-billing.pipe';
import { DaysUntilNextCancelationPeriodDeadlinePipe } from '../../Pipes/days-until-next-cancelation-period-deadline.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.component.html',
  styleUrls: ['./subscription-card.component.scss'],
})
export class SubscriptionCardComponent {
  @Input() subscription: ISubscription;
  @Input() selectedBillingInterval: string;
  @Input() currency: string;

  constructor(
    public toastController: ToastController,
    public daysUntilNextBillingPipe: DaysUntilNextBillingPipe,
    public daysUntilNextCancelationPeriodDeadlinePipe: DaysUntilNextCancelationPeriodDeadlinePipe,
    public translateService: TranslateService) { }

  explainDaysUntilNextBilling(event: Event, subscription: ISubscription) {
    event.stopPropagation();

    this.translateService.get('TABS.OVERVIEW.DAYS_UNTIL_NEXT_BILLING_HELPER').subscribe(DAYS_UNTIL_NEXT_BILLING_HELPER => {
      this.toastMessage(this.daysUntilNextBillingPipe.transform(subscription) + ' ' + DAYS_UNTIL_NEXT_BILLING_HELPER);
    });
  }

  explainDaysUntilNextCancelationPeriodDeadline(event: Event, subscription: ISubscription) {
    event.stopPropagation();

    this.translateService.get('TABS.OVERVIEW.DAYS_UNTIL_NEXT_CANCELATION_PERIOD_DEADLINE_HELPER').subscribe(
      DAYS_UNTIL_NEXT_CANCELATION_PERIOD_DEADLINE_HELPER => {
      this.toastMessage(this.daysUntilNextCancelationPeriodDeadlinePipe.transform(
        subscription) + ' ' + DAYS_UNTIL_NEXT_CANCELATION_PERIOD_DEADLINE_HELPER);
    });
  }

  explainDaysUntilAlarmForNextCancelationPeriodDeadline(event: Event, subscription: ISubscription) {
    event.stopPropagation();

    this.translateService.get('TABS.OVERVIEW.NOTIFICATION_BEFORE_CANCELATION_PERIOD_ACTIVE').subscribe(
      NOTIFICATION_BEFORE_CANCELATION_PERIOD_ACTIVE => {
      this.toastMessage(NOTIFICATION_BEFORE_CANCELATION_PERIOD_ACTIVE);
    });
  }

  async toastMessage(helperText: string) {
    const toast = await this.toastController.create({
      cssClass: 'toast-center-text',
      message: helperText,
      duration: 3000
    });
    toast.present();
  }

}
