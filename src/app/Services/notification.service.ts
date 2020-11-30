import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { StorageService } from './storage.service';
import { ISubscription } from '../tab-overview/Interfaces/subscriptionInterface';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { NextCancelationPeriodDeadlinePipe } from '../tab-overview/Pipes/next-cancelation-period-deadline.pipe';

const { LocalNotifications } = Plugins;

// Gets triggered on entering the tab screen and persisting subscriptions
// Max. one scheduled notification for one subscription as they share the same id. Scheduled notifications with same id get overridden

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  subscriptions: ISubscription[];

  constructor(
    public storageService: StorageService,
    public translateService: TranslateService,
    private nextCancelationPeriodDeadlinePipe: NextCancelationPeriodDeadlinePipe) { }

  async scheduleNotifications() {
    this.subscriptions = await this.storageService.retrieveSubscriptionsFromStorage();
    if (this.subscriptions) {
      for (const subscription of this.subscriptions) {
        // Make a number out of it because empty attributes may saved as string
        const notificationBeforeCancelationPeriodInDays = Number(subscription.notificationBeforeCancelationPeriodInDays);

        const pendingNotifications = LocalNotifications.getPending();
        // console.log(((await pendingNotifications).notifications)[0].id);
        // Access all pending notifications, check whether each one should be there or delete it (if notificationBeforeCancelationPeriodInDays has been changed to empty after there has something already scheduled)

        // Next iteration if there shouldn't be any notification set for current subscription
        if (notificationBeforeCancelationPeriodInDays === null || notificationBeforeCancelationPeriodInDays === undefined || notificationBeforeCancelationPeriodInDays === 0) {
          continue;
        }

        const nextCancelationPeriodDeadlineDate = new DatePipe(this.translateService.currentLang).transform(this.nextCancelationPeriodDeadlinePipe.transform(subscription).dueDate);
        // const scheduleAt = new Date(nextCancelationPeriodDeadlineDate - notificationBeforeCancelationPeriodInDays * 1000 * 60 * 60 * 24);
        const scheduleAt = new Date(Date.now() + 1000 * 10);

        // If scheduleAt is in the past, don't schedule and go check next subscription
        if (scheduleAt < new Date()) { continue }

        const NOTIFICATION_TITLE = this.translateService.instant('NOTIFICATIONS.NOTIFICATION_TITLE');
        const NOTIFICATION_BODY = ((this.translateService.instant('NOTIFICATIONS.NOTIFICATION_BODY')).replace('$NAME$', subscription.name)).replace('$DATE$', nextCancelationPeriodDeadlineDate);

        await LocalNotifications.schedule({
          notifications: [
            {
              id: subscription.id,
              title: NOTIFICATION_TITLE,
              body: NOTIFICATION_BODY,
              schedule: { at: scheduleAt }
            }
          ]
        });
      }
    }
  }
}
