export interface TranslationUnitFragment {
  source: string;
  target?: string;
  state?: string;
}

export interface TranslationUnit {
  id: string;
  source: string;
  target: string;
  fragments: TranslationUnitFragment[];
  meaning?: string;
  description?: string;
  unsupported: boolean;
  occurrences?: number;
}
