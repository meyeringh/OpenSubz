import { Component } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ISubscriptionColor } from '../../Interfaces/subscriptionColorInterface';
import { ISubscriptionBillingInterval } from '../../Interfaces/subscriptionBillingIntervalInterface';
import { ISettings } from '../../../tab-settings/Interfaces/settingsInterface';
import { ISubscription } from '../../Interfaces/subscriptionInterface';
import { StorageService } from 'src/app/Services/storage.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-modal-add-subscription',
  templateUrl: './modal-add-subscription.component.html',
  styleUrls: ['./modal-add-subscription.component.scss'],
})
export class ModalAddSubscriptionComponent {
  subscriptionForm: FormGroup;
  cardColorList: ISubscriptionColor[] = [
    { name: 'primary', friendlyName: 'Primär' },
    { name: 'secondary', friendlyName: 'Sekundär' },
    { name: 'tertiary', friendlyName: 'Tertiär' },
    { name: 'success', friendlyName: 'Grün' },
    { name: 'warning', friendlyName: 'Gelb' },
    { name: 'danger', friendlyName: 'Rot' },
    { name: 'light', friendlyName: 'Angepasst' },
    { name: 'medium', friendlyName: 'Medium' },
    { name: 'dark', friendlyName: 'Kontrast' }
  ];
  billingIntervalList: ISubscriptionBillingInterval[] = [
    { name: 'day', friendlyName: 'Tage' },
    { name: 'week', friendlyName: 'Wochen' },
    { name: 'month', friendlyName: 'Monate' },
    { name: 'year', friendlyName: 'Jahre' },
  ];
  currentDate: Date;
  retrievedSettings: ISettings;
  existingSubscription: ISubscription; // If passed, the component is used for updating an existing subscription entry

  constructor(
    public alertController: AlertController,
    public modalController: ModalController,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    public translateService: TranslateService) {
    this.subscriptionForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      cost: ['', Validators.required],
      billingStart: ['', Validators.required],
      billingEvery: [1, Validators.required],
      billingInterval: ['year', Validators.required],
      minimumContractDuration: ['2', Validators.required],
      minimumContractDurationInterval: ['year', Validators.required],
      extensionAfterMinimumContractDurationEvery: ['6', Validators.required],
      extensionAfterMinimumContractDurationInterval: ['month', Validators.required],
      cancelationPeriodEvery: [3],
      cancelationPeriodInterval: ['month'],
      notificationBeforeCancelationPeriodInDays: [30],
      color: ['medium', Validators.required]
    });
  }

  ionViewWillEnter() {
    this.currentDate = new Date();

    // setTimeout as a workaround for ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      if (!this.existingSubscription) {
        this.retrieveSettingsFromStorage();
      }
      // Update existing subscription
      else {
        this.fillFormWithExistingEntry();
      }
    }, 0);
  }

  // For new entry and updating existing entry
  save() {
    if (this.subscriptionForm.valid) {
      const subscription: ISubscription = this.subscriptionForm.value;
      // Updating entry
      if (this.existingSubscription) {
        subscription.id = this.existingSubscription.id;
      }

      this.modalController.dismiss({entry: subscription});
    }
  }

  delete() {
    this.modalController.dismiss({delete: true, entry: this.existingSubscription});
  }

  async showDeleteConfirmationModal() {
    const alertStrings: any = {};

    this.translateService.get('GENERAL.CANCEL').subscribe(CANCEL => {
      alertStrings.cancel = CANCEL;
    });
    this.translateService.get('GENERAL.OK').subscribe(OK => {
      alertStrings.ok = OK;
    });
    this.translateService.get('TABS.OVERVIEW.REMOVE_SUBSCRIPTION_ALERT_HEADER').subscribe(REMOVE_SUBSCRIPTION_ALERT_HEADER => {
      alertStrings.header = REMOVE_SUBSCRIPTION_ALERT_HEADER;
    });
    this.translateService.get('TABS.OVERVIEW.REMOVE_SUBSCRIPTION_ALERT_MESSAGE').subscribe(REMOVE_SUBSCRIPTION_ALERT_MESSAGE => {
      alertStrings.message = REMOVE_SUBSCRIPTION_ALERT_MESSAGE;
    });

    const alert = await this.alertController.create({
      cssClass: 'alert-full-width',
      header: alertStrings.header,
      message: alertStrings.message,
      buttons: [
        {
          text: alertStrings.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: alertStrings.ok,
          handler: () => {
            this.delete();
          }
        }
      ]
    });

    await alert.present();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  async retrieveSettingsFromStorage() {
    this.retrievedSettings = await this.storageService.retrieveSettingsFromStorage();
    if (this.retrievedSettings) {
      this.subscriptionForm.patchValue({
        notificationBeforeCancelationPeriodInDays: this.retrievedSettings.notificationBeforeCancelationPeriodInDays,
      });
    }
  }

  fillFormWithExistingEntry(): void {
    Object.keys(this.subscriptionForm.controls).forEach(key => {
      this.subscriptionForm.patchValue({
        [key]: this.existingSubscription[key]
      });
    });
  }

}
