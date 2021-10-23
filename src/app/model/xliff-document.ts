export const ValidStates = {
  final: 'final',
  needsAdaptation: 'needs-adaptation',
  needsL10n: 'needs-l10n',
  needsReviewAdaptation: 'needs-review-adaptation',
  needsReviewL10n: 'needs-review-l10n',
  needsReviewTranslation: 'needs-review-translation',
  needsTranslation: 'needs-translation',
  new: 'new',
  signedOff: 'signed-off',
  translated: 'translated',
} as const;

export interface TranslationUnit {
  id: string;
  source: string;
  target?: string;
  meaning?: string;
  description?: string;
  state?: string;
  node?: Node;
}

export class XliffDocument {
  private document?: Document;
  private fileNode?: Node;
  private _translationUnits: TranslationUnit[] = [];
  private _unsavedChanges = false;

  filename?: string;
  private _targetLanguage?: string;

  get targetLanguage(): string | undefined {
    return this._targetLanguage;
  }

  get translationUnits(): TranslationUnit[] {
    return [...this._translationUnits];
  }

  get valid(): boolean {
    return this._translationUnits?.length > 0;
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
    // Using XPaths and document.evaluate() miight be another
    // approach, but let's just try it with the DOM tree and
    // nodes and the likes
    this.document = undefined;
    this._translationUnits = [];
    this._unsavedChanges = false;
    try {
      const parser = new DOMParser();
      this.document = parser.parseFromString(xliff, 'text/xml');
      const rootNode = this.document.getRootNode() as Node;
      rootNode.childNodes.forEach((childNode) => {
        if (childNode.nodeName === 'xliff') {
          this._translationUnits.push(...this.evaluateXliffNode(childNode));
        }
      });
    } catch (e) {
      this.document = undefined;
      this._translationUnits = [];
    }
  }

  setTranslation(id: string, translation: string): void {
    const translationUnit = this._translationUnits.find(
      (translationUnit) => translationUnit.id === id
    );
    if (translationUnit) {
      translationUnit.target = translation;
      // if the translation unit is tied to a node, update the
      // node, too
      if (translationUnit.node) {
        this.setTarget(translationUnit.node, translation);
      }
      this._unsavedChanges = true;
    }
  }

  setState(id: string, state: string): void {
    const translationUnit = this._translationUnits.find(
      (translationUnit) => translationUnit.id === id
    );
    if (translationUnit) {
      translationUnit.state = state;
      // if the translation unit is tied to a node, update the
      // node, too
      if (translationUnit.node) {
        this.setStateInNode(translationUnit.node, state);
      }
      this._unsavedChanges = true;
    }
  }

  setTargetLanguage(targetLanguage: string): void {
    this._targetLanguage = targetLanguage || '';
    if (this.fileNode) {
      (this.fileNode as Element).setAttribute(
        'target-language',
        this._targetLanguage
      );
      this._unsavedChanges = true;
    }
  }

  asBlob(): Blob {
    if (!this.document) {
      return new Blob();
    }
    return new Blob([new XMLSerializer().serializeToString(this.document)], {
      type: 'application/x-xliff+xml',
    });
  }

  acceptUnsavedChanges(): void {
    this._unsavedChanges = false;
  }

  private evaluateXliffNode(node: Node): TranslationUnit[] {
    const translationUnits: TranslationUnit[] = [];
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'file') {
        translationUnits.push(...this.evaluateFileNode(childNode));
      }
    });
    return translationUnits;
  }

  private evaluateFileNode(node: Node): TranslationUnit[] {
    const translationUnits: TranslationUnit[] = [];
    this.fileNode = node;
    const targetLanguage = (node as Element).getAttribute('target-language');
    this._targetLanguage = targetLanguage ? targetLanguage : undefined;
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'body') {
        translationUnits.push(...this.evaluateBodyNode(childNode));
      }
    });
    return translationUnits;
  }

  private evaluateBodyNode(node: Node): TranslationUnit[] {
    const translationUnits: TranslationUnit[] = [];
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'trans-unit') {
        const translationUnit = this.evaluateTransUnitNode(childNode);
        if (translationUnit) {
          translationUnits.push(translationUnit);
        }
      }
    });
    return translationUnits;
  }

  private evaluateTransUnitNode(node: Node): TranslationUnit | null {
    if (!node) {
      return null;
    }
    const id = this.evaluateId(node);
    const source = this.evaluateSource(node);
    if (!id || !source) {
      return null;
    }
    return {
      id,
      source,
      target: this.evaluateTarget(node),
      state: this.evaluateTargetState(node),
      meaning: this.evaluateMeaning(node),
      description: this.evaluateDescription(node),
      node,
    } as TranslationUnit;
  }

  private evaluateId(node: Node): string | null {
    const element = node as Element;
    return element?.hasAttribute('id') ? element.getAttribute('id') : null;
  }

  private evaluateSource(node: Node): string | null {
    let source: string | null = null;
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'source') {
        source = childNode.textContent;
      }
    });
    return source;
  }

  private evaluateTarget(node: Node): string | null {
    let target: string | null = null;
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'target') {
        target = childNode.textContent;
      }
    });
    return target;
  }

  private evaluateTargetState(node: Node): string | null {
    let state: string | null = null;
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'target') {
        const element = childNode as Element;
        state = element?.hasAttribute('state')
          ? element.getAttribute('state')
          : null;
      }
    });
    return state;
  }

  private evaluateMeaning(node: Node): string | null {
    let meaning: string | null = null;
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'note') {
        const element = childNode as Element;
        if (
          element?.hasAttribute('from') &&
          element?.getAttribute('from') === 'meaning'
        ) {
          meaning = childNode.textContent;
        }
      }
    });
    return meaning;
  }

  private evaluateDescription(node: Node): string | null {
    let description: string | null = null;
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'note') {
        const element = childNode as Element;
        if (
          element?.hasAttribute('from') &&
          element?.getAttribute('from') === 'description'
        ) {
          description = childNode.textContent;
        }
      }
    });
    return description;
  }

  private setTarget(node: Node, target: string): void {
    let targetNode = this.findTarget(node);
    if (!targetNode) {
      targetNode = this.addTarget(node);
    }
    targetNode.textContent = target;
  }

  private setStateInNode(node: Node, state: string): void {
    let targetNode = this.findTarget(node);
    if (!targetNode) {
      targetNode = this.addTarget(node);
    }
    const element = targetNode as Element;
    element.setAttribute('state', state);
  }

  private findTarget(node: Node): Node | undefined {
    let targetNode;
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'target') {
        targetNode = childNode;
      }
    });
    return targetNode;
  }

  private addTarget(node: Node): Node {
    const targetNode = { nodeName: 'target' } as Node;
    node.appendChild(targetNode);
    return targetNode;
  }
}