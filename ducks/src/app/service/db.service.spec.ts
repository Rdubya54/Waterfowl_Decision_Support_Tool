import { TestBed } from '@angular/core/testing';

import { dbService } from './db.service';

describe('GaugedataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: dbService = TestBed.get(dbService);
    expect(service).toBeTruthy();
  });
});
