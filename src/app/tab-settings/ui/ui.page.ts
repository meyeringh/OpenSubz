import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PreferencesService } from 'src/app/Services/preferences.service';
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
        private preferencesService: PreferencesService,
        public themeService: ThemeService,
        private router: Router
    ) {
        this.settingsForm = this.formBuilder.group({
            forceDarkMode: false,
            notificationBeforeCancelationPeriodInDays: null
        });
        addIcons({
            'arrow-back': arrowBack,
            'moon':       moon,
            'calendar':   calendar,
            'help-buoy':  helpBuoy
        });
    }

    ngOnInit() {
    }

    ionViewWillEnter() {
        this.retrieveSettingsFromPreferences().then(() => {
            this.listenForSettingsFormChanges();
        });
    }

    ionViewWillLeave() {
        this.settingsFormChangeSubscription.unsubscribe();
    }

    listenForSettingsFormChanges(): void {
        this.settingsFormChangeSubscription = this.settingsForm.valueChanges.subscribe(() => {
            this.saveSettingsToPreferences();
        });
    }

    async saveSettingsToPreferences(): Promise<void> {
        if (this.settingsForm.valid) {
            const settings: ISettings = Object.assign(this.retrievedSettings, this.settingsForm.value);

            this.preferencesService.saveSettingsToPreferences(settings).then(() => {
                this.themeService.applyTheme();
            });
        }
    }

    async retrieveSettingsFromPreferences(): Promise<void> {
        this.retrievedSettings = await this.preferencesService.retrieveSettingsFromPreferences();

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

        this.preferencesService.saveSettingsToPreferences(this.retrievedSettings);
        this.router.navigate(['tabs/overview']);
    }

}
