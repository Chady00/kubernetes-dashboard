import { TestBed } from '@angular/core/testing';

import { TerminalServices } from './terminal.service';

describe('TerminalService', () => {
  let service: TerminalServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerminalServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
