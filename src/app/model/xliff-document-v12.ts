import { TranslationUnit, TranslationUnitFragment } from './translation-unit';
import {
  ValidStates,
  XliffVersionAbstraction,
} from './xliff-version-abstraction';

const ValidStates12 = {
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

export class XliffVersion12 implements XliffVersionAbstraction {
  canHandle(xliffDocument: Document): boolean {
    const xliffNodes = xliffDocument?.querySelectorAll('xliff');
    const xliffNode =
      xliffNodes && xliffNodes.length === 1 ? xliffNodes.item(0) : undefined;
    return xliffNode?.getAttribute('version') === '1.2';
  }

  getTargetLanguage(xliffDocument: Document): string {
    const targetLanguage = (
      this.findFirstFileNode(xliffDocument) as Element
    )?.getAttribute('target-language');
    return targetLanguage ? targetLanguage : '';
  }

  setTargetLanguage(xliffDocument: Document, language: string): void {
    const fileNode = this.findFirstFileNode(xliffDocument);
    (fileNode as Element)?.setAttribute('target-language', language);
  }

  getTranslationUnits(xliffDocument: Document | undefined): TranslationUnit[] {
    const translationUnits: TranslationUnit[] = [];
    const transUnitTags = xliffDocument?.querySelectorAll(
      'xliff > file > body > trans-unit'
    );
    transUnitTags?.forEach((transUnitElement) =>
      translationUnits.push(
        ...this.parseNodeRepresentingTranslationUnit(transUnitElement)
      )
    );
    return translationUnits;
  }

  setState(transUnitNode: Node, state: string): void {
    const targetNode = this.findTarget(transUnitNode);
    if (targetNode) {
      (targetNode as Element).setAttribute('state', this.convertState(state));
    }
  }

  setTranslation(
    transUnitNode: Node,
    fragmentIndex: number,
    translation: string
  ): void {
    this.setTargetFragment(transUnitNode, fragmentIndex, translation);
    this.setState(transUnitNode, ValidStates12.translated);
  }

  private convertState(abstractState: string): string {
    switch (abstractState) {
      case ValidStates.initial:
        return ValidStates12.new;
      case ValidStates.translated:
        return ValidStates12.translated;
      case ValidStates.reviewed:
      case ValidStates.final:
        return ValidStates12.final;
      default:
        return abstractState;
    }
  }

  private parseNodeRepresentingTranslationUnit(
    transUnitNode: Node
  ): TranslationUnit[] {
    if (transUnitNode?.nodeName !== 'trans-unit') {
      return [];
    }
    const id = this.evaluateId(transUnitNode);
    const sourceFragments = this.fragments(this.findSource(transUnitNode));
    const source = sourceFragments.join('');
    if (!id || !source) {
      return [];
    }
    const fragments: TranslationUnitFragment[] = sourceFragments.map(
      (sourceFragment) =>
        ({ source: sourceFragment } as TranslationUnitFragment)
    );
    let targetFragments = this.fragments(this.findTarget(transUnitNode));
    if (targetFragments.length === 0) {
      this.addTarget(transUnitNode);
      targetFragments = this.fragments(this.findTarget(transUnitNode));
    }
    const target = targetFragments.join('');
    const state = this.evaluateTargetState(transUnitNode);
    fragments.forEach((fragment, index) => {
      fragment.target =
        index < targetFragments.length ? targetFragments[index] : '';
      fragment.state = state ?? ValidStates12.new;
    });
    const unsupported =
      this.containsUnsupportedContent(this.findSource(transUnitNode)) ||
      this.containsUnsupportedContent(this.findTarget(transUnitNode));
    return [
      {
        id,
        source,
        target,
        fragments,
        meaning: this.evaluateMeaning(transUnitNode),
        description: this.evaluateDescription(transUnitNode),
        unsupported,
      } as TranslationUnit,
    ];
  }

  private findSource(transUnitNode: Node): Node | undefined {
    return this.findFirstChildWithNodeName(transUnitNode, 'source');
  }

  private findTarget(transUnitNode: Node): Node | undefined {
    return this.findFirstChildWithNodeName(transUnitNode, 'target');
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

  private evaluateId(transUnitNode: Node): string | null {
    const element = transUnitNode as Element;
    return element?.hasAttribute('id') ? element.getAttribute('id') : null;
  }

  private evaluateTargetState(transUnitNode: Node): string | null {
    let state: string | null = null;
    const targetNode = this.findTarget(transUnitNode);
    const element = targetNode as Element;
    state = element?.hasAttribute('state')
      ? element.getAttribute('state')
      : null;
    return state;
  }

  private evaluateMeaning(transUnitNode: Node): string | null {
    return this.evaluateNotes(transUnitNode, 'meaning');
  }

  private evaluateDescription(transUnitNode: Node): string | null {
    return this.evaluateNotes(transUnitNode, 'description');
  }

  private evaluateNotes(
    transUnitNode: Node,
    fromAttribute: string
  ): string | null {
    let note: string | null = null;
    transUnitNode?.childNodes.forEach((childNode) => {
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

  private fragments(sourceOrTargetNode: Node | undefined): string[] {
    const fragments: string[] = [];
    sourceOrTargetNode?.childNodes.forEach((childNode) => {
      if (childNode.TEXT_NODE === childNode.nodeType) {
        fragments.push(childNode.textContent ?? '');
      } else if (childNode.nodeName === 'x') {
        fragments.push((childNode as Element).getAttribute('equiv-text') ?? '');
      }
    });
    return fragments;
  }

  private containsUnsupportedContent(sourceOrTargetNode?: Node): boolean {
    let unsupportedContent = false;
    sourceOrTargetNode?.childNodes.forEach((childNode) => {
      unsupportedContent ||=
        childNode.TEXT_NODE !== childNode.nodeType &&
        childNode.nodeName !== 'x';
    });
    return unsupportedContent;
  }

  private setTargetFragment(
    transUnitNode: Node,
    fragmentIndex: number,
    target: string
  ): void {
    let targetNode = this.findTarget(transUnitNode);
    if (!targetNode) {
      targetNode = this.addTarget(transUnitNode);
    }
    const fragment = targetNode.childNodes.item(fragmentIndex);
    if (fragment?.nodeType === targetNode.TEXT_NODE) {
      fragment.textContent = target;
    } else if (fragment?.nodeName === 'x') {
      (fragment as Element).setAttribute('equiv-text', target);
    }
  }

  private addTarget(transUnitNode: Node): Node {
    const targetNode = transUnitNode?.ownerDocument?.createElement('target');
    this.setState(targetNode as Node, ValidStates12.new);
    transUnitNode.appendChild(targetNode as Node);
    const sourceNode = this.findSource(transUnitNode);
    sourceNode?.childNodes.forEach((childNode) => {
      (targetNode as Node).appendChild(childNode.cloneNode(true));
    });
    return targetNode as Node;
  }

  private findFirstFileNode(xliffDocument: Document): Node | undefined {
    const fileNodes = xliffDocument.querySelectorAll('file');
    return fileNodes && fileNodes.length > 0 ? fileNodes.item(0) : undefined;
  }
}
