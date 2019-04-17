import { TestBed } from '@angular/core/testing';

import { MapServiceexService } from './map-serviceex.service';

describe('MapServiceexService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapServiceexService = TestBed.get(MapServiceexService);
    expect(service).toBeTruthy();
  });
});
