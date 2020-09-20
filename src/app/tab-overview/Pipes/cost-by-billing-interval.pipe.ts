import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'costByBillingInterval'
})
export class CostByBillingIntervalPipe implements PipeTransform {

  transform(se: ISubscription, selectedBillingIntervalName: string): number {
    let costPerDay: number;

    switch (se.billingInterval) {
      case 'DAYS': {
        costPerDay = se.cost / se.billingEvery;
        break;
      }
      case 'WEEKS': {
        costPerDay = se.cost / se.billingEvery / 7;
        break;
      }
      case 'MONTHS': {
        costPerDay = se.cost / se.billingEvery / 30;
        break;
      }
      case 'YEARS': {
        costPerDay = se.cost / se.billingEvery / 365;
        break;
      }
      default: {
        return undefined;
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
        return undefined;
      }
    }
  }

}
