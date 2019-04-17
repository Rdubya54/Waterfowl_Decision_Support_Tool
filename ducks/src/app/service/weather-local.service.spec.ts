import { TestBed } from '@angular/core/testing';

import { WeatherLocalService } from './weather-local.service';

describe('WeatherLocalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherLocalService = TestBed.get(WeatherLocalService);
    expect(service).toBeTruthy();
  });
});
