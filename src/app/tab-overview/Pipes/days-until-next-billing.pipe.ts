import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'daysUntilNextBilling'
})
export class DaysUntilNextBillingPipe implements PipeTransform {
  MS_PER_DAY = 1000 * 60 * 60 * 24;

  transform(se: ISubscription, overNext?: boolean): number {
    const today = new Date();
    const billingStart = new Date(se.billingStart);
    const nextBillingDate = billingStart;

    switch (se.billingInterval) {
      case 'DAYS': {
        while (this.dateDiffInDays(today, nextBillingDate) <= 0) {
          nextBillingDate.setDate(nextBillingDate.getDate() + se.billingEvery);
        }

        if (overNext) { nextBillingDate.setDate(nextBillingDate.getDate() + se.billingEvery); }

        return this.dateDiffInDays(today, nextBillingDate);
      }
      case 'WEEKS': {
        while (this.dateDiffInDays(today, nextBillingDate) <= 0) {
          nextBillingDate.setDate(nextBillingDate.getDate() + (se.billingEvery * 7));
        }

        if (overNext) { nextBillingDate.setDate(nextBillingDate.getDate() + (se.billingEvery * 7)); }

        return this.dateDiffInDays(today, nextBillingDate);
      }
      case 'MONTHS': {
        while (this.dateDiffInDays(today, nextBillingDate) <= 0) {
          nextBillingDate.setMonth(nextBillingDate.getMonth() + se.billingEvery);
        }

        if (overNext) { nextBillingDate.setMonth(nextBillingDate.getMonth() + se.billingEvery); }

        return this.dateDiffInDays(today, nextBillingDate);
      }
      case 'YEARS': {
        while (this.dateDiffInDays(today, nextBillingDate) <= 0) {
          nextBillingDate.setFullYear(nextBillingDate.getFullYear() + se.billingEvery);
        }

        if (overNext) { nextBillingDate.setFullYear(nextBillingDate.getFullYear() + se.billingEvery); }

        return this.dateDiffInDays(today, nextBillingDate);
      }
      default: {
        return undefined;
      }
    }
  }

  // Difference between two Date objects in days (always positive)
  absDateDiffInDays(a: Date, b: Date): number {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.abs(Math.floor((utc2 - utc1) / this.MS_PER_DAY));
  }

  dateDiffInDays(a: Date, b: Date): number {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / this.MS_PER_DAY);
  }

}
