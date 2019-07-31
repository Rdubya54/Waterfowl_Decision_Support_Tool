import { TestBed } from '@angular/core/testing';

import { GaugedataService } from './gaugedata-cloud.service';

describe('GaugedataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GaugedataService = TestBed.get(GaugedataService);
    expect(service).toBeTruthy();
  });
});
