import { Pipe, PipeTransform } from '@angular/core';
import { NextCancelationPeriodDeadlinePipe } from './next-cancelation-period-deadline.pipe';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'NotificationTimeForNextCancelationPeriodDeadline'
})
export class NotificationTimeForNextCancelationPeriodDeadlinePipe implements PipeTransform {

  constructor(private nextCancelationPeriodDeadlinePipe: NextCancelationPeriodDeadlinePipe) {}

  transform(se: ISubscription): { dueDate: Date, inDaysFromToday: number } {
    const notifyInDaysPrior = se.notificationBeforeCancelationPeriodInDays;
    if (notifyInDaysPrior !== undefined || notifyInDaysPrior !== null || notifyInDaysPrior !== 0) {
      const dueDate = this.nextCancelationPeriodDeadlinePipe.transform(se).dueDate;
      dueDate.setDate(dueDate.getDate() - notifyInDaysPrior)

      const inDaysFromToday = this.nextCancelationPeriodDeadlinePipe.transform(se).inDaysFromToday - notifyInDaysPrior;

      return { dueDate: dueDate, inDaysFromToday: inDaysFromToday };
    } else { return undefined; }
  }

}
