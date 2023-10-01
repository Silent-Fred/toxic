import { TranslationUnit } from './translation-unit';

export const ValidStates = {
  initial: 'initial',
  translated: 'translated',
  reviewed: 'reviewed',
  final: 'final',
} as const;

export interface XliffVersionAbstraction {
  canHandle(xliffDocument: Document): boolean;
  getTranslationUnits(xliffDocument: Document): TranslationUnit[];
  getSourceLanguage(xliffDocument: Document): string;
  getTargetLanguage(xliffDocument: Document): string;
  setTargetLanguage(xliffDocument: Document, language: string): void;
  setTranslation(node: Node, fragmentIndex: number, translation: string): void;
  setState(node: Node, state: string): void;
}
