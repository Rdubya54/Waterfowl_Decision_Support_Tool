import { TestBed } from '@angular/core/testing';

import { WatermanagementSqlserverService } from './watermanagement-sqlserver.service';

describe('WatermanagementSqlserverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WatermanagementSqlserverService = TestBed.get(WatermanagementSqlserverService);
    expect(service).toBeTruthy();
  });
});
