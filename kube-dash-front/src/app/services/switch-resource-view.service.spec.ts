import { TestBed } from '@angular/core/testing';

import { SwitchResourceViewService } from './switch-resource-view.service';

describe('SwitchResourceViewService', () => {
  let service: SwitchResourceViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwitchResourceViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
