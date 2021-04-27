import { TestBed } from '@angular/core/testing';

import { TabHideService } from './tab-hide.service';

describe('TabHideService', () => {
  let service: TabHideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabHideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
