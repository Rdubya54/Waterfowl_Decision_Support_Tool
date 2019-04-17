import { TestBed } from '@angular/core/testing';

import { WatermanagementCloudService } from './watermanagement-cloud.service';

describe('WatermanagementCloudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WatermanagementCloudService = TestBed.get(WatermanagementCloudService);
    expect(service).toBeTruthy();
  });
});
