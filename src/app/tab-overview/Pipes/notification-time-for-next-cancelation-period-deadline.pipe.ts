import { Pipe, PipeTransform } from '@angular/core';
import { NextCancelationPeriodDeadlinePipe } from './next-cancelation-period-deadline.pipe';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'NotificationTimeForNextCancelationPeriodDeadline'
})
export class NotificationTimeForNextCancelationPeriodDeadlinePipe implements PipeTransform {

  constructor(private nextCancelationPeriodDeadlinePipe: NextCancelationPeriodDeadlinePipe) {}

  transform(subscription: ISubscription): { dueDate: Date, inDaysFromToday: number } {
    const notifyInDaysPrior = subscription.notificationBeforeCancelationPeriodInDays;
    if (notifyInDaysPrior) {
      const dueDate = this.nextCancelationPeriodDeadlinePipe.transform(subscription).dueDate;
      dueDate.setDate(dueDate.getDate() - notifyInDaysPrior)

      const inDaysFromToday = this.nextCancelationPeriodDeadlinePipe.transform(subscription).inDaysFromToday - notifyInDaysPrior;

      return { dueDate: dueDate, inDaysFromToday: inDaysFromToday };
    } else { return null; }
  }

}
