export interface ISubscription {
    id: string; // uuid, unique
    name: string;
    description?: string;
    cost: number;
    billingStart: string; // Ionic uses the ISO 8601 datetime format, in this case in format: YYYY-MM-DD
    billingEvery: number;
    billingInterval: 'day' | 'week' | 'month' | 'year';
    minimumContractDuration: number;
    minimumContractDurationInterval: 'day' | 'week' | 'month' | 'year';
    extensionAfterMinimumContractDurationEvery: number;
    extensionAfterMinimumContractDurationInterval: 'day' | 'week' | 'month' | 'year';
    cancelationPeriodEvery: number;
    cancelationPeriodInterval: 'day' | 'week' | 'month' | 'year';
    notificationBeforeCancelationPeriodInDays?: number;
    color: 'medium' | 'danger' | 'primary' | 'success' | 'warning';
}
