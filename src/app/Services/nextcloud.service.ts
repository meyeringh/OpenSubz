import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Browser } from '@capacitor/browser';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { ToastController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { PreferencesService } from './preferences.service';

interface NextcloudConfig {
    server: string;
    loginName: string;
    appPassword: string;
    remotePath: string;
    lastSyncTimestamp: number;
}

interface LoginFlowInit {
    poll: {
        token: string;
        endpoint: string;
    };
    login: string;
}

@Injectable({
    providedIn: 'root'
})
export class NextcloudService {
    private config: NextcloudConfig | null = null;
    private pollInterval: ReturnType<typeof setInterval> | null = null;
    private readonly CONFIG_KEY = 'nextcloud_config';
    private readonly BACKUP_FILENAME = 'OpenSubz-backup.json';

    constructor(
        private toastController: ToastController,
        private translateService: TranslateService,
        private preferencesService: PreferencesService
    ) {
        this.loadConfig();
    }

    async loadConfig(): Promise<NextcloudConfig | null> {
        const result = await Preferences.get({ key: this.CONFIG_KEY });
        if (result.value) {
            this.config = JSON.parse(result.value);
        }
        return this.config;
    }

    async saveConfig(config: NextcloudConfig): Promise<void> {
        this.config = config;
        await Preferences.set({
            key: this.CONFIG_KEY,
            value: JSON.stringify(config)
        });
    }

    async clearConfig(): Promise<void> {
        this.config = null;
        await Preferences.remove({ key: this.CONFIG_KEY });
    }

    isConfigured(): boolean {
        return this.config !== null && !!this.config.server && !!this.config.appPassword;
    }

    getConfig(): NextcloudConfig | null {
        return this.config;
    }

    private normalizeServerUrl(url: string): string {
        let normalized = url.trim();
        if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
            normalized = 'https://' + normalized;
        }
        if (normalized.endsWith('/')) {
            normalized = normalized.slice(0, -1);
        }
        return normalized;
    }

    async startLoginFlow(serverUrl: string, remotePath: string): Promise<boolean> {
        const server = this.normalizeServerUrl(serverUrl);
        const loginUrl = `${server}/index.php/login/v2`;

        console.log('Starting login flow to:', loginUrl);

        try {
            const response: HttpResponse = await CapacitorHttp.request({
                method: 'POST',
                url: loginUrl,
                headers: {
                    'User-Agent': 'OpenSubz/1.0'
                }
            });

            console.log('Login flow response:', response.status, response.data);

            if (response.status !== 200) {
                throw new Error(`Failed to initiate login flow: ${response.status}`);
            }

            const data: LoginFlowInit = typeof response.data === 'string'
                ? JSON.parse(response.data)
                : response.data;

            if (!data.poll || !data.login) {
                throw new Error('Invalid response from server');
            }

            this.config = {
                server,
                loginName: '',
                appPassword: '',
                remotePath: remotePath || '/OpenSubz',
                lastSyncTimestamp: 0
            };

            await Browser.open({ url: data.login });

            this.startPolling(data.poll.endpoint, data.poll.token, remotePath);

            return true;
        } catch (e) {
            console.error('Login flow error:', e);
            this.showToast('TABS.SETTINGS.NEXTCLOUD.CONNECTION_ERROR');
            return false;
        }
    }

    private startPolling(endpoint: string, token: string, remotePath: string): void {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
        }

        let attempts = 0;
        const maxAttempts = 120;

        this.pollInterval = setInterval(async () => {
            attempts++;

            if (attempts > maxAttempts) {
                this.stopPolling();
                this.showToast('TABS.SETTINGS.NEXTCLOUD.LOGIN_TIMEOUT');
                return;
            }

            try {
                const response = await CapacitorHttp.post({
                    url: endpoint,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    data: `token=${token}`
                });

                if (response.status === 200) {
                    this.stopPolling();
                    await Browser.close();

                    const { server, loginName, appPassword } = response.data;

                    await this.saveConfig({
                        server,
                        loginName,
                        appPassword,
                        remotePath: remotePath || '/OpenSubz',
                        lastSyncTimestamp: 0
                    });

                    await this.ensureRemoteDirectory();
                    this.showToast('TABS.SETTINGS.NEXTCLOUD.LOGIN_SUCCESS');
                }
            } catch (e) {
                // 404 means still waiting for auth, continue polling
            }
        }, 2000);
    }

    private stopPolling(): void {
        if (this.pollInterval) {
            clearInterval(this.pollInterval);
            this.pollInterval = null;
        }
    }

    private getWebDavUrl(): string {
        if (!this.config) return '';
        return `${this.config.server}/remote.php/dav/files/${this.config.loginName}`;
    }

    private getAuthHeader(): string {
        if (!this.config) return '';
        return 'Basic ' + btoa(`${this.config.loginName}:${this.config.appPassword}`);
    }

    async ensureRemoteDirectory(): Promise<boolean> {
        if (!this.config) return false;

        const webdavUrl = this.getWebDavUrl();
        const remotePath = this.config.remotePath;

        console.log('Creating remote directory:', `${webdavUrl}${remotePath}`);

        try {
            const response = await CapacitorHttp.request({
                method: 'MKCOL',
                url: `${webdavUrl}${remotePath}`,
                headers: {
                    'Authorization': this.getAuthHeader()
                }
            });

            console.log('MKCOL response:', response.status);

            // 201 = created, 405 = already exists
            if (response.status === 201 || response.status === 405) {
                return true;
            }

            return false;
        } catch (e) {
            console.error('ensureRemoteDirectory error:', e);
            return false;
        }
    }

    async uploadBackup(): Promise<boolean> {
        if (!this.isConfigured()) {
            return false;
        }

        try {
            await this.ensureRemoteDirectory();

            const backupData = await this.preferencesService.getAllData();
            const webdavUrl = this.getWebDavUrl();
            const filePath = `${this.config!.remotePath}/${this.BACKUP_FILENAME}`;

            console.log('Uploading to:', `${webdavUrl}${filePath}`);

            const response = await CapacitorHttp.request({
                method: 'PUT',
                url: `${webdavUrl}${filePath}`,
                headers: {
                    'Authorization': this.getAuthHeader(),
                    'Content-Type': 'application/json'
                },
                data: backupData
            });

            console.log('Upload response:', response.status);

            if (response.status >= 200 && response.status < 300) {
                this.config!.lastSyncTimestamp = Date.now();
                await this.saveConfig(this.config!);
                this.showToast('TABS.SETTINGS.NEXTCLOUD.UPLOAD_SUCCESS');
                return true;
            }

            this.showToast('TABS.SETTINGS.NEXTCLOUD.UPLOAD_ERROR');
            return false;
        } catch (e) {
            console.error('Upload error:', e);
            this.showToast('TABS.SETTINGS.NEXTCLOUD.UPLOAD_ERROR');
            return false;
        }
    }

    async downloadBackup(): Promise<string | null> {
        if (!this.isConfigured()) {
            return null;
        }

        try {
            const webdavUrl = this.getWebDavUrl();
            const filePath = `${this.config!.remotePath}/${this.BACKUP_FILENAME}`;

            console.log('Downloading from:', `${webdavUrl}${filePath}`);

            const response = await CapacitorHttp.request({
                method: 'GET',
                url: `${webdavUrl}${filePath}`,
                headers: {
                    'Authorization': this.getAuthHeader()
                },
                responseType: 'text'
            });

            console.log('Download response:', response.status);

            if (response.status === 200) {
                return typeof response.data === 'string'
                    ? response.data
                    : JSON.stringify(response.data);
            }

            return null;
        } catch (e) {
            console.error('Download error:', e);
            return null;
        }
    }

    async downloadAndRestore(): Promise<boolean> {
        const data = await this.downloadBackup();
        if (data) {
            await this.preferencesService.restoreAllData(data, false);
            this.config!.lastSyncTimestamp = Date.now();
            await this.saveConfig(this.config!);
            this.showToast('TABS.SETTINGS.NEXTCLOUD.DOWNLOAD_SUCCESS');
            return true;
        }
        this.showToast('TABS.SETTINGS.NEXTCLOUD.DOWNLOAD_ERROR');
        return false;
    }

    async sync(): Promise<{ success: boolean; action: 'uploaded' | 'downloaded' | 'none' | 'error' }> {
        if (!this.isConfigured()) {
            console.log('Sync: not configured');
            return { success: false, action: 'none' };
        }

        console.log('Starting sync...');

        try {
            await this.ensureRemoteDirectory();

            const localData = await this.preferencesService.getAllData();
            const localObj = JSON.parse(localData);
            const remoteData = await this.downloadBackup();

            console.log('Remote data exists:', !!remoteData);

            if (!remoteData) {
                console.log('No remote data, uploading...');
                const uploaded = await this.uploadBackup();
                return { success: uploaded, action: uploaded ? 'uploaded' : 'error' };
            }

            const remoteObj = JSON.parse(remoteData);

            const localNewest = this.getNewestTimestamp(localObj.subscriptions);
            const remoteNewest = this.getNewestTimestamp(remoteObj.subscriptions);

            console.log('Local newest:', localNewest, 'Remote newest:', remoteNewest);

            if (localNewest > remoteNewest) {
                console.log('Local is newer, uploading...');
                const uploaded = await this.uploadBackup();
                return { success: uploaded, action: uploaded ? 'uploaded' : 'error' };
            } else if (remoteNewest > localNewest) {
                console.log('Remote is newer, downloading...');
                await this.preferencesService.restoreAllData(remoteData, false);
                this.config!.lastSyncTimestamp = Date.now();
                await this.saveConfig(this.config!);
                this.showToast('TABS.SETTINGS.NEXTCLOUD.SYNC_DOWNLOADED');
                return { success: true, action: 'downloaded' };
            }

            console.log('Already in sync');
            this.config!.lastSyncTimestamp = Date.now();
            await this.saveConfig(this.config!);
            this.showToast('TABS.SETTINGS.NEXTCLOUD.SYNC_SUCCESS');
            return { success: true, action: 'none' };
        } catch (e) {
            console.error('Sync error:', e);
            this.showToast('TABS.SETTINGS.NEXTCLOUD.SYNC_ERROR');
            return { success: false, action: 'error' };
        }
    }

    private getNewestTimestamp(subscriptions: any[]): number {
        if (!subscriptions || subscriptions.length === 0) return 0;

        return subscriptions.reduce((newest, sub) => {
            const edited = sub.lastEdited || 0;
            const created = sub.created || 0;
            return Math.max(newest, edited, created);
        }, 0);
    }

    async disconnect(): Promise<void> {
        this.stopPolling();
        await this.clearConfig();
        this.showToast('TABS.SETTINGS.NEXTCLOUD.DISCONNECTED');
    }

    private async showToast(translationKey: string): Promise<void> {
        this.translateService.get(translationKey).subscribe(async message => {
            const toast = await this.toastController.create({
                message,
                duration: 3000,
                cssClass: 'toast-center-text'
            });
            await toast.present();
        });
    }
}
