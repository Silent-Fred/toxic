import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LibreTranslateService } from './libre-translate.service';

describe('LibreTranslateService', () => {
  let service: LibreTranslateService;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(LibreTranslateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
