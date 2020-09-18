import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';
import { CostByBillingIntervalPipe } from './cost-by-billing-interval.pipe';

@Pipe({
  name: 'totalCostByBillingInterval',
  pure: false // Otherwise a new added subscription wouldn't get added to the total cost directly
})
export class TotalCostByBillingIntervalPipe implements PipeTransform {

  constructor(private costByBillingIntervalPipe: CostByBillingIntervalPipe) {}

  transform(se: ISubscription[], selectedBillingIntervalName: string): number {
    let totalCost = 0;
    for (const entry of se) {
      totalCost += this.costByBillingIntervalPipe.transform(entry, selectedBillingIntervalName);
    }

    return totalCost;
  }

}
