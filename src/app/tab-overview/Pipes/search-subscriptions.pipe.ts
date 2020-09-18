import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
  name: 'searchSubscriptions'
})
export class SearchSubscriptionsPipe implements PipeTransform {

  transform(entries: ISubscription[], filterByNameAndDescription: string): ISubscription[] {
    if (filterByNameAndDescription === undefined || filterByNameAndDescription === '') { return entries; }
    return entries.filter(entry => entry.name.toLowerCase().includes(
      filterByNameAndDescription.toLowerCase()) || entry.description?.toLowerCase().includes(filterByNameAndDescription.toLowerCase()));
  }

}
