import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { PreferencesService } from 'src/app/Services/preferences.service';
import { ThemeService } from 'src/app/Services/theme.service';
import { ISettings } from '../Interfaces/settingsInterface';
import { currencies } from './CURRENCIES';
import { dateFormats } from './DATE_FORMATS';
import { addIcons } from "ionicons";
import { arrowBack, cash, calendar } from "ionicons/icons";
import { IonRouterLink } from "@ionic/angular/standalone";

@Component({
    selector: 'app-region',
    templateUrl: './region.page.html',
    styleUrls: ['./region.page.scss'],
    standalone: false
})
export class RegionPage implements OnInit {
    settingsForm: UntypedFormGroup;
    retrievedSettings: ISettings;
    currencyList = currencies;
    dateFormatList = dateFormats;
    settingsFormChangeSubscription: Subscription;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private preferencesService: PreferencesService,
        public themeService: ThemeService) {
        this.settingsForm = this.formBuilder.group({
            currency: this.currencyList[0],
            dateFormat: this.dateFormatList[0],
        });
        addIcons({ arrowBack, cash, calendar });
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

}
