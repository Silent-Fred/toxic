import { TranslationUnit } from './translation-unit';
import { XliffVersionAbstraction } from './xliff-version-abstraction';

const ValidStates20 = {
  initial: 'initial',
  translated: 'translated',
  reviewed: 'reviewed',
  final: 'final',
} as const;

export class XliffVersion20 implements XliffVersionAbstraction {
  canHandle(xliffDocument: Document): boolean {
    const xliffNode = this.findFirstNodeWithName('xliff', xliffDocument);
    return (xliffNode as Element)?.getAttribute('version') === '2.0';
  }

  getSourceLanguage(xliffDocument: Document): string {
    const xliffNode = this.findFirstNodeWithName('xliff', xliffDocument);
    return (xliffNode as Element)?.getAttribute('srcLang') || '';
  }

  getTargetLanguage(xliffDocument: Document): string {
    const xliffNode = this.findFirstNodeWithName('xliff', xliffDocument);
    return (xliffNode as Element)?.getAttribute('trgLang') || '';
  }

  setTargetLanguage(xliffDocument: Document, language: string): void {
    const xliffNode = this.findFirstNodeWithName('xliff', xliffDocument);
    (xliffNode as Element)?.setAttribute('trgLang', language);
  }

  getTranslationUnits(xliffDocument: Document | undefined): TranslationUnit[] {
    const translationUnits: TranslationUnit[] = [];
    const transUnitTags = xliffDocument?.querySelectorAll(
      'xliff > file > unit'
    );
    transUnitTags?.forEach((element) =>
      translationUnits.push(
        ...this.parseNodeRepresentingTranslationUnit(element)
      )
    );
    return translationUnits;
  }

  setState(unitNode: Node, state: string): void {
    this.segmentNodes(unitNode).forEach((segment) =>
      (segment as Element).setAttribute('state', state)
    );
  }

  setTranslation(
    unitNode: Node,
    fragmentIndex: number,
    translation: string
  ): void {
    this.setTargetFragment(unitNode, fragmentIndex, translation);
    this.setState(unitNode, ValidStates20.translated);
  }

  private parseNodeRepresentingTranslationUnit(
    unitNode: Node
  ): TranslationUnit[] {
    if (unitNode?.nodeName !== 'unit') {
      return [];
    }
    const id = this.evaluateId(unitNode);
    this.segmentNodes(unitNode).forEach((segment) =>
      this.completeSegment(segment)
    );
    const fragments = this.segmentNodes(unitNode).map((segmentNode) => ({
      source: this.findSource(segmentNode)?.textContent,
      target: this.findTarget(segmentNode)?.textContent,
      state: this.evaluateTargetState(segmentNode),
    }));
    const source = fragments.map((fragment) => fragment.source).join('');
    if (!id || !fragments || fragments.length === 0) {
      return [];
    }
    const target = fragments.map((fragment) => fragment.target).join('');
    const reducer = (soFar: boolean, currentValue: Node) =>
      soFar || this.containsUnsupportedContent(currentValue);
    const unsupported = this.segmentSources(unitNode).reduce(reducer, false);
    return [
      {
        id,
        source,
        target,
        fragments,
        meaning: this.evaluateMeaning(unitNode),
        description: this.evaluateDescription(unitNode),
        unsupported,
        occurrences: this.countOccurrences(unitNode),
      } as TranslationUnit,
    ];
  }

  private segmentNodes(unitNode: Node): Node[] {
    const segmentNodes: Node[] = [];
    unitNode.childNodes?.forEach((childNode) => segmentNodes.push(childNode));
    return segmentNodes.filter((segment) => segment.nodeName === 'segment');
  }

  private segmentSources(unitNode: Node): Node[] {
    const sourceNodes: Node[] = [];
    this.segmentNodes(unitNode).forEach((segment) => {
      const source = this.findSource(segment);
      if (source) {
        sourceNodes.push(source);
      }
    });
    return sourceNodes;
  }

  private segmentTargets(unitNode: Node): Node[] {
    const targetNodes: Node[] = [];
    this.segmentNodes(unitNode).forEach((segment) => {
      const target = this.findTarget(segment);
      if (target) {
        targetNodes.push(target);
      }
    });
    return targetNodes;
  }

  private findSource(segmentNode: Node): Node | undefined {
    return this.findFirstChildWithNodeName(segmentNode, 'source');
  }

  private findTarget(sgementNode: Node): Node | undefined {
    return this.findFirstChildWithNodeName(sgementNode, 'target');
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

  private completeSegment(segmentNode: Node): void {
    const source = this.findSource(segmentNode);
    const target = this.findTarget(segmentNode);
    if (source && !target) {
      this.addTarget(segmentNode);
    }
  }

  private evaluateId(unitNode: Node): string | null {
    return (unitNode as Element)?.getAttribute('id');
  }

  private evaluateTargetState(segmentNode: Node): string | null {
    return (
      (segmentNode as Element).getAttribute('state') ?? ValidStates20.initial
    );
  }

  private evaluateMeaning(unitNode: Node): string | null {
    const notes = this.findFirstChildWithNodeName(unitNode, 'notes');
    return notes ? this.evaluateNotes(notes, 'meaning') : null;
  }

  private evaluateDescription(unitNode: Node): string | null {
    const notes = this.findFirstChildWithNodeName(unitNode, 'notes');
    return notes ? this.evaluateNotes(notes, 'description') : null;
  }

  private evaluateNotes(notesNode: Node, category: string): string | null {
    let note: string | null = null;
    notesNode?.childNodes.forEach((childNode) => {
      if (childNode.nodeName === 'note') {
        const element = childNode as Element;
        if (element?.getAttribute('category') === category) {
          note = childNode.textContent;
        }
      }
    });
    return note;
  }

  private countOccurrences(unitNode: Node): number {
    const notes = this.findFirstChildWithNodeName(unitNode, 'notes');
    return Array.from(notes?.childNodes ?? [])
      .filter((childNode) => childNode.nodeName === 'note')
      .filter(
        (childNode) =>
          (childNode as Element).getAttribute('category') === 'location'
      ).length;
  }

  private containsUnsupportedContent(segmentNode?: Node): boolean {
    let unsupportedContent = false;
    segmentNode?.childNodes.forEach((childNode) => {
      unsupportedContent ||= childNode.TEXT_NODE !== childNode.nodeType;
    });
    return unsupportedContent;
  }

  private setTargetFragment(
    unitNode: Node,
    fragmentIndex: number,
    target: string
  ): void {
    const segmentTargets = this.segmentTargets(unitNode);
    if (fragmentIndex < segmentTargets.length) {
      segmentTargets[fragmentIndex].textContent = target;
    }
  }

  private addTarget(segmentNode: Node): Node {
    const targetNode = segmentNode?.ownerDocument?.createElement('target');
    this.setState(targetNode as Node, ValidStates20.initial);
    segmentNode.appendChild(targetNode as Node);
    const sourceNode = this.findSource(segmentNode);
    sourceNode?.childNodes.forEach((childNode) => {
      (targetNode as Node).appendChild(childNode.cloneNode(true));
    });
    return targetNode as Node;
  }

  private findFirstNodeWithName(
    name: string,
    xliffDocument: Document
  ): Node | undefined {
    const nodes = xliffDocument.querySelectorAll(name);
    return nodes && nodes.length > 0 ? nodes.item(0) : undefined;
  }
}
