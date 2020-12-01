import { Component } from '@angular/core';
import { AlertController, ToastController, Platform } from '@ionic/angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { licenseText } from './Helpers/mit-license-text';
import { ISettings } from './Interfaces/settingsInterface';
import { StorageService } from '../Services/storage.service';
import { ThemeService } from '../Services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab-settings',
  templateUrl: 'tab-settings.page.html',
  styleUrls: ['tab-settings.page.scss']
})
export class TabSettingsPage {
  settingsForm: FormGroup;
  retrievedSettings: ISettings;
  currencyList = ['€', '$', '¥', '£', '₤', '₡', '₦', '₹', '₩', '₪', '₫', '₭', '₮', '₱', '₲', '₴', '₵', '₸', '₺', '₼', '₾'];
  settingsFormChangeSubscription: Subscription;

  constructor(
    public alertController: AlertController,
    private formBuilder: FormBuilder,
    private storageService: StorageService,
    public themeService: ThemeService,
    public translateService: TranslateService,
    private platform: Platform) {
    this.settingsForm = this.formBuilder.group({
      forceDarkMode: false,
      currency: '€',
      notificationBeforeCancelationPeriodInDays: null
    });
  }

  ionViewWillEnter() {
    this.retrieveSettingsFromStorage().then(() => {
      this.listenForSettingsFormChanges();
    });
  }

  ionViewWillLeave() {
    this.settingsFormChangeSubscription.unsubscribe();
  }

  async showLicense() {
    const alertStrings = {"ok": "", "header": ""};

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
    const alertStrings = {"ok": "", "header": "", "message": ""};

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

  listenForSettingsFormChanges(): void {
    this.settingsFormChangeSubscription = this.settingsForm.valueChanges.subscribe(() => {
      this.saveSettingsToStorage();
    });
  }

  async saveSettingsToStorage(): Promise<void> {
    if (this.settingsForm.valid) {
      const settings: ISettings = Object.assign(this.retrievedSettings, this.settingsForm.value);

      this.storageService.saveSettingsToStorage(settings).then(() => {
        this.themeService.applyTheme();
      });
    }
  }

  async retrieveSettingsFromStorage(): Promise<void> {
    this.retrievedSettings = await this.storageService.retrieveSettingsFromStorage();

    Object.keys(this.settingsForm.controls).forEach(key => {
      if (this.retrievedSettings.hasOwnProperty(key)) {
        this.settingsForm.patchValue({
          [key]: this.retrievedSettings[key]
        });
      }
    });
  }

  async backup(): Promise<void> {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.storageService.backupAllDataAndroid();
      }
      else if (this.platform.is('mobileweb')) {
        this.backupWeb();
      }
    });
  }

  async backupWeb(): Promise<void> {
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
      message: await this.storageService.getAllData(),
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
            this.copyTextToClipboard(await this.storageService.getAllData());
        }
      }]
    });

    await alert.present();
  }

  async restore(): Promise<void> {
    this.platform.ready().then(() => {
      if (this.platform.is('android')) {
        this.restoreAndroid();
      }
      else if (this.platform.is('mobileweb')) {
        this.restoreWeb();
      }
    });
  }

  async restoreAndroid(): Promise<void> {
    const alertStrings: any = {};

    this.translateService.get('GENERAL.CANCEL').subscribe(CANCEL => {
      alertStrings.cancel = CANCEL;
    });
    this.translateService.get('GENERAL.OK').subscribe(OK => {
      alertStrings.ok = OK;
    });
    this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_ALERT_HEADER').subscribe(RESTORE_BACKUP_ALERT_HEADER => {
      alertStrings.header = RESTORE_BACKUP_ALERT_HEADER;
    });
    this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_ALERT_MESSAGE').subscribe(RESTORE_BACKUP_ALERT_MESSAGE => {
      alertStrings.message = RESTORE_BACKUP_ALERT_MESSAGE;
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
            this.storageService.restoreAllDataAndroid().then(() => {
              this.ionViewWillEnter();
              this.themeService.applyTheme();
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async restoreWeb(): Promise<void> {
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
          await this.storageService.restoreAllData(inputs.restore).then(() => {
            this.ionViewWillEnter();
            this.themeService.applyTheme();
          });
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

  async showHelpTextsInOverview(): Promise<void> {
    this.retrievedSettings.hideOverviewHelperTextGeneral = false;
    this.retrievedSettings.hideOverviewHelperTextMenuBar = false;

    this.storageService.saveSettingsToStorage(this.retrievedSettings);
  }

}
