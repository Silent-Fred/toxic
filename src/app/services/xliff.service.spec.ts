import { TestBed } from '@angular/core/testing';
import { XliffService } from './xliff.service';

describe('XliffService', () => {
  let service: XliffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(XliffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    expect(service.isUsualLocaleFormat('de')).toBeTrue();
    expect(service.isUsualLocaleFormat('de-DE')).toBeTrue();
    expect(service.isUsualLocaleFormat('de_DE')).toBeTrue();
    expect(service.isUsualLocaleFormat('de_DE')).toBeTrue();

    expect(service.isUsualLocaleFormat('de_DE ')).toBeFalse();
    expect(service.isUsualLocaleFormat('de_D')).toBeFalse();
    expect(service.isUsualLocaleFormat('en_USA')).toBeFalse();
    expect(service.isUsualLocaleFormat('x_DE')).toBeFalse();
  });
});
