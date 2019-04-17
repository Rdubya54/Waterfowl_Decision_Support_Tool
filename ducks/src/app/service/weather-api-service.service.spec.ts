import { TestBed } from '@angular/core/testing';

import { WeatherApiServiceService } from './weather-api-service.service';

describe('WeatherApiServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherApiServiceService = TestBed.get(WeatherApiServiceService);
    expect(service).toBeTruthy();
  });
});
