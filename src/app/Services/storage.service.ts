import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { ISubscription } from '../tab-overview/Interfaces/subscriptionInterface';
import { ISettings } from '../tab-settings/Interfaces/settingsInterface';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

const { Storage } = Plugins;

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
      return null;
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
      return null;
    }
  }

  async saveSettingsToStorage(settings: ISettings) {
    await Storage.set({
      key: 'settings',
      value: JSON.stringify(settings)
    });
  }

  async backupAllData() {
    const entries = await this.retrieveSubscriptionsFromStorage();
    const set = await this.retrieveSettingsFromStorage();

    const backup = {
      subscriptions: entries,
      settings: set
    };

    return JSON.stringify(backup);
  }

  async restoreAllData(backup: string) {
    let backupObject: { subscriptions: ISubscription[], settings: ISettings };
    try {
      backupObject = JSON.parse(backup);

      if (!backupObject.hasOwnProperty('subscriptions') && !backupObject.hasOwnProperty('settings')) {
        throw Error;
      }

      if (backupObject.hasOwnProperty('subscriptions')) {
        const subscriptions: ISubscription[] = backupObject.subscriptions;

        for (const subscription of subscriptions) {
          // ToDo: Validation with subscription.hasOwnProperty and typeof(subscription.attribute)
        }
        this.saveSubscriptionsToStorage(subscriptions);
      }

      if (backupObject.hasOwnProperty('settings')) {
        const settings: ISettings = backupObject.settings;

        // ToDo: Validation of all settings properties

        this.saveSettingsToStorage(settings);
      }

      this.presentRestoreSuccessfulToast();
    } catch (exception) {
      this.presentRestoreErrorToast();
    }
  }

  async presentRestoreSuccessfulToast() {
    this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_SUCCESS').subscribe(RESTORE_BACKUP_SUCCESS => {
      this.toastMessage(RESTORE_BACKUP_SUCCESS);
    });
  }

  async presentRestoreErrorToast() {
    this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_ERROR').subscribe(RESTORE_BACKUP_ERROR => {
      this.toastMessage(RESTORE_BACKUP_ERROR);
    });
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
