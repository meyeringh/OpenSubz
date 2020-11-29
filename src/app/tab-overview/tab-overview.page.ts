import { Component, ViewChild } from '@angular/core';
import { ModalController, AlertController, IonSearchbar } from '@ionic/angular';
import { ModalAddSubscriptionComponent } from './Components/modal-add-subscription/modal-add-subscription.component';
import { ISubscription } from './Interfaces/subscriptionInterface';
import { ISettings } from '../tab-settings/Interfaces/settingsInterface';
import { StorageService } from '../Services/storage.service';
import * as uuid from 'uuid';
import { TranslateService } from '@ngx-translate/core';
import { billingIntervals } from './BILLING_INTERVALS';
import { NotificationService } from '../Services/notification.service';

@Component({
  selector: 'app-tab-overview',
  templateUrl: 'tab-overview.page.html',
  styleUrls: ['tab-overview.page.scss']
})
export class TabOverviewPage {
  @ViewChild('searchSubscriptions', {static: false}) searchSubscriptions: IonSearchbar;

  subscriptions: ISubscription[] = [];
  availableBillingIntervals = billingIntervals;
  selectedBillingInterval: string;
  settings: ISettings;
  subscriptionSearchFilter = '';
  sortSubscriptionsBy: string;
  isSearchbarEnabled = false;

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    public storageService: StorageService,
    public translateService: TranslateService,
    public notificationService: NotificationService) {}

  // Gets fired every page view so that settings which were made during runtime, etc. are immediately there
  ionViewWillEnter() {
    this.retrieveSettingsFromStorage();
    this.retrieveSubscriptionsFromStorage();
  }

  addEntry(entry: ISubscription): void {
    let id = '';

    do { id = uuid.v4(); } while (this.subscriptions.some(subscription => subscription.id === id));

    entry.id = id;

    this.subscriptions.push(entry);
    this.saveSubscriptionsToStorage();
  }

  updateEntry(entry: ISubscription): void {
    const index = this.subscriptions.findIndex(subscription => subscription.id === entry.id);
    this.subscriptions[index] = entry;
    this.saveSubscriptionsToStorage();
  }

  deleteEntry(entry: ISubscription): void {
    this.subscriptions = this.subscriptions.filter(subscription => subscription.id !== entry.id);
    this.saveSubscriptionsToStorage();
  }

  async saveSubscriptionsToStorage() {
    await this.storageService.saveSubscriptionsToStorage(this.subscriptions)
      .then(() => { this.notificationService.scheduleNotifications(); });
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
    this.translateService.get('GENERAL.ASC').subscribe(ASC => {
      alertStrings.asc = ASC;
    });
    this.translateService.get('GENERAL.DESC').subscribe(DESC => {
      alertStrings.desc = DESC;
    });

    const alert = await this.alertController.create({
      cssClass: 'alert-full-width',
      header: alertStrings.header,
      inputs: [
        {
          name: 'name',
          type: 'radio',
          label: alertStrings.name,
          value: 'name',
          checked: this.sortSubscriptionsBy.startsWith('name')
        },
        {
          name: 'cost',
          type: 'radio',
          label: alertStrings.costsPerPeriod,
          value: 'cost',
          checked: this.sortSubscriptionsBy.startsWith('cost')
        },
        {
          name: 'nextBilling',
          type: 'radio',
          label: alertStrings.nextPayment,
          value: 'nextBilling',
          checked: this.sortSubscriptionsBy.startsWith('nextBilling')
        },
        {
          name: 'nextContractExtension',
          type: 'radio',
          label: alertStrings.nextSubscriptionExtension,
          value: 'nextContractExtension',
          checked: this.sortSubscriptionsBy.startsWith('nextContractExtension')
        },
      ],
      buttons: [
        {
          text: alertStrings.asc + ' ↑',
          handler: (sortBy) => {
            this.sortSubscriptions(sortBy + 'Asc');
          },
        }, {
          text: alertStrings.desc + ' ↓',
          handler: (sortBy) => {
            this.sortSubscriptions(sortBy + 'Desc');
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

  dismissHelperText(attributeName: string): void {
    if (attributeName === "hideOverviewHelperTextGeneral") { this.settings.hideOverviewHelperTextGeneral = true; }
    else if (attributeName === "hideOverviewHelperTextMenuBar") { this.settings.hideOverviewHelperTextMenuBar = true; }
    else return;

    this.saveSettingsToStorage();
  }

  toggleSearchbarVisibility() {
    this.subscriptionSearchFilter = '';
    this.isSearchbarEnabled = !this.isSearchbarEnabled;
    if (this.isSearchbarEnabled) {
      setTimeout(() => {
        this.searchSubscriptions.setFocus();
      }, 100);
    }
  }

}
