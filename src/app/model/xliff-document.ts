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
  complexNode: boolean;
}

export class XliffDocument {
  private xliffDocument?: Document;
  private _unsavedChanges = false;

  filename?: string;

  get targetLanguage(): string | undefined {
    return this.getTargetLanguage(this.xliffDocument);
  }

  get translationUnits(): TranslationUnit[] {
    return [...this.getTranslationUnits(this.xliffDocument)];
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
    try {
      const parser = new DOMParser();
      this.xliffDocument = parser.parseFromString(xliff, 'text/xml');
    } catch (e) {
      this.xliffDocument = undefined;
    }
  }

  setTranslation(id: string, translation: string): void {
    const node = this.xliffDocument?.getElementById(id);
    // TODO so far only for simple nodes without e.g. plurals
    if (node && !this.isComplexTranslationUnit(node)) {
      this.setTarget(node, translation);
    }
    this._unsavedChanges = true;
  }

  setState(id: string, state: string): void {
    const node = this.xliffDocument?.getElementById(id);
    if (node) {
      const targetNode = this.findTarget(node);
      if (targetNode) {
        this.setStateInNode(targetNode, state);
      }
    }
    this._unsavedChanges = true;
  }

  setTargetLanguage(targetLanguage: string): void {
    const fileNode = this.findFirstFileNode(this.xliffDocument);
    (fileNode as Element)?.setAttribute('target-language', targetLanguage);
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

  private getTranslationUnits(
    xliffDocument: Document | undefined
  ): TranslationUnit[] {
    const translationUnits: TranslationUnit[] = [];
    const transUnitTags = xliffDocument?.querySelectorAll(
      'xliff > file > body > trans-unit'
    );
    transUnitTags?.forEach((element) =>
      translationUnits.push(...this.evaluateTranslationUnit(element))
    );
    return translationUnits;
  }

  private evaluateTranslationUnit(node: Node): TranslationUnit[] {
    if (node?.nodeName !== 'trans-unit') {
      return [];
    }
    const id = this.evaluateId(node);
    const source = this.evaluateSource(node);
    if (!id || !source) {
      return [];
    }
    let target = this.findTarget(node);
    if (!target) {
      target = this.addTarget(node);
    }
    return [
      {
        id,
        source,
        target: this.evaluateTarget(node),
        state: this.evaluateTargetState(node),
        meaning: this.evaluateMeaning(node),
        description: this.evaluateDescription(node),
        complexNode: this.isComplexTranslationUnit(node),
        node,
      } as TranslationUnit,
    ];
  }

  private getTargetLanguage(xliffDocument?: Document): string {
    const targetLanguage = (
      this.findFirstFileNode(xliffDocument) as Element
    )?.getAttribute('target-language');
    return targetLanguage ? targetLanguage : '';
  }

  private findFirstFileNode(
    xliffDocument: Document | undefined
  ): Node | undefined {
    const fileNodes = xliffDocument?.querySelectorAll('file');
    return fileNodes && fileNodes.length > 0 ? fileNodes.item(0) : undefined;
  }

  private evaluateId(node: Node): string | null {
    const element = node as Element;
    return element?.hasAttribute('id') ? element.getAttribute('id') : null;
  }

  private evaluateSource(node: Node): string | null {
    const textContent = this.findSource(node)?.textContent;
    return textContent ? textContent : null;
  }

  private evaluateTarget(node: Node): string | null {
    const textContent = this.findTarget(node)?.textContent;
    return textContent ? textContent : null;
  }

  private evaluateTargetState(node: Node): string | null {
    let state: string | null = null;
    const targetNode = this.findTarget(node);
    const element = targetNode as Element;
    state = element?.hasAttribute('state')
      ? element.getAttribute('state')
      : null;
    return state;
  }

  private evaluateMeaning(node: Node): string | null {
    return this.evaluateNotes(node, 'meaning');
  }

  private evaluateDescription(node: Node): string | null {
    return this.evaluateNotes(node, 'description');
  }

  private evaluateNotes(node: Node, fromAttribute: string): string | null {
    let note: string | null = null;
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'note') {
        const element = childNode as Element;
        if (
          element?.hasAttribute('from') &&
          element?.getAttribute('from') === fromAttribute
        ) {
          note = childNode.textContent;
        }
      }
    });
    return note;
  }

  private setTarget(node: Node, target: string): void {
    // TODO this only works for simple nodes, not for complex
    // targets like e.g. with a pluralisation
    let targetNode = this.findTarget(node);
    if (!targetNode) {
      targetNode = this.addTarget(node);
    }
    targetNode.textContent = target;
  }

  private setStateInNode(node: Node, state: string): void {
    const element = node as Element;
    element.setAttribute('state', state);
  }

  private findSource(node: Node): Node | undefined {
    return this.findFirstChildWithNodeName(node, 'source');
  }

  private findTarget(node: Node): Node | undefined {
    return this.findFirstChildWithNodeName(node, 'target');
  }

  private findFirstChildWithNodeName(
    node: Node,
    nodeName: string
  ): Node | undefined {
    let foundNode;
    node?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === nodeName) {
        foundNode = childNode;
      }
    });
    return foundNode;
  }

  private isComplexTranslationUnit(node: Node): boolean {
    return this.isComplexNode(this.findSource(node));
  }

  private isComplexNode(node: Node | undefined | null): boolean {
    if (!node || !node.hasChildNodes()) {
      return false;
    }
    if (
      node.firstChild?.isSameNode(node.lastChild) &&
      this.canHandleNode(node.firstChild)
    ) {
      return false;
    }
    return true;
  }

  private addTarget(node: Node): Node {
    const targetNode = this.xliffDocument?.createElement('target');
    this.setStateInNode(targetNode as Node, ValidStates.new);
    node.appendChild(targetNode as Node);
    const sourceNode = this.findSource(node);
    sourceNode?.childNodes.forEach((childNode) => {
      (targetNode as Node).appendChild(childNode.cloneNode(true));
    });
    return targetNode as Node;
  }

  private canHandleNode(node: Node): boolean {
    return node.nodeType === node.TEXT_NODE || node.nodeName === 'x';
  }
}
