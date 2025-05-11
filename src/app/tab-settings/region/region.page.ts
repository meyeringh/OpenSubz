import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/Services/storage.service';
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
        private storageService: StorageService,
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

}
