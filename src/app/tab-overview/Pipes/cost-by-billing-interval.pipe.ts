import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'costByBillingInterval'
})
export class CostByBillingIntervalPipe implements PipeTransform {

  transform(subscription: ISubscription, selectedBillingIntervalName: string): number {
    let costPerDay: number;

    if (subscription.billingEvery === 0) { return 0; }

    switch (subscription.billingInterval) {
      case 'DAYS': {
        costPerDay = subscription.cost / subscription.billingEvery;
        break;
      }
      case 'WEEKS': {
        costPerDay = subscription.cost / subscription.billingEvery / 7;
        break;
      }
      case 'MONTHS': {
        if (selectedBillingIntervalName === 'YEARS') { return subscription.cost / subscription.billingEvery * 12; }
        costPerDay = subscription.cost / subscription.billingEvery / 30;
        break;
      }
      case 'YEARS': {
        if (selectedBillingIntervalName === 'MONTHS') { return subscription.cost / subscription.billingEvery / 12; }
        costPerDay = subscription.cost / subscription.billingEvery / 365;
        break;
      }
      default: {
        return null;
      }
    }

    switch (selectedBillingIntervalName) {
      case 'DAYS': {
        return costPerDay;
      }
      case 'WEEKS': {
        return costPerDay * 7;
      }
      case 'MONTHS': {
        return costPerDay * 30;
      }
      case 'YEARS': {
        return costPerDay * 365;
      }
      default: {
        return null;
      }
    }
  }

}
