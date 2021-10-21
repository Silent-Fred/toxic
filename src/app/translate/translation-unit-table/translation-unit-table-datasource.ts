import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, merge, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TranslationUnit, XliffDocument } from './../../model/xliff-document';

export interface TranslationUnitTableItem {
  id: string;
  source: string;
  target?: string;
  meaning?: string;
  description?: string;
  state?: string;
  flaggedForReview?: boolean;
}

/**
 * Data source for the TranslationUnitTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class TranslationUnitTableDataSource extends DataSource<TranslationUnitTableItem> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  private readonly reviewedStates = ['final', 'signed-off', 'translated'];

  private data: TranslationUnitTableItem[] = [];

  private filtered$ = new BehaviorSubject<TranslationUnitTableItem[]>([]);

  get filtered(): TranslationUnitTableItem[] {
    return this.filtered$.value;
  }

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<TranslationUnitTableItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(
        this.filtered$,
        this.paginator.page,
        this.sort.sortChange
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
  disconnect(): void {}

  filter(value: string): void {
    this.filtered$.next(this.data.filter((item) => this.match(item, value)));
    this.paginator?.firstPage();
  }

  use(xliffDocument: XliffDocument): void {
    // Reset filtering when a new document is opened. We might also
    // consider to keep a filter "alive" we'd just have to recalculate
    // the filtered content in that case.
    this.data = xliffDocument?.translationUnits?.map((translationUnit) =>
      this.convertModelToTableItem(translationUnit)
    );
    this.filter('');
  }

  setTranslation(id: string, translation: string): void {
    const item = this.data.find((item) => item.id === id);
    if (item) {
      item.target = translation;
      item.state = 'translated';
      item.flaggedForReview = !this.reviewed(item);
    }
  }

  requestReview(id: string): void {
    this.setState(id, 'needs-review-translation');
  }

  confirmReview(id: string): void {
    this.setState(id, 'final');
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
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      // const stepInWorkflow = this.compare(a.state, b.state) * (isAsc ? 1 : -1);
      // TODO sorting accoring to a workflow might be an issue for later versions,
      // although it's not clear if that really makes awfully sense compared to
      // solving the use case with filter abilities.
      const stepInWorkflow = 0;
      return stepInWorkflow !== 0
        ? stepInWorkflow
        : (a < b ? -1 : 1) * (isAsc ? 1 : -1);
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
  ): TranslationUnitTableItem {
    const item: TranslationUnitTableItem = Object.assign({}, translationUnit);
    item.flaggedForReview = !this.reviewed(item);
    return item;
  }

  private reviewed(item: TranslationUnitTableItem): boolean {
    return this.reviewedStates.includes(item.state || '');
  }

  private setState(id: string, state: string): void {
    const item = this.data.find((item) => item.id === id);
    if (item) {
      item.state = state;
      item.flaggedForReview = !this.reviewed(item);
    }
  }
}
