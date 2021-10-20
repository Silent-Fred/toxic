import { Injectable } from '@angular/core';
import { TranslationUnit, XliffDocument } from './../model/xliff-document';

@Injectable({
  providedIn: 'root',
})
export class XliffService {
  currentDocument?: XliffDocument;

  constructor() {}

  use(xliffDocument: XliffDocument): void {
    this.currentDocument = xliffDocument;
  }

  clear(): void {
    this.currentDocument = undefined;
  }

  translationUnit(id: string): TranslationUnit | undefined {
    return this.currentDocument?.translationUnits?.find(
      (translationUnit) => translationUnit.id === id
    );
  }

  isUsualLocaleFormat(locale: string): boolean {
    return locale.match(/^[a-z]{2}([_-][A-Z]{2}){0,1}$/) !== null;
  }
}
