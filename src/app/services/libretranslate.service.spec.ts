import { TestBed } from '@angular/core/testing';

import { LibretranslateService } from './libretranslate.service';

describe('LibretranslateService', () => {
  let service: LibretranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibretranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
