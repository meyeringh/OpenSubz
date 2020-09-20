import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { ModalAddSubscriptionComponent } from './Components/modal-add-subscription/modal-add-subscription.component';
import { ISubscription } from './Interfaces/subscriptionInterface';
import { ISettings } from '../tab-settings/Interfaces/settingsInterface';
import { StorageService } from '../Services/storage.service';
import * as uuid from 'uuid';
import { TranslateService } from '@ngx-translate/core';
import { billingIntervals } from './BILLING_INTERVALS';

@Component({
  selector: 'app-tab-overview',
  templateUrl: 'tab-overview.page.html',
  styleUrls: ['tab-overview.page.scss']
})
export class TabOverviewPage {
  subscriptions: ISubscription[] = [];
  availableBillingIntervals = billingIntervals;
  selectedBillingInterval: string;
  settings: ISettings;
  subscriptionSearchFilter = '';
  sortSubscriptionsBy = 'nextBillingAsc';

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    public storageService: StorageService,
    public translateService: TranslateService) {}

  // Gets fired every page view so that settings which were made during runtime, etc. are immediately there
  ionViewWillEnter() {
    this.retrieveSettingsFromStorage();
    this.retrieveSubscriptionsFromStorage();
  }

  addEntry(entry: ISubscription): void {
    console.log(entry);
    let id = '';

    do { id = uuid.v4(); } while (this.subscriptions.some(se => se.id === id));

    entry.id = id;

    this.subscriptions.push(entry);
    this.saveSubscriptionsToStorage();
  }

  updateEntry(entry: ISubscription): void {
    const index = this.subscriptions.findIndex(se => se.id === entry.id);
    this.subscriptions[index] = entry;
    this.saveSubscriptionsToStorage();
  }

  deleteEntry(entry: ISubscription): void {
    this.subscriptions = this.subscriptions.filter(se => se.id !== entry.id);
    this.saveSubscriptionsToStorage();
  }

  async saveSubscriptionsToStorage() {
    await this.storageService.saveSubscriptionsToStorage(this.subscriptions);
  }

  async retrieveSubscriptionsFromStorage() {
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
    this.settings.defaultBillingInterval = this.selectedBillingInterval;
    this.saveSettingsToStorage();
  }

  async retrieveSettingsFromStorage() {
    this.settings = await this.storageService.retrieveSettingsFromStorage();
    this.selectedBillingInterval = this.settings.defaultBillingInterval || 'MONTHS';
    this.sortSubscriptionsBy = this.settings.defaultSortBy || 'nextBillingAsc';
  }

  async saveSettingsToStorage() {
    this.storageService.saveSettingsToStorage(this.settings);
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
    this.settings.defaultSortBy = sortBy;
    this.saveSettingsToStorage();
  }

}
