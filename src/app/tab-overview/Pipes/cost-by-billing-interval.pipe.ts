import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'costByBillingInterval'
})
export class CostByBillingIntervalPipe implements PipeTransform {

  transform(se: ISubscription, selectedBillingIntervalName: string): number {
    let costPerDay: number;

    switch (se.billingInterval) {
      case 'day': {
        costPerDay = se.cost / se.billingEvery;
        break;
      }
      case 'week': {
        costPerDay = se.cost / se.billingEvery / 7;
        break;
      }
      case 'month': {
        costPerDay = se.cost / se.billingEvery / 30;
        break;
      }
      case 'year': {
        costPerDay = se.cost / se.billingEvery / 365;
        break;
      }
      default: {
        return undefined;
      }
    }

    switch (selectedBillingIntervalName) {
      case 'day': {
        return costPerDay;
      }
      case 'week': {
        return costPerDay * 7;
      }
      case 'month': {
        return costPerDay * 30;
      }
      case 'year': {
        return costPerDay * 365;
      }
      default: {
        return undefined;
      }
    }
  }

}
