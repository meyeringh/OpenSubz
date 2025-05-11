import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/Services/storage.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { ISettings } from '../Interfaces/settingsInterface';
import { addIcons } from "ionicons";
import { arrowBack, moon, calendar, helpBuoy } from "ionicons/icons";
import { IonRouterLink } from "@ionic/angular/standalone";

@Component({
    selector: 'app-ui',
    templateUrl: './ui.page.html',
    styleUrls: ['./ui.page.scss'],
    standalone: false
})
export class UiPage implements OnInit {
    settingsForm: UntypedFormGroup;
    retrievedSettings: ISettings;
    settingsFormChangeSubscription: Subscription;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private storageService: StorageService,
        public themeService: ThemeService,
        private router: Router
    ) {
        this.settingsForm = this.formBuilder.group({
            forceDarkMode: false,
            notificationBeforeCancelationPeriodInDays: null
        });
        addIcons({ arrowBack, moon, calendar, helpBuoy });
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.retrieveSettingsFromStorage().then(() => {
            this.listenForSettingsFormChanges();
        });
    }

    ionViewWillLeave() {
        this.settingsFormChangeSubscription.unsubscribe();
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

    async showHelpTextsInOverview(): Promise<void> {
        this.retrievedSettings.hideOverviewHelperTextGeneral = false;
        this.retrievedSettings.hideOverviewHelperTextMenuBar = false;

        this.storageService.saveSettingsToStorage(this.retrievedSettings);
        this.router.navigate(['tabs/overview']);
    }

}
