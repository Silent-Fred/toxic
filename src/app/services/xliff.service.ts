import { Injectable } from '@angular/core';
import { XliffDocument } from './../model/xliff-document';

@Injectable({
  providedIn: 'root',
})
export class XliffService {
  get currentDocument(): XliffDocument | undefined {
    return this._currentDocument;
  }
  private _currentDocument?: XliffDocument;

  use(xliffDocument: XliffDocument): void {
    this._currentDocument = xliffDocument;
  }

  clear(): void {
    this._currentDocument = undefined;
  }

  isUsualLocaleFormat(locale: string): boolean {
    return locale.match(/^[a-z]{2}([_-][A-Z]{2})?$/) !== null;
  }
}
