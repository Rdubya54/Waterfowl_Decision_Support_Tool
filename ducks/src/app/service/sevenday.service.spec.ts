import { TestBed } from '@angular/core/testing';

import { SevendayService } from './sevenday.service';

describe('SevendayService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SevendayService = TestBed.get(SevendayService);
    expect(service).toBeTruthy();
  });
});
