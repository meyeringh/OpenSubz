// Don't forget to apply changes to the validation in preferences.service.restoreAllData() corresponding to the changes here
export interface ISettings {
    forceDarkMode?: boolean;
    currency?: string;
    dateFormat?: string;
    notificationBeforeCancelationPeriodInDays?: number;
    defaultBillingInterval?: string;
    defaultSortBy?: string;
    hideOverviewHelperTextGeneral?: boolean;
    hideOverviewHelperTextMenuBar?: boolean;
}
