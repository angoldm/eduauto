import { TestBed } from '@angular/core/testing';

import { ReqStatusService } from './req-status.service';

describe('ReqStatusService', () => {
  let service: ReqStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReqStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
