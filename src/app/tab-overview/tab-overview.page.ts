import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalAddSubscriptionComponent } from './Components/modal-add-subscription/modal-add-subscription.component';
import { ISubscription } from './Interfaces/subscriptionInterface';
import { ISubscriptionBillingInterval } from './Interfaces/subscriptionBillingIntervalInterface';
import { ISettings } from '../tab-settings/Interfaces/settingsInterface';
import { StorageService } from '../Services/storage.service';
import * as uuid from 'uuid';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab-overview',
  templateUrl: 'tab-overview.page.html',
  styleUrls: ['tab-overview.page.scss']
})
export class TabOverviewPage {
  subscriptions: ISubscription[] = [];
  availableBillingIntervals: ISubscriptionBillingInterval[] = [
    { name: 'year', friendlyName: undefined },
    { name: 'month', friendlyName: undefined },
    { name: 'week', friendlyName: undefined },
    { name: 'day', friendlyName: undefined }
  ];
  selectedBillingInterval: ISubscriptionBillingInterval = this.availableBillingIntervals[1]; // Month
  retrievedSettings: ISettings;
  subscriptionSearchFilter = '';
  sortSubscriptionsBy = 'nextBillingAsc';

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    public storageService: StorageService,
    public translateService: TranslateService) {}

  // Gets fired every page view so that settings which were made during runtime, etc. are immediately there
  ionViewWillEnter() {
    this.setupCalendarIntervalTranslation();
    this.retrieveSettingsFromStorage();
    this.retrieveEntriesFromStorage();
  }

  setupCalendarIntervalTranslation(): void {
    this.translateService.get('TABS.OVERVIEW.CALENDAR_INTERVALS.YEARS').subscribe(YEARS => {
      this.availableBillingIntervals[0].friendlyName = YEARS;
    });
    this.translateService.get('TABS.OVERVIEW.CALENDAR_INTERVALS.MONTHS').subscribe(MONTHS => {
      this.availableBillingIntervals[1].friendlyName = MONTHS;
    });
    this.translateService.get('TABS.OVERVIEW.CALENDAR_INTERVALS.WEEKS').subscribe(WEEKS => {
      this.availableBillingIntervals[2].friendlyName = WEEKS;
    });
    this.translateService.get('TABS.OVERVIEW.CALENDAR_INTERVALS.DAYS').subscribe(DAYS => {
      this.availableBillingIntervals[3].friendlyName = DAYS;
    });
  }

  addEntry(entry: ISubscription): void {
    let id = '';
    do { id = uuid.v4(); } while (this.subscriptions.some(se => se.id === id));

    entry.id = id;

    this.subscriptions.push(entry);
    this.saveEntriesToStorage();
  }

  updateEntry(entry: ISubscription): void {
    const index = this.subscriptions.findIndex(se => se.id === entry.id);
    this.subscriptions[index] = entry;
    this.saveEntriesToStorage();
  }

  deleteEntry(entry: ISubscription): void {
    this.subscriptions = this.subscriptions.filter(se => se.id !== entry.id);
    this.saveEntriesToStorage();
  }

  async saveEntriesToStorage() {
    await this.storageService.saveSubscriptionsToStorage(this.subscriptions);
  }

  async retrieveEntriesFromStorage() {
    this.subscriptions = await this.storageService.retrieveSubscriptionsFromStorage();
  }

  async presentAddSubscriptionModal() {
    const modal = await this.modalController.create({
      component: ModalAddSubscriptionComponent
    });

    modal.onDidDismiss()
        .then((data) => {
          if (data.data) {
            this.addEntry(data.data.entry);
          }
      });

    return await modal.present();
  }

  // Handles modal for updating and deleting an existing subscription
  async presentUpdateSubscriptionModal(subscription: ISubscription) {
    const modal = await this.modalController.create({
      component: ModalAddSubscriptionComponent,
      componentProps: {
        existingSubscription: subscription
      }
    });

    modal.onDidDismiss()
        .then((data) => {
          if (data.data) {
            // Delete
            if (data.data.delete) {
              this.deleteEntry(data.data.entry);
            }
            // Update
            else {
              this.updateEntry(data.data.entry);
            }
          }
      });

    return await modal.present();
  }

  // Rotates between available billing intervals
  changeChoosenBillingInterval(): void {
    if (this.selectedBillingInterval === this.availableBillingIntervals[this.availableBillingIntervals.length - 1]) {
      this.selectedBillingInterval = this.availableBillingIntervals[0];
    } else {
      const index = this.availableBillingIntervals.findIndex(element => element === this.selectedBillingInterval);
      this.selectedBillingInterval = this.availableBillingIntervals[index + 1];
    }
  }

  async retrieveSettingsFromStorage() {
    this.retrievedSettings = await this.storageService.retrieveSettingsFromStorage();
  }

  async showSortingAlert() {
    const alertStrings: any = {};

    this.translateService.get('TABS.OVERVIEW.SORT_BY').subscribe(SORT_BY => {
      alertStrings.header = SORT_BY;
    });
    this.translateService.get('TABS.OVERVIEW.NAME').subscribe(NAME => {
      alertStrings.name = NAME;
    });
    this.translateService.get('TABS.OVERVIEW.COSTS_PER_PERIOD').subscribe(COSTS_PER_PERIOD => {
      alertStrings.costsPerPeriod = COSTS_PER_PERIOD;
    });
    this.translateService.get('TABS.OVERVIEW.NEXT_PAYMENT').subscribe(NEXT_PAYMENT => {
      alertStrings.nextPayment = NEXT_PAYMENT;
    });
    this.translateService.get('TABS.OVERVIEW.NEXT_SUBSCRIPTION_EXTENSION').subscribe(NEXT_SUBSCRIPTION_EXTENSION => {
      alertStrings.nextSubscriptionExtension = NEXT_SUBSCRIPTION_EXTENSION;
    });
    this.translateService.get('GENERAL.CANCEL').subscribe(CANCEL => {
      alertStrings.cancel = CANCEL;
    });
    this.translateService.get('GENERAL.OK').subscribe(OK => {
      alertStrings.ok = OK;
    });

    const alert = await this.alertController.create({
      cssClass: 'alert-full-width',
      header: alertStrings.header,
      inputs: [
        {
          name: 'nameAsc',
          type: 'radio',
          label: alertStrings.name + ' ↑',
          value: 'nameAsc',
          checked: this.sortSubscriptionsBy === 'nameAsc'
        },
        {
          name: 'nameDesc',
          type: 'radio',
          label: alertStrings.name + ' ↓',
          value: 'nameDesc',
          checked: this.sortSubscriptionsBy === 'nameDesc'
        },
        {
          name: 'costAsc',
          type: 'radio',
          label: alertStrings.costsPerPeriod + ' ↑',
          value: 'costAsc',
          checked: this.sortSubscriptionsBy === 'costAsc'
        },
        {
          name: 'costDesc',
          type: 'radio',
          label: alertStrings.costsPerPeriod + ' ↓',
          value: 'costDesc',
          checked: this.sortSubscriptionsBy === 'costDesc'
        },
        {
          name: 'nextBillingAsc',
          type: 'radio',
          label: alertStrings.nextPayment + ' ↑',
          value: 'nextBillingAsc',
          checked: this.sortSubscriptionsBy === 'nextBillingAsc'
        },
        {
          name: 'nextBillingDesc',
          type: 'radio',
          label: alertStrings.nextPayment + ' ↓',
          value: 'nextBillingDesc',
          checked: this.sortSubscriptionsBy === 'nextBillingDesc'
        },
        {
          name: 'nextContractExtensionAsc',
          type: 'radio',
          label: alertStrings.nextSubscriptionExtension + ' ↑',
          value: 'nextContractExtensionAsc',
          checked: this.sortSubscriptionsBy === 'nextContractExtensionAsc'
        },
        {
          name: 'nextContractExtensionDesc',
          type: 'radio',
          label: alertStrings.nextSubscriptionExtension + ' ↓',
          value: 'nextContractExtensionDesc',
          checked: this.sortSubscriptionsBy === 'nextContractExtensionDesc'
        }
      ],
      buttons: [
        {
          text: alertStrings.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: alertStrings.ok,
          handler: (sortBy) => {
            this.sortSubscriptions(sortBy);
          }
        }
      ]
    });

    await alert.present();
  }

  sortSubscriptions(sortBy: string) {
    this.sortSubscriptionsBy = sortBy;
    // ToDo: Persistence
  }

}
