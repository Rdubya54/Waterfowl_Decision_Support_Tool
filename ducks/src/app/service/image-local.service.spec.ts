import { TestBed } from '@angular/core/testing';

import { ImageLocalService } from './image-local.service';

describe('ImageLocalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageLocalService = TestBed.get(ImageLocalService);
    expect(service).toBeTruthy();
  });
});
