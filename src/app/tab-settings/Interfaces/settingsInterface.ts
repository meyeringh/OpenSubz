// Don't forget to apply changes to the validation in storage.service.restoreAllData() corresponding to the changes here
export interface ISettings {
    forceDarkMode?: boolean;
    currency?: string;
    notificationBeforeCancelationPeriodInDays?: number;
    defaultBillingInterval?: string;
    defaultSortBy?: string;
    hideOverviewHelperTextGeneral?: boolean;
    hideOverviewHelperTextMenuBar?: boolean;
}
