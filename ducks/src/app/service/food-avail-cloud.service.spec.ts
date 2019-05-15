import { TestBed } from '@angular/core/testing';

import { FoodAvailCloudService } from './food-avail-cloud.service';

describe('FoodAvailCloudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoodAvailCloudService = TestBed.get(FoodAvailCloudService);
    expect(service).toBeTruthy();
  });
});
