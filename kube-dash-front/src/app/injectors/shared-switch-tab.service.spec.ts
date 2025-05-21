import { TestBed } from '@angular/core/testing';

import { SharedSwitchTabService } from './shared-switch-tab.service';

describe('SharedSwitchTabService', () => {
  let service: SharedSwitchTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedSwitchTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
