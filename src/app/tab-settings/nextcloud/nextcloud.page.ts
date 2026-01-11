import { Component, OnInit } from '@angular/core';
import { NextcloudService } from 'src/app/Services/nextcloud.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { addIcons } from "ionicons";
import { arrowBack, cloudUpload, cloudDownload, cloud, logOut, sync } from "ionicons/icons";

@Component({
    selector: 'app-nextcloud',
    templateUrl: './nextcloud.page.html',
    styleUrls: ['./nextcloud.page.scss'],
    standalone: false
})
export class NextcloudPage implements OnInit {
    serverUrl: string = '';
    remotePath: string = '/OpenSubz';
    isConnecting: boolean = false;
    isSyncing: boolean = false;
    lastSyncTime: string = '';

    constructor(
        public nextcloudService: NextcloudService,
        public themeService: ThemeService
    ) {
        addIcons({
            'arrow-back': arrowBack,
            'cloud-upload': cloudUpload,
            'cloud-download': cloudDownload,
            'cloud': cloud,
            'log-out': logOut,
            'sync': sync
        });
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.loadConfig();
    }

    loadConfig() {
        const config = this.nextcloudService.getConfig();
        if (config) {
            this.serverUrl = config.server;
            this.remotePath = config.remotePath;
            if (config.lastSyncTimestamp) {
                this.lastSyncTime = new Date(config.lastSyncTimestamp).toLocaleString();
            }
        }
    }

    async connect() {
        if (!this.serverUrl) return;

        this.isConnecting = true;
        await this.nextcloudService.startLoginFlow(this.serverUrl, this.remotePath);
        this.isConnecting = false;
        this.loadConfig();
    }

    async disconnect() {
        await this.nextcloudService.disconnect();
        this.serverUrl = '';
        this.remotePath = '/OpenSubz';
        this.lastSyncTime = '';
    }

    async syncNow() {
        this.isSyncing = true;
        const result = await this.nextcloudService.sync();
        this.isSyncing = false;
        this.loadConfig();
    }

    async uploadNow() {
        this.isSyncing = true;
        await this.nextcloudService.uploadBackup();
        this.isSyncing = false;
        this.loadConfig();
    }

    async downloadNow() {
        this.isSyncing = true;
        await this.nextcloudService.downloadAndRestore();
        this.isSyncing = false;
        this.loadConfig();
    }

    isConfigured(): boolean {
        return this.nextcloudService.isConfigured();
    }
}
