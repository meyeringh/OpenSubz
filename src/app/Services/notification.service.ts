import { Injectable } from '@angular/core';
import { LocalNotification, LocalNotificationPendingList, Plugins } from '@capacitor/core';
import { StorageService } from './storage.service';
import { ISubscription } from '../tab-overview/Interfaces/subscriptionInterface';
import { TranslateService } from '@ngx-translate/core';
import { NextCancelationPeriodDeadlinePipe } from '../tab-overview/Pipes/next-cancelation-period-deadline.pipe';
import { NotificationTimeForNextCancelationPeriodDeadlinePipe } from '../tab-overview/Pipes/notification-time-for-next-cancelation-period-deadline.pipe';

const { LocalNotifications } = Plugins;

// Gets triggered on entering the tab screen and persisting subscriptions
// Max. one scheduled notification for one subscription as they share the same id. Scheduled notifications with same id get overridden

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  subscriptions: ISubscription[];

  constructor(
    private storageService: StorageService,
    private translateService: TranslateService,
    private nextCancelationPeriodDeadlinePipe: NextCancelationPeriodDeadlinePipe,
    private notificationTimeForNextCancelationPeriodDeadline: NotificationTimeForNextCancelationPeriodDeadlinePipe) { }

  async scheduleNotifications() {
    this.subscriptions = await this.storageService.retrieveSubscriptionsFromStorage();
    if (this.subscriptions) {

      LocalNotifications.getPending().then(pending => {
        //
        // PART 1: DELETE PENDING NOTIFICATION IF THERE ARE NO CORRESPONDING SUBSCRIPTIONS ANYMORE OR THE SUBSCRIPTION HAS NO ALARM SET ANYMORE
        //

        if (pending) {

          let notificationsToBeCanceled: LocalNotificationPendingList = { notifications: [] };

          for (let pendingNotification of pending.notifications) {

            let cancelNotification = false;
            const correspondingSubscription = this.subscriptions.find(s => s.id === Number(pendingNotification.id))
  
            // Case 1: No Subscription with corresponding NotificationID -> Cancel!
            if (!correspondingSubscription) { cancelNotification = true; }
  
            // Case 2: Subscription with corresponding NotificationID has no alarm set anymore -> Cancel!
            else if (!correspondingSubscription.notificationBeforeCancelationPeriodInDays) { cancelNotification = true; }
  
            // Add Notification to PendingList for canceling it later
            if (cancelNotification) {
              notificationsToBeCanceled.notifications.push({ id: pendingNotification.id });
            }
          }
  
          if (notificationsToBeCanceled.notifications.length !== 0) { 
            LocalNotifications.cancel(notificationsToBeCanceled);
          }

        }
        
        //
        // PART 2: SCHEDULE NOTIFICATIONS
        //

        let notificationsToSchedule: LocalNotification[] = [];

        for (const subscription of this.subscriptions) {
          // Make a number out of it because empty attributes may saved as string
          const notificationBeforeCancelationPeriodInDays = Number(subscription.notificationBeforeCancelationPeriodInDays);

          // Go to next subscription if there is no alarm set
          if (!notificationBeforeCancelationPeriodInDays) { continue; }

          // Next iteration if there isn't any deadline
          if (!this.nextCancelationPeriodDeadlinePipe.transform(subscription)) { continue; }

          const scheduleAtDate = this.notificationTimeForNextCancelationPeriodDeadline.transform(subscription).dueDate;
          const nextCancelationPeriodDeadlineDate = this.nextCancelationPeriodDeadlinePipe.transform(subscription).dueDate;


          // If scheduleAt is in the past, don't schedule and go check next subscription
          if (scheduleAtDate < new Date()) { continue }

          const NOTIFICATION_TITLE = this.translateService.instant('NOTIFICATIONS.NOTIFICATION_TITLE');
          const NOTIFICATION_BODY = ((this.translateService.instant('NOTIFICATIONS.NOTIFICATION_BODY')).replace('$NAME$', subscription.name)).replace('$DATE$', nextCancelationPeriodDeadlineDate);

          const notification: LocalNotification = {
            id: subscription.id,
            title: NOTIFICATION_TITLE,
            body: NOTIFICATION_BODY,
            schedule: { at: scheduleAtDate }
          };

          notificationsToSchedule.push(notification);
        }

        if (notificationsToSchedule.length !== 0) {
          LocalNotifications.schedule({ notifications: notificationsToSchedule });
        }


      });
    }
    else {
      // No subscriptions present -> Cancel all pending Notifications!
      LocalNotifications.getPending().then(pending => {
        if (pending) { LocalNotifications.cancel(pending); }
      });
    }
  }

}
