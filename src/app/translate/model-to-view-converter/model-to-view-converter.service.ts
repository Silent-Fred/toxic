import { Injectable } from '@angular/core';
import { TranslationUnit } from './../../model/xliff-document';
import { TranslationUnitTableItem } from './../translation-unit-table/translation-unit-table-datasource';

@Injectable({
  providedIn: 'root',
})
export class ModelToViewConverterService {
  constructor() {}

  convert(translationUnit: TranslationUnit): TranslationUnitTableItem {
    // currently the properties are named equally so there's not a lot to do
    const item: TranslationUnitTableItem = Object.assign({}, translationUnit);
    return item;
  }
}
