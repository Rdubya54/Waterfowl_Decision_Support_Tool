import { TestBed } from '@angular/core/testing';

import { WeatherCloudService } from './weather-cloud.service';

describe('WeatherCloudService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WeatherCloudService = TestBed.get(WeatherCloudService);
    expect(service).toBeTruthy();
  });
});
