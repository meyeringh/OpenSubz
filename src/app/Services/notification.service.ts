import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { StorageService } from './storage.service';
import { ISubscription } from '../tab-overview/Interfaces/subscriptionInterface';

const { LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  subscriptions: ISubscription[];

  constructor(public storageService: StorageService) { }

  async scheduleNotifications() {
    this.subscriptions = await this.storageService.retrieveSubscriptionsFromStorage();
    if (this.subscriptions) {
      let i = 0;
      for (const se of this.subscriptions) {
        // Next iteration if there is no notification set for current subscription
        if (se.notificationBeforeCancelationPeriodInDays === null || se.notificationBeforeCancelationPeriodInDays === undefined) {
          continue;
        }

        // ToDo: Calculate daysUntilCancelationPeriod
        const daysUntilCancelationPeriod = 7;

        // ToDo: Calculate daysUntilNotification -> schedule Date.now() + daysUntilNotification * 1000 * 60 * 60 * 24 (?)
        const daysUntilNotification = 0;

        const notifs = await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Kündigungsfrist bald erreicht!' ,
              body: 'Die Kündigungsfrist von ' + se.name + ' ist in ' + daysUntilCancelationPeriod +  ' Tagen erreicht.',
              id: i,
              schedule: { at: new Date(Date.now() + 1000 * 20) },
              sound: null,
              attachments: null,
              actionTypeId: '',
              extra: null
            }
          ]
        });
        console.log('scheduled notifications', notifs);

        i++;
      }
    } else {
      console.log('no subscriptions');
    }
  }
}
