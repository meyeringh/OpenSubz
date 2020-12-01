import { Injectable } from '@angular/core';
import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
import { ISubscription } from '../tab-overview/Interfaces/subscriptionInterface';
import { ISettings } from '../tab-settings/Interfaces/settingsInterface';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

const { Storage } = Plugins;
const { Filesystem } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private toastController: ToastController,
    private translateService: TranslateService) { }

  async retrieveSubscriptionsFromStorage(): Promise<ISubscription[]> {
    const entries = await Storage.get({ key: 'subscriptions' });
    if (entries.value) {
      return JSON.parse(entries.value);
    } else {
      return [];
    }
  }

  async saveSubscriptionsToStorage(entries: ISubscription[]) {
    await Storage.set({
      key: 'subscriptions',
      value: JSON.stringify(entries)
    });
  }

  async retrieveSettingsFromStorage(): Promise<ISettings> {
    const settingsString = await Storage.get({ key: 'settings' });
    if (settingsString.value) {
      return JSON.parse(settingsString.value);
    } else {
      return {};
    }
  }

  async saveSettingsToStorage(settings: ISettings) {
    await Storage.set({
      key: 'settings',
      value: JSON.stringify(settings)
    });
  }

  async getAllData(): Promise<string> {
    const entries = await this.retrieveSubscriptionsFromStorage();
    const set = await this.retrieveSettingsFromStorage();

    const backup = {
      subscriptions: entries,
      settings: set
    };

    return JSON.stringify(backup);
  }

  async backupAllDataAndroid() {
    const backup = await this.getAllData();

    try {
      await Filesystem.writeFile({
        path: 'subz-backup.json',
        data: backup,
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      })
      
      this.translateService.get('TABS.SETTINGS.BACKUP_SUCCESS').subscribe(BACKUP_SUCCESS => {
        this.toastMessage(BACKUP_SUCCESS + ' Documents/subz-backup.json');
      });

    } catch(e) {
      this.translateService.get('TABS.SETTINGS.BACKUP_ERROR').subscribe(BACKUP_ERROR => {
        this.toastMessage(BACKUP_ERROR);
      });
    }
  }

  async restoreAllDataAndroid() {
    try {
      await Filesystem.readFile({
        path: 'subz-backup.json',
        directory: FilesystemDirectory.Documents,
        encoding: FilesystemEncoding.UTF8
      }).then((fileReadResult) => {
        this.restoreAllData(fileReadResult.data);
      });

      this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_SUCCESS').subscribe(RESTORE_BACKUP_SUCCESS => {
        this.toastMessage(RESTORE_BACKUP_SUCCESS);
      });

    } catch(e) {
      this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_ERROR_ANDROID').subscribe(RESTORE_BACKUP_ERROR_ANDROID => {
        this.toastMessage(RESTORE_BACKUP_ERROR_ANDROID);
      });
    }
  }

  async restoreAllData(backup: string) {
    let backupObject: { subscriptions: ISubscription[], settings: ISettings };
    try {
      backupObject = JSON.parse(backup);

      if (!backupObject.hasOwnProperty('subscriptions') && !backupObject.hasOwnProperty('settings')) {
        throw Error;
      }

      // SUBSCRIPTIONS
      const subscriptions: ISubscription[] = backupObject.subscriptions;
      let isValid = true;

      for (const subscription of subscriptions) {
        // Mandatory fields
        isValid = 'id' in subscription && typeof subscription.id === 'number' &&
                  'name' in subscription && typeof subscription.name === 'string' &&
                  'cost' in subscription && typeof subscription.cost === 'number' &&
                  'color' in subscription && typeof subscription.color === 'string' &&
                  'billingStart' in subscription && typeof subscription.billingStart === 'string' &&
                  'billingEvery' in subscription && typeof subscription.billingEvery === 'number' &&
                  'billingInterval' in subscription && typeof subscription.billingInterval === 'string' &&
                  'contractStart' in subscription && typeof subscription.contractStart === 'string' &&
                  'minimumContractDuration' in subscription && typeof subscription.minimumContractDuration === 'number' &&
                  'minimumContractDurationInterval' in subscription && typeof subscription.minimumContractDurationInterval === 'string' &&
                  'extensionAfterMinimumContractDurationEvery' in subscription && typeof subscription.extensionAfterMinimumContractDurationEvery === 'number';
                  'extensionAfterMinimumContractDurationInterval' in subscription && typeof subscription.extensionAfterMinimumContractDurationInterval === 'string' &&
                  'cancelationPeriodEvery' in subscription && typeof subscription.cancelationPeriodEvery === 'number' &&
                  'cancelationPeriodInterval' in subscription && typeof subscription.cancelationPeriodInterval === 'string';
        if (!isValid) { throw Error; }

        // Optional fields
        if ('description' in subscription) { this.throwErrorHelper(typeof subscription.description !== 'string'); }
        if ('notificationBeforeCancelationPeriodInDays' in subscription) {
          this.throwErrorHelper(typeof subscription.notificationBeforeCancelationPeriodInDays !== 'number' && typeof subscription.notificationBeforeCancelationPeriodInDays !== 'object');
        }
      }
      
      // SETTINGS
      const settings: ISettings = backupObject.settings;

      if ('forceDarkMode' in settings) { this.throwErrorHelper(typeof settings.forceDarkMode !== 'boolean') }
      if ('currency' in settings) { this.throwErrorHelper(typeof settings.currency !== 'string') }
      if ('notificationBeforeCancelationPeriodInDays' in settings) {
        // Can be null, so it can be an object
        this.throwErrorHelper(typeof settings.notificationBeforeCancelationPeriodInDays !== 'number' && typeof settings.notificationBeforeCancelationPeriodInDays !== 'object');
      }
      if ('defaultBillingInterval' in settings) { this.throwErrorHelper(typeof settings.defaultBillingInterval !== 'string') }
      if ('defaultSortBy' in settings) { this.throwErrorHelper(typeof settings.defaultSortBy !== 'string') }
      if ('hideOverviewHelperTextGeneral' in settings) { this.throwErrorHelper(typeof settings.hideOverviewHelperTextGeneral !== 'boolean') }
      if ('hideOverviewHelperTextMenuBar' in settings) { this.throwErrorHelper(typeof settings.hideOverviewHelperTextMenuBar !== 'boolean') }

      this.saveSubscriptionsToStorage(subscriptions);
      this.saveSettingsToStorage(settings);

      this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_SUCCESS').subscribe(RESTORE_BACKUP_SUCCESS => {
        this.toastMessage(RESTORE_BACKUP_SUCCESS);
      });
    } catch (exception) {
      this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_ERROR').subscribe(RESTORE_BACKUP_ERROR => {
        this.toastMessage(RESTORE_BACKUP_ERROR);
      });
    }
  }

  throwErrorHelper(boolVar: boolean) {
    if (boolVar) { throw Error; }
  }

  async toastMessage(toastMessage: string) {
    const toast = await this.toastController.create({
      cssClass: 'toast-center-text',
      message: toastMessage,
      duration: 3000
    });
    toast.present();
  }
}
