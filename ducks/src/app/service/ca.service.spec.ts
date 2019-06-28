import { TestBed } from '@angular/core/testing';

import { CAService } from './ca.service';

describe('CAService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CAService = TestBed.get(CAService);
    expect(service).toBeTruthy();
  });
});
