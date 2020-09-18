import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'daysUntilNextCancelationPeriodDeadline'
})
export class DaysUntilNextCancelationPeriodDeadlinePipe implements PipeTransform {
  MS_PER_DAY = 1000 * 60 * 60 * 24;

  constructor() {}

  // lastPossibleCancelationDate = billingStart + minimumContractDuration mit Interval
  // IF lastPossibleCancelationDate - cancelationPeriodEvery mit Interval ----> Vor heute?
  //    WENN JA: Datum gefunden!!!
  //    WENN NEIN:
  // do (lastPossibleCancelationDate = lastPossibleCancelationDate + extensionAfterMinimumContractDurationEvery mit Interval)
  // while { lastPossibleCancelationDate - cancelationPeriodEvery mit Interval IST vor heute }

  transform(subscription: ISubscription): number {
    const today = new Date();
    const billingStart = new Date(subscription.billingStart);
    let lastPossibleCancelationDate = billingStart;

    switch (subscription.minimumContractDurationInterval) {
      case 'day': {
        // lastPossibleCancelationDate = lastPossibleCancelationDate + subscription.minimumContractDuration (Date.setDate)
        return 0;
      }
      case 'week': {
        // lastPossibleCancelationDate = lastPossibleCancelationDate + subscription.minimumContractDuration (Date.setDate * 7)
        return 0;
      }
      case 'month': {
        // lastPossibleCancelationDate = lastPossibleCancelationDate + subscription.minimumContractDuration (Date.setMonth)
        return 0;
      }
      case 'year': {
        // lastPossibleCancelationDate = lastPossibleCancelationDate + subscription.minimumContractDuration (Date.setFullYear)
        return 0;
      }
      default: {
        return undefined;
      }
    }

    // Not sure which parameter first, not sure wether <= oder >0
    if (this.dateDiffInDays(today, lastPossibleCancelationDate) <= 0) {
      // DATE found!!!
      // return this.dateDiffInDays(today, lastPossibleCancelationDate)
    } else {
      do {
        //

        switch (subscription.extensionAfterMinimumContractDurationInterval) {
          case 'day': {
// lastPossibleCancelationDate = lastPossibleCancelationDate + subscription.extensionAfterMinimumContractDurationEvery (Date.setDate)
            return 0;
          }
          case 'week': {
// lastPossibleCancelationDate = lastPossibleCancelationDate + subscription.extensionAfterMinimumContractDurationEvery (Date.setDate * 7)
            return 0;
          }
          case 'month': {
// lastPossibleCancelationDate = lastPossibleCancelationDate + subscription.extensionAfterMinimumContractDurationEvery (Date.setMonth)
            return 0;
          }
          case 'year': {
// lastPossibleCancelationDate = lastPossibleCancelationDate + subscription.extensionAfterMinimumContractDurationEvery (Date.setFullYear)
            return 0;
          }
          default: {
            return undefined;
          }
        }



      } while (//this.dateDiffInDays(today, lastPossibleCancelationDate - cancelationPeriod) <= 0);
      false);
      // return datediff
    }
  }

  dateDiffInDays(a: Date, b: Date): number {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / this.MS_PER_DAY);
  }
}
