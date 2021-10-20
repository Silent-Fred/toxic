import { TestBed } from '@angular/core/testing';
import { TranslationUnit } from './../../model/xliff-document';
import { ModelToViewConverterService } from './model-to-view-converter.service';

describe('ModelToViewConverterService', () => {
  let service: ModelToViewConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModelToViewConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should convert all the currently supported properties', () => {
    const translationUnit = {
      id: 'id',
      source: 'source',
      target: 'target',
      meaning: 'meaning',
      description: 'description',
      state: 'Baden-Württemberg',
      node: undefined,
    } as TranslationUnit;
    const item = service.convert(translationUnit);
    expect(item.id).toEqual('id');
    expect(item.source).toEqual('source');
    expect(item.target).toEqual('target');
    expect(item.meaning).toEqual('meaning');
    expect(item.description).toEqual('description');
    expect(item.state).toEqual('Baden-Württemberg');
  });
});
