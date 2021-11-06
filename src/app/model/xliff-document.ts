import { TranslationUnit } from './translation-unit';
import { XliffVersion12 } from './xliff-document-v12';
import { XliffVersion20 } from './xliff-document-v20';
import { XliffVersionAbstraction } from './xliff-version-abstraction';

export class XliffDocument {
  private xliffDocument?: Document;
  private _unsavedChanges = false;
  private xliffVersionAbstraction?: XliffVersionAbstraction;

  filename?: string;

  get targetLanguage(): string | undefined {
    return this.xliffDocument
      ? this.xliffVersionAbstraction?.getTargetLanguage(this.xliffDocument)
      : '';
  }

  get translationUnits(): TranslationUnit[] {
    if (this.xliffVersionAbstraction && this.xliffDocument) {
      return [
        ...this.xliffVersionAbstraction?.getTranslationUnits(
          this.xliffDocument
        ),
      ];
    }
    return [];
  }

  get valid(): boolean {
    return this.xliffDocument !== undefined;
  }

  get unsavedChanges(): boolean {
    return this._unsavedChanges;
  }

  constructor(xliff?: string) {
    if (xliff) {
      this.parseXliff(xliff);
    }
  }

  parseXliff(xliff: string): void {
    // In case we deal with files, not strings:
    // var xmlhttp = new XMLHttpRequest();
    // Using XPaths and document.evaluate() might be another
    // approach, but let's just try it with the DOM tree and
    // nodes and the likes
    this.xliffDocument = undefined;
    this._unsavedChanges = false;
    this.xliffVersionAbstraction = undefined;
    try {
      const parser = new DOMParser();
      this.xliffDocument = parser.parseFromString(xliff, 'text/xml');
      if (this.xliffDocument) {
        const xliffDocument = this.xliffDocument;
        this.xliffVersionAbstraction = [
          new XliffVersion12(),
          new XliffVersion20(),
        ].find((version) => version.canHandle(xliffDocument));
        if (this.xliffVersionAbstraction === undefined) {
          this.xliffDocument = undefined;
        }
      }
    } catch (e) {
      this.xliffDocument = undefined;
    }
  }

  setTranslation(id: string, fragmentIndex: number, translation: string): void {
    const node = this.xliffDocument?.getElementById(id);
    if (node) {
      this.xliffVersionAbstraction?.setTranslation(
        node,
        fragmentIndex,
        translation
      );
    }
    this._unsavedChanges = true;
  }

  setState(id: string, state: string): void {
    const node = this.xliffDocument?.getElementById(id);
    if (node) {
      this.xliffVersionAbstraction?.setState(node, state);
    }
    this._unsavedChanges = true;
  }

  setTargetLanguage(targetLanguage: string): void {
    if (this.xliffDocument) {
      this.xliffVersionAbstraction?.setTargetLanguage(
        this.xliffDocument,
        targetLanguage
      );
    }
    this._unsavedChanges = true;
  }

  asBlob(): Blob {
    if (!this.xliffDocument) {
      return new Blob();
    }
    return new Blob(
      [new XMLSerializer().serializeToString(this.xliffDocument)],
      {
        type: 'application/x-xliff+xml',
      }
    );
  }

  acceptUnsavedChanges(): void {
    this._unsavedChanges = false;
  }
}
