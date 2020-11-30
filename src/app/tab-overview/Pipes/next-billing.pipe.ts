import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'nextBilling'
})
export class NextBillingPipe implements PipeTransform {
  MS_PER_DAY = 1000 * 60 * 60 * 24;

  transform(subscription: ISubscription): {dueDate: Date, inDaysFromToday: number} {
    const today = new Date();
    const billingStart = new Date(subscription.billingStart);
    const nextBillingDate = billingStart;

    if (subscription.billingEvery === 0) { return null; }

    switch (subscription.billingInterval) {
      case 'DAYS': {
        while (this.dateDiffInDays(today, nextBillingDate) <= 0) {
          nextBillingDate.setDate(nextBillingDate.getDate() + subscription.billingEvery);
        }

        break;
      }
      case 'WEEKS': {
        while (this.dateDiffInDays(today, nextBillingDate) <= 0) {
          nextBillingDate.setDate(nextBillingDate.getDate() + (subscription.billingEvery * 7));
        }

        break;
      }
      case 'MONTHS': {
        while (this.dateDiffInDays(today, nextBillingDate) <= 0) {
          nextBillingDate.setMonth(nextBillingDate.getMonth() + subscription.billingEvery);
        }

        break;
      }
      case 'YEARS': {
        while (this.dateDiffInDays(today, nextBillingDate) <= 0) {
          nextBillingDate.setFullYear(nextBillingDate.getFullYear() + subscription.billingEvery);
        }

        break;
      }
      default: {
        return null;
      }
    }

    return { dueDate: nextBillingDate, inDaysFromToday: this.dateDiffInDays(today, nextBillingDate) }
  }

  // Difference between two Date objects in days (always positive)
  absDateDiffInDays(a: Date, b: Date): number {
    return Math.abs(this.dateDiffInDays(a, b));
  }

  dateDiffInDays(a: Date, b: Date): number {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / this.MS_PER_DAY);
  }

}
