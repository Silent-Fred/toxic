export interface TranslationUnitFragment {
  source: string;
  target?: string;
  state?: string;
}

export interface TranslationUnit {
  id: string;
  source: string;
  // sourceFragments: string[];
  target: string;
  // targetFragments: string[];
  fragments: TranslationUnitFragment[];
  meaning?: string;
  description?: string;
  // state?: string;
  unsupported: boolean;
}
