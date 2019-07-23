import { TestBed } from '@angular/core/testing';

import { DropDownMenuDataService } from './drop-down-menu-data.service';

describe('DropDownMenuDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DropDownMenuDataService = TestBed.get(DropDownMenuDataService);
    expect(service).toBeTruthy();
  });
});
