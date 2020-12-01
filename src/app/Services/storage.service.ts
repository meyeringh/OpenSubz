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

  async restoreAllData(backup: string) {
    let backupObject: { subscriptions: ISubscription[], settings: ISettings };
    try {
      backupObject = JSON.parse(backup);

      if (!backupObject.hasOwnProperty('subscriptions') && !backupObject.hasOwnProperty('settings')) {
        throw Error;
      }

      if (backupObject.hasOwnProperty('subscriptions')) {
        const subscriptions: ISubscription[] = backupObject.subscriptions;
        let isValid = true;

        for (const subscription of subscriptions) {
          // See: subscriptionInterface.ts
          // ToDo: More validation

          // Mandatory fields
          isValid = 'id' in subscription && typeof subscription.id === 'string' &&
                    'name' in subscription && typeof subscription.name === 'string' &&
                    'cost' in subscription && typeof subscription.cost === 'number';

          // Optional fields
          if ('description' in subscription) { isValid = typeof subscription.description === 'string'; }
        }
        if (isValid) {
          this.saveSubscriptionsToStorage(subscriptions);
        } else {
          throw Error;
        }
      }

      if (backupObject.hasOwnProperty('settings')) {
        const settings: ISettings = backupObject.settings;

        // ToDo: Validation of all settings properties

        this.saveSettingsToStorage(settings);
      }

      this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_SUCCESS').subscribe(RESTORE_BACKUP_SUCCESS => {
        this.toastMessage(RESTORE_BACKUP_SUCCESS);
      });
    } catch (exception) {
      this.translateService.get('TABS.SETTINGS.RESTORE_BACKUP_ERROR').subscribe(RESTORE_BACKUP_ERROR => {
        this.toastMessage(RESTORE_BACKUP_ERROR);
      });
    }
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
