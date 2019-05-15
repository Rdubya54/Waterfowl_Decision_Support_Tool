import { TestBed } from '@angular/core/testing';

import { BiweeklyWaterFoodService } from './waterfood-cloud.service';

describe('BiweeklyWaterFoodService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BiweeklyWaterFoodService = TestBed.get(BiweeklyWaterFoodService);
    expect(service).toBeTruthy();
  });
});
