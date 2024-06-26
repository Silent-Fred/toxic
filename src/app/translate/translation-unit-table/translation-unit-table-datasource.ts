import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ValidStates } from 'src/app/model/xliff-version-abstraction';
import { TranslationUnit } from './../../model/translation-unit';
import { XliffDocument } from './../../model/xliff-document';
import {
  FragmentPosition,
  sortByTranslationUnitId,
  sortReviewMode,
  TranslationUnitTableItem,
} from './translation-unit-table-item';

/**
 * Data source for the TranslationUnitTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TranslationUnitTableDataSource extends DataSource<TranslationUnitTableItem> {
  paginator: MatPaginator | undefined;

  private readonly reviewedStates: string[] = [
    ValidStates.final,
    ValidStates.reviewed,
  ];

  private data: TranslationUnitTableItem[] = [];

  private filtered$ = new BehaviorSubject<TranslationUnitTableItem[]>([]);

  get filtered(): TranslationUnitTableItem[] {
    return this.filtered$.value;
  }

  private reviewMode$ = new BehaviorSubject<boolean>(false);
  set reviewMode(value: boolean) {
    this.reviewMode$.next(value);
  }

  private proceedWithReview$ = new BehaviorSubject<string>('');

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TranslationUnitTableItem[]> {
    if (this.paginator) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        this.filtered$,
        this.reviewMode$,
        this.paginator.page,
        this.proceedWithReview$
      ).pipe(
        map(() => {
          return this.getPagedData(this.getSortedData([...this.filtered]));
        })
      );
    } else {
      throw Error(
        'Please set the paginator and sort on the data source before connecting.'
      );
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {
    // currently nothing fancy... in fact, nothing at all planned here
  }

  filter(value: string): void {
    this.filtered$.next(this.data.filter((item) => this.match(item, value)));
    this.paginator?.firstPage();
  }

  use(xliffDocument: XliffDocument | undefined): void {
    const newData: TranslationUnitTableItem[] = [];
    xliffDocument?.translationUnits?.forEach((translationUnit) =>
      newData.push(...this.convertModelToTableItem(translationUnit))
    );
    this.data = [...newData];
    // Reset filtering when a new document is opened. We might also
    // consider to keep a filter "alive" we'd just have to recalculate
    // the filtered content in that case.
    this.filter('');
  }

  setTranslation(id: string, translation: string): void {
    const item = this.findItemById(id);
    if (item) {
      item.target = translation;
    }
    // The app supports only a simple workflow where 'translated'
    // also means 'final'. Reviews have to be requested explicitly.
    this.setStateConsideringSiblings(id, ValidStates.final);
  }

  requestReview(id: string): void {
    this.setStateConsideringSiblings(id, ValidStates.translated);
  }

  confirmReview(id: string): void {
    this.setStateConsideringSiblings(id, ValidStates.final);
    if (this.reviewMode$.value) {
      this.proceedWithReview$.next(id);
    }
  }

  findItemById(id: string): TranslationUnitTableItem | undefined {
    return this.data?.find((item) => item.id === id);
  }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(
    data: TranslationUnitTableItem[]
  ): TranslationUnitTableItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(
    data: TranslationUnitTableItem[]
  ): TranslationUnitTableItem[] {
    const sortedData = [...data];
    // Currently we use a default sort order
    return sortedData.sort((a, b) => {
      if (this.reviewMode$.value) {
        return sortReviewMode(a, b);
      }
      return sortByTranslationUnitId(a, b);
    });
  }

  private match(item: TranslationUnitTableItem, filter: string): boolean {
    if (!item || !filter) {
      return true;
    }
    const filterParts = filter.toLowerCase().split(' ');
    return filterParts.every(
      (part) =>
        item.id.toLowerCase().includes(part) ||
        item.source.toLowerCase().includes(part) ||
        item.target?.toLowerCase().includes(part) ||
        item.meaning?.toLowerCase().includes(part) ||
        item.description?.toLowerCase().includes(part) ||
        item.state?.toLowerCase().includes(part)
    );
  }

  private convertModelToTableItem(
    translationUnit: TranslationUnit
  ): TranslationUnitTableItem[] {
    const items: TranslationUnitTableItem[] =
      this.initialiseItemFromModel(translationUnit);
    items.forEach((item) => (item.flaggedForReview = !this.reviewed(item)));
    return items;
  }

  private initialiseItemFromModel(
    translationUnit: TranslationUnit
  ): TranslationUnitTableItem[] {
    const items: TranslationUnitTableItem[] = translationUnit.fragments.map(
      (fragment, index) => ({
        id: translationUnit.id + '#' + index,
        translationUnitId: translationUnit.id,
        fragmentIndex: index,
        state: fragment.state,
        source: fragment.source,
        target: fragment.target,
        meaning: translationUnit.meaning,
        description: translationUnit.description,
        fragmented: translationUnit.fragments.length > 1,
        fragmentPosition: this.fragmentPosition(translationUnit, index),
        unsupported: translationUnit.unsupported,
        occurrences: translationUnit.occurrences,
      })
    );
    return items;
  }

  private reviewed(item: TranslationUnitTableItem): boolean {
    return this.reviewedStates.includes(item.state || '');
  }

  private setStateConsideringSiblings(id: string, state: string): void {
    const item = this.findItemById(id);
    if (item) {
      this.data
        .filter(
          (sibling) => sibling.translationUnitId === item.translationUnitId
        )
        .forEach((sibling) => {
          sibling.state = state;
          sibling.flaggedForReview = !this.reviewed(item);
        });
    }
  }

  private fragmentPosition(
    translationUnit: TranslationUnit,
    index: number
  ): string | undefined {
    if (translationUnit.fragments.length <= 1) {
      return undefined;
    }
    if (index === 0) {
      return FragmentPosition.first;
    }
    return index === translationUnit.fragments.length - 1
      ? FragmentPosition.last
      : FragmentPosition.middle;
  }
}
