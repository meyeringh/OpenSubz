import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { licenseText } from './Helpers/mit-license-text';
import { ISettings } from './Interfaces/settingsInterface';
import { StorageService } from '../Services/storage.service';
import { ThemeService } from '../Services/theme.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-tab-settings',
  templateUrl: 'tab-settings.page.html',
  styleUrls: ['tab-settings.page.scss']
})
export class TabSettingsPage {
  settingsForm: FormGroup;
  retrievedSettings: ISettings;
  currencyList = ['€', '$', '¥', '£', '₤', '₡', '₦', '₹', '₩', '₪', '₫', '₭', '₮', '₱', '₲', '₴', '₵', '₸', '₺', '₼', '₾'];

  constructor(
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    public themeService: ThemeService,
    public translateService: TranslateService) {
    this.settingsForm = this.formBuilder.group({
      hideTotalCostsInOverview: ['false'],
      forceDarkMode: ['false'],
      currency: ['€'],
      notificationBeforeCancelationPeriodInDays: ['']
    });
  }

  ionViewWillEnter() {
    this.retrieveSettingsFromStorage();
    this.listenForThemeChanges();
  }

  async showLicense() {
    const alertStrings: any = {};

    this.translateService.get('GENERAL.OK').subscribe(OK => {
      alertStrings.ok = OK;
    });
    this.translateService.get('TABS.SETTINGS.LICENSE').subscribe(LICENSE => {
      alertStrings.header = LICENSE;
    });

    const alert = await this.alertController.create({
      cssClass: 'alert-full-width',
      header: alertStrings.header,
      subHeader: 'MIT',
      message: licenseText,
      buttons: [{ text: alertStrings.ok }]
    });

    await alert.present();
  }

  async showAbout() {
    const alertStrings: any = {};

    this.translateService.get('GENERAL.OK').subscribe(OK => {
      alertStrings.ok = OK;
    });
    this.translateService.get('TABS.SETTINGS.ABOUT').subscribe(ABOUT => {
      alertStrings.header = ABOUT;
    });
    this.translateService.get('APP.NAME').subscribe(APP_NAME => {
      alertStrings.header += ' ' + APP_NAME;
    });
    this.translateService.get('TABS.SETTINGS.ABOUT_TEXT').subscribe(ABOUT_TEXT => {
      alertStrings.message = ABOUT_TEXT;
    });

    const alert = await this.alertController.create({
      cssClass: 'alert-full-width',
      header: alertStrings.header,
      message: alertStrings.message,
      buttons: [{ text: alertStrings.ok }]
    });

    await alert.present();
  }

  // Gets called by this.retrieveSettingsFromStorage()
  listenForSettingsFormChanges(): void {
    this.settingsForm.valueChanges.subscribe(value => {
      this.saveSettingsToStorage();
    });
  }

  listenForThemeChanges(): void {
    this.settingsForm.controls.forceDarkMode.valueChanges.subscribe(value => {
      this.themeService.applyTheme();
    });
  }

  async saveSettingsToStorage() {
    if (this.settingsForm.valid) {
      this.storageService.saveSettingsToStorage(this.settingsForm.value);
    }
  }

  async retrieveSettingsFromStorage() {
    this.retrievedSettings = await this.storageService.retrieveSettingsFromStorage();

    if (this.retrievedSettings) {
      if (this.retrievedSettings.hasOwnProperty('hideTotalCostsInOverview')) {
        this.settingsForm.patchValue({
          hideTotalCostsInOverview: this.retrievedSettings.hideTotalCostsInOverview,
        });
      }
      if (this.retrievedSettings.hasOwnProperty('forceDarkMode')) {
        this.settingsForm.patchValue({
          forceDarkMode: this.retrievedSettings.forceDarkMode,
        });
      }
      if (this.retrievedSettings.hasOwnProperty('currency')) {
        this.settingsForm.patchValue({
          currency: this.retrievedSettings.currency,
        });
      }
      if (this.retrievedSettings.hasOwnProperty('notificationBeforeCancelationPeriodInDays')) {
        this.settingsForm.patchValue({
          notificationBeforeCancelationPeriodInDays: this.retrievedSettings.notificationBeforeCancelationPeriodInDays,
        });
      }
      this.listenForSettingsFormChanges();
    } else {
      this.listenForSettingsFormChanges();
    }
  }

  async backup() {
    const alertStrings: any = {};

    this.translateService.get('GENERAL.CANCEL').subscribe(CANCEL => {
      alertStrings.cancel = CANCEL;
    });
    this.translateService.get('TABS.SETTINGS.BACKUP').subscribe(BACKUP => {
      alertStrings.header = BACKUP;
    });
    this.translateService.get('TABS.SETTINGS.COPY_TO_CLIPBOARD').subscribe(COPY_TO_CLIPBOARD => {
      alertStrings.copyToClipboard = COPY_TO_CLIPBOARD;
    });

    const alert = await this.alertController.create({
      cssClass: 'alert-full-width',
      header: alertStrings.header,
      message: await this.storageService.backupAllData(),
      buttons: [
        {
          text: alertStrings.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: alertStrings.copyToClipboard,
          cssClass: 'secondary',
          handler: async () => {
            this.copyTextToClipboard(await this.storageService.backupAllData());
        }
      }]
    });

    await alert.present();
  }

  async restore() {
    const alertStrings: any = {};

    this.translateService.get('GENERAL.CANCEL').subscribe(CANCEL => {
      alertStrings.cancel = CANCEL;
    });
    this.translateService.get('TABS.SETTINGS.RESTORE').subscribe(RESTORE => {
      alertStrings.header = RESTORE;
    });
    this.translateService.get('TABS.SETTINGS.BACKUP_DATA').subscribe(BACKUP_DATA => {
      alertStrings.backupData = BACKUP_DATA;
    });
    this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP').subscribe(RESTORE_BACKUP => {
      alertStrings.restoreBackup = RESTORE_BACKUP;
    });

    const alert = await this.alertController.create({
      cssClass: 'alert-full-width',
      header: alertStrings.header,
      inputs: [
        {
          name: 'restore',
          type: 'textarea',
          placeholder: alertStrings.backupData
        }
      ],
      buttons: [
        {
          text: alertStrings.cancel,
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
        text: alertStrings.restoreBackup,
        cssClass: 'secondary',
        handler: async (inputs) => {
          await this.storageService.restoreAllData(inputs.restore);
        }
      }]
    });

    await alert.present();
  }

  copyTextToClipboard(val: string){
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

}
