import { TestBed } from '@angular/core/testing';

import { AvtoschoolsService } from './avtoschools.service';

describe('AvtoschoolsService', () => {
  let service: AvtoschoolsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AvtoschoolsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
