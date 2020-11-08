import { TestBed } from '@angular/core/testing';

import { CityesService } from './cityes.service';

describe('CityesService', () => {
  let service: CityesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CityesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
