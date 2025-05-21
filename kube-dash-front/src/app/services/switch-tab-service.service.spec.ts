import { TestBed } from '@angular/core/testing';

import { SwitchTabServiceService } from '../services/switch-tab-service.service';

describe('SwitchTabServiceService', () => {
  let service: SwitchTabServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwitchTabServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
