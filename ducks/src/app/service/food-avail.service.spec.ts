import { TestBed } from '@angular/core/testing';

import { FoodAvailLocalService } from './food-avail-local.service';

describe('FoodAvailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FoodAvailLocalService = TestBed.get(FoodAvailLocalService);
    expect(service).toBeTruthy();
  });
});
