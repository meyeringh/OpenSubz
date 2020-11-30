import { Pipe, PipeTransform } from '@angular/core';
import { NextCancelationPeriodDeadlinePipe } from './next-cancelation-period-deadline.pipe';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'NotificationTimeForNextCancelationPeriodDeadline'
})
export class NotificationTimeForNextCancelationPeriodDeadlinePipe implements PipeTransform {

  constructor(private nextCancelationPeriodDeadlinePipe: NextCancelationPeriodDeadlinePipe) {}

  // ToDo: Think of negative parameters and return the corresponding Date
  transform(se: ISubscription): {dueDate: Date, inDaysFromToday: number} {
    if (se.notificationBeforeCancelationPeriodInDays !== undefined) {
      return { dueDate: new Date(), inDaysFromToday: this.nextCancelationPeriodDeadlinePipe.transform(se).inDaysFromToday - se.notificationBeforeCancelationPeriodInDays };
    } else { return undefined; }
  }

}
