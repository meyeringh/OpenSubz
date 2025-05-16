import { Component, ViewChild } from '@angular/core';
import { ModalController, AlertController, IonSearchbar } from '@ionic/angular/standalone';
import { ModalAddSubscriptionComponent } from './Components/modal-add-subscription/modal-add-subscription.component';
import { ISubscription } from './Interfaces/subscriptionInterface';
import { ISettings } from '../tab-settings/Interfaces/settingsInterface';
import { PreferencesService } from '../Services/preferences.service';
import { TranslateService } from '@ngx-translate/core';
import { billingIntervals } from './BILLING_INTERVALS';
import { NotificationService } from '../Services/notification.service';
import { SplashScreen } from '@capacitor/splash-screen';
import { addIcons } from "ionicons";
import { swapHorizontal, swapVertical, search, filter, add, closeOutline } from "ionicons/icons";

@Component({
    selector: 'app-tab-overview',
    templateUrl: 'tab-overview.page.html',
    styleUrls: ['tab-overview.page.scss'],
    standalone: false
})
export class TabOverviewPage {
    @ViewChild('searchSubscriptions', { static: false }) searchSubscriptions: IonSearchbar;

    subscriptions: ISubscription[] = [];
    areSubscriptionsFetched = false;
    availableBillingIntervals = billingIntervals;
    selectedBillingInterval: string;
    settings: ISettings;
    subscriptionSearchFilter = '';
    sortSubscriptionsBy: string;
    isSearchbarEnabled = false;

    constructor(
        public alertController: AlertController,
        public modalController: ModalController,
        public preferencesService: PreferencesService,
        public translateService: TranslateService,
        public notificationService: NotificationService) {
        addIcons({
            'swap-horizontal': swapHorizontal,
            'swap-vertical': swapVertical,
            'search':        search,
            'filter':        filter,
            'add':           add,
            'close-outline': closeOutline
        });
    }

    // Gets fired every page view so that settings which were made during runtime, etc. are immediately there
    ionViewWillEnter() {
        this.retrieveSettingsFromPreferences();
        this.retrieveSubscriptionsFromPreferences().then(() => {
            this.areSubscriptionsFetched = true;
            SplashScreen.hide();
        });
    }

    addSubscription(sub: ISubscription): void {
        let id: number;
        do { id = Math.floor((Math.random() * 999999999999) + 1); } while (this.subscriptions.some(subscription => subscription.id === id));

        sub.id = id;
        sub.created = Date.now();
        sub.lastEdited = sub.created;

        this.subscriptions.push(sub);
        this.saveSubscriptionsToPreferences();

        // New subscription array with Array.slice() because otherwise the Angular change detection for sorting pipe
        // wouldn't be called after adding new subscriptions leading to not show the new subscription until page refresh
        this.subscriptions = this.subscriptions.slice();
    }

    updateSubscription(sub: ISubscription): void {
        const index = this.subscriptions.findIndex(subscription => subscription.id === sub.id);
        this.subscriptions[index] = sub;
        this.saveSubscriptionsToPreferences();

        // New subscription array with Array.slice() because otherwise the Angular change detection for sorting pipe
        // wouldn't be called after updating subscriptions leading to not show the new subscription until page refresh
        this.subscriptions = this.subscriptions.slice();
    }

    deleteSubscription(sub: ISubscription): void {
        this.subscriptions = this.subscriptions.filter(subscription => subscription.id !== sub.id);
        this.saveSubscriptionsToPreferences();
    }

    async saveSubscriptionsToPreferences() {
        await this.preferencesService.saveSubscriptionsToPreferences(this.subscriptions)
            .then(() => { this.notificationService.scheduleNotifications(); });
    }

    async retrieveSubscriptionsFromPreferences() {
        this.subscriptions = await this.preferencesService.retrieveSubscriptionsFromPreferences();
    }

    async presentAddSubscriptionModal() {
        const modal = await this.modalController.create({
            component: ModalAddSubscriptionComponent
        });

        modal.onDidDismiss()
            .then((data) => {
                if (data.data) {
                    this.addSubscription(data.data.sub);
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
                        this.deleteSubscription(data.data.sub);
                    }
                    // Update
                    else {
                        this.updateSubscription(data.data.sub);
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
        this.saveSettingsToPreferences();
    }

    async retrieveSettingsFromPreferences() {
        this.settings = await this.preferencesService.retrieveSettingsFromPreferences();
        this.selectedBillingInterval = this.settings.defaultBillingInterval || 'MONTHS';
        this.sortSubscriptionsBy = this.settings.defaultSortBy || 'nextBillingAsc';
    }

    async saveSettingsToPreferences() {
        this.preferencesService.saveSettingsToPreferences(this.settings);
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
                    cssClass: this.sortSubscriptionsBy.endsWith('Asc') ? 'alert-sort-selected button-solid' : '',
                    handler: (sortBy) => {
                        this.sortSubscriptions(sortBy + 'Asc');
                    },
                }, {
                    text: alertStrings.desc + ' ↓',
                    cssClass: this.sortSubscriptionsBy.endsWith('Desc') ? 'alert-sort-selected' : '',
                    handler: (sortBy) => {
                        this.sortSubscriptions(sortBy + 'Desc');
                    }
                }
            ]
        });

        await alert.present();
    }

    sortSubscriptions(sortBy: string) {
        if (sortBy !== this.sortSubscriptionsBy) {
            this.sortSubscriptionsBy = sortBy;
            this.settings.defaultSortBy = sortBy;
            this.saveSettingsToPreferences();
        }
    }

    dismissHelperText(attributeName: string): void {
        if (attributeName === 'hideOverviewHelperTextGeneral') { this.settings.hideOverviewHelperTextGeneral = true; }
        else if (attributeName === 'hideOverviewHelperTextMenuBar') { this.settings.hideOverviewHelperTextMenuBar = true; }
        else { return; }

        this.saveSettingsToPreferences();
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

    // Avoids re-rendering of subscriptions after page changes and prevents flickering
    trackSubscriptionsBy(index: number): number {
        return index;
    }

}
