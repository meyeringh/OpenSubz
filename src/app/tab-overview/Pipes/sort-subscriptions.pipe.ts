import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';
import { DaysUntilNextBillingPipe } from './days-until-next-billing.pipe';
import { DaysUntilNextCancelationPeriodDeadlinePipe } from './days-until-next-cancelation-period-deadline.pipe';
import { CostByBillingIntervalPipe } from './cost-by-billing-interval.pipe';

@Pipe({
  name: 'sortSubscriptions'
})
export class SortSubscriptionsPipe implements PipeTransform {

  constructor(
    private costByBillingIntervalPipe: CostByBillingIntervalPipe,
    private daysUntilNextBillingPipe: DaysUntilNextBillingPipe,
    private daysUntilNextCancelationPeriodDeadlinePipe: DaysUntilNextCancelationPeriodDeadlinePipe) {}

  transform(entries: ISubscription[], filterBy: string): ISubscription[] {
    if (!entries) { return null; }
    if (filterBy === undefined || filterBy === '') { return entries; }

    switch (filterBy) {
      case 'nameAsc': {
        return entries.sort(this.sortByNameAsc);
      }
      case 'nameDesc': {
        return entries.sort(this.sortByNameDesc);
      }
      case 'costAsc': {
        return entries.sort((a, b) => {
          if (this.costByBillingIntervalPipe.transform(a, 'DAYS') < this.costByBillingIntervalPipe.transform(b, 'DAYS')){
            return -1;
          }
          if (this.costByBillingIntervalPipe.transform(a, 'DAYS') > this.costByBillingIntervalPipe.transform(b, 'DAYS')){
            return 1;
          }
          return 0;
        });
      }
      case 'costDesc': {
        return entries.sort((a, b) => {
          if (this.costByBillingIntervalPipe.transform(a, 'DAYS') > this.costByBillingIntervalPipe.transform(b, 'DAYS')){
            return -1;
          }
          if (this.costByBillingIntervalPipe.transform(a, 'DAYS') < this.costByBillingIntervalPipe.transform(b, 'DAYS')){
            return 1;
          }
          return 0;
        });
      }
      case 'nextBillingAsc': {
        return entries.sort((a, b) => {
          if (this.daysUntilNextBillingPipe.transform(a) < this.daysUntilNextBillingPipe.transform(b)){
            return -1;
          }
          if (this.daysUntilNextBillingPipe.transform(a) > this.daysUntilNextBillingPipe.transform(b)){
            return 1;
          }
          return 0;
        });
      }
      case 'nextBillingDesc': {
        return entries.sort((a, b) => {
          if (this.daysUntilNextBillingPipe.transform(a) > this.daysUntilNextBillingPipe.transform(b)){
            return -1;
          }
          if (this.daysUntilNextBillingPipe.transform(a) < this.daysUntilNextBillingPipe.transform(b)){
            return 1;
          }
          return 0;
        });
      }
      case 'nextContractExtensionAsc': {
        return entries.sort((a, b) => {
          if (this.daysUntilNextCancelationPeriodDeadlinePipe.transform(a) < this.daysUntilNextCancelationPeriodDeadlinePipe.transform(b)){
            return -1;
          }
          if (this.daysUntilNextCancelationPeriodDeadlinePipe.transform(a) > this.daysUntilNextCancelationPeriodDeadlinePipe.transform(b)){
            return 1;
          }
          return 0;
        });
      }
      case 'nextContractExtensionDesc': {
        return entries.sort((a, b) => {
          if (this.daysUntilNextCancelationPeriodDeadlinePipe.transform(a) > this.daysUntilNextCancelationPeriodDeadlinePipe.transform(b)){
            return -1;
          }
          if (this.daysUntilNextCancelationPeriodDeadlinePipe.transform(a) < this.daysUntilNextCancelationPeriodDeadlinePipe.transform(b)){
            return 1;
          }
          return 0;
        });
      }
      default: {
        return entries;
      }
    }
  }

  sortByNameAsc(a: ISubscription, b: ISubscription) {
    if (a.name.toLowerCase() < b.name.toLowerCase()){
      return -1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()){
      return 1;
    }
    return 0;
  }

  sortByNameDesc(a: ISubscription, b: ISubscription) {
    if (a.name.toLowerCase() < b.name.toLowerCase()){
      return 1;
    }
    if (a.name.toLowerCase() > b.name.toLowerCase()){
      return -1;
    }
    return 0;
  }

}
