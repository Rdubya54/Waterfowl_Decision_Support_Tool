import { TestBed } from '@angular/core/testing';

import { LocalWaterFood } from './biweekly-waterfood-local.service';

describe('WaterfoodLocalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalWaterFood = TestBed.get(LocalWaterFood);
    expect(service).toBeTruthy();
  });
});
