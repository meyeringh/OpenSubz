import { Pipe, PipeTransform } from '@angular/core';
import { DaysUntilNextCancelationPeriodDeadlinePipe } from './days-until-next-cancelation-period-deadline.pipe';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'daysUntilNotificationForNextCancelationPeriodDeadline'
})
export class DaysUntilNotificationForNextCancelationPeriodDeadlinePipe implements PipeTransform {

  constructor(private daysUntilNextCancelationPeriodDeadlinePipe: DaysUntilNextCancelationPeriodDeadlinePipe) {}

  // ToDo (If negative values: daysUntilNextCancelationPeriodDeadlinePipe with optional overNext parameter)
  transform(se: ISubscription): number {
    if (se.notificationBeforeCancelationPeriodInDays !== undefined) {
      return this.daysUntilNextCancelationPeriodDeadlinePipe.transform(se) - se.notificationBeforeCancelationPeriodInDays;
    } else { return undefined; }
  }

}
