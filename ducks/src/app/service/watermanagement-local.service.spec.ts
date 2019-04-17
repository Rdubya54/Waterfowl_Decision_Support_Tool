import { TestBed } from '@angular/core/testing';

import { LocalWaterManagementService } from './watermanagement-local.service';

describe('WatermanagementLocalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalWaterManagementService = TestBed.get(LocalWaterManagementService);
    expect(service).toBeTruthy();
  });
});
