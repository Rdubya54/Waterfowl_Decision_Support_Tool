import { TestBed } from '@angular/core/testing';

import { WCSService } from './wcs.service';

describe('WCSService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WCSService = TestBed.get(WCSService);
    expect(service).toBeTruthy();
  });
});
