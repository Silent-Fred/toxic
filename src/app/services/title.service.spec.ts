import { TestBed } from '@angular/core/testing';
import { TitleService } from './title.service';

describe('TitleService', () => {
  let service: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should handle titles', () => {
    const initial = service.title;
    service.title = 'New title';
    expect(service.title).toEqual('New title');
    service.reset();
    expect(service.title).toEqual(initial);
  });
});
