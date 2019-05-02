import { TestBed } from '@angular/core/testing';

import { MoistsoilService } from './moistsoil.service';

describe('MoistsoilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MoistsoilService = TestBed.get(MoistsoilService);
    expect(service).toBeTruthy();
  });
});
