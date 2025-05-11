import { Pipe, PipeTransform } from '@angular/core';
import { ISubscription } from '../Interfaces/subscriptionInterface';

@Pipe({
    name: 'searchSubscriptions',
    standalone: false
})
export class SearchSubscriptionsPipe implements PipeTransform {

  transform(subscriptions: ISubscription[], filterByNameAndDescription: string): ISubscription[] {
    if (!filterByNameAndDescription) { return subscriptions; }
    return subscriptions.filter(sub => sub.name.toLowerCase().includes(
      filterByNameAndDescription.toLowerCase()) || sub.description?.toLowerCase().includes(filterByNameAndDescription.toLowerCase())
    );
  }

}
