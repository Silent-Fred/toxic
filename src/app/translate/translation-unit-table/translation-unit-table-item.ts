export interface TranslationUnitTableItem {
  id: string;
  translationUnitId: string;
  fragmentIndex: number;
  source: string;
  target?: string;
  meaning?: string;
  description?: string;
  state?: string;
  flaggedForReview?: boolean;
  fragmented?: boolean;
  unsupported?: boolean;
}

export const sortByTranslationUnitId: (
  a: TranslationUnitTableItem,
  b: TranslationUnitTableItem
) => number = (a, b) => {
  if (a.translationUnitId === b.translationUnitId) {
    return a.fragmentIndex < b.fragmentIndex ? -1 : 1;
  }
  return a.translationUnitId < b.translationUnitId ? -1 : 1;
};

export const sortReviewMode: (
  a: TranslationUnitTableItem,
  b: TranslationUnitTableItem
) => number = (a, b) => {
  const sortByReview =
    a.flaggedForReview === b.flaggedForReview ? 0 : a.flaggedForReview ? -1 : 1;
  return sortByReview !== 0 ? sortByReview : sortByTranslationUnitId(a, b);
};
