import { Component, Input, OnInit } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ISettings } from '../../../tab-settings/Interfaces/settingsInterface';
import { ISubscription } from '../../Interfaces/subscriptionInterface';
import { StorageService } from 'src/app/Services/storage.service';
import { TranslateService } from '@ngx-translate/core';
import { billingIntervals } from '../../BILLING_INTERVALS';
import { subscriptionColors } from '../../SUBSCRIPTION_COLORS';

@Component({
  selector: 'app-modal-add-subscription',
  templateUrl: './modal-add-subscription.component.html',
  styleUrls: ['./modal-add-subscription.component.scss'],
})
export class ModalAddSubscriptionComponent implements OnInit {
  subscriptionForm: FormGroup;
  availableBillingIntervals = billingIntervals;
  colors = subscriptionColors;
  currentDate: Date;
  retrievedSettings: ISettings;
  @Input() existingSubscription?: ISubscription; // If passed, the component is used for updating an existing subscription entry

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
      billingInterval: ['YEARS', Validators.required],
      minimumContractDuration: ['2', Validators.required],
      minimumContractDurationInterval: ['YEARS', Validators.required],
      extensionAfterMinimumContractDurationEvery: ['6', Validators.required],
      extensionAfterMinimumContractDurationInterval: ['MONTHS', Validators.required],
      cancelationPeriodEvery: [3],
      cancelationPeriodInterval: ['MONTHS'],
      notificationBeforeCancelationPeriodInDays: [null],
      color: ['BLUE', Validators.required]
    });
  }

  ngOnInit() {
    this.currentDate = new Date();

    if (!this.existingSubscription) {
      this.retrieveSettingsFromStorage();
    }
    // Update existing subscription
    else {
      this.fillFormWithExistingEntry();
    }
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
