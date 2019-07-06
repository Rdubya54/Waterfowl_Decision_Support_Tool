import { TestBed } from '@angular/core/testing';

import { GaugeStatLocalService } from './gauge-stat-local.service';

describe('GaugeStatLocalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GaugeStatLocalService = TestBed.get(GaugeStatLocalService);
    expect(service).toBeTruthy();
  });
});
