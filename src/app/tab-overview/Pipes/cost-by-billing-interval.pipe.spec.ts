import { CostByBillingIntervalPipe } from './cost-by-billing-interval.pipe';

describe('CostByBillingIntervalPipe', () => {
  it('create an instance', () => {
    const pipe = new CostByBillingIntervalPipe();
    expect(pipe).toBeTruthy();
  });
});
