// Don't forget to apply changes to the validation in storage.service.restoreAllData() corresponding to the changes here
export interface ISubscription {
    id: number; // Begins with 1, unique
    name: string;
    description?: string;
    cost: number;
    color: 'BLUE' | 'GREEN' | 'YELLOW' | 'RED' | 'GREY';
    billingStart: string; // Ionic uses the ISO 8601 datetime format, in this case in format: YYYY-MM-DD
    billingEvery: number;
    billingInterval: 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS';
    contractStart: string; // Ionic uses the ISO 8601 datetime format, in this case in format: YYYY-MM-DD
    minimumContractDuration: number;
    minimumContractDurationInterval: 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS';
    extensionAfterMinimumContractDurationEvery: number;
    extensionAfterMinimumContractDurationInterval: 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS';
    cancelationPeriodEvery: number;
    cancelationPeriodInterval: 'DAYS' | 'WEEKS' | 'MONTHS' | 'YEARS';
    notificationBeforeCancelationPeriodInDays?: number;

    // The following are optional because they were introduced later

    lastEdited?: number; // Unix millis since 1970 using Date.now()
    created?: number; // Unix millis since 1970 using Date.now()
}
