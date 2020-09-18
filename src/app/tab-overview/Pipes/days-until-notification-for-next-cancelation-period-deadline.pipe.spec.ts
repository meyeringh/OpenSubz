import { daysUntilNotificationForNextCancelationPeriodDeadlinePipe } from './days-until-notification-for-next-cancelation-period-deadline.pipe';

describe('daysUntilNotificationForNextCancelationPeriodDeadlinePipe', () => {
  it('create an instance', () => {
    const pipe = new daysUntilNotificationForNextCancelationPeriodDeadlinePipe();
    expect(pipe).toBeTruthy();
  });
});
