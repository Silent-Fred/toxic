import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { ValidStates } from './../../model/xliff-document';
import { XliffService } from './../../services/xliff.service';
import {
  TranslationUnitTableDataSource,
  TranslationUnitTableItem,
} from './translation-unit-table-datasource';

@Component({
  selector: 'toxic-translation-unit-table',
  templateUrl: './translation-unit-table.component.html',
  styleUrls: ['./translation-unit-table.component.scss'],
})
export class TranslationUnitTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<TranslationUnitTableItem>;
  dataSource: TranslationUnitTableDataSource;

  columnLayout = false;
  get rowLayout(): boolean {
    return !this.columnLayout;
  }
  set rowLayout(value: boolean) {
    this.columnLayout = !value;
  }

  displayedColumns = ['translation'];

  reviewMode = false;

  form!: FormGroup;
  private formGroups: { [key: string]: FormGroup } = {};

  get targetLanguage(): string | undefined {
    return this.xliffService.currentDocument?.targetLanguage;
  }

  get dubiousLanguage(): boolean {
    const language = this.form.get('inputTargetLanguage')?.value;
    return language
      ? !this.xliffService.isUsualLocaleFormat(language.trim())
      : false;
  }

  constructor(
    private formBuilder: FormBuilder,
    private xliffService: XliffService
  ) {
    this.dataSource = new TranslationUnitTableDataSource();
  }

  ngOnInit(): void {
    if (this.xliffService.currentDocument) {
      this.dataSource?.use(this.xliffService.currentDocument);
    }
    this.form = this.formBuilder.group({
      inputTargetLanguage: new FormControl(
        this.xliffService.currentDocument?.targetLanguage,
        []
      ),
      translationUnits: this.formBuilder.array([]),
    });
    this.form.get('inputTargetLanguage')?.valueChanges.subscribe((event) => {
      this.setTargetLanguage(event);
    });
    if (localStorage.getItem('toxic-view-orientation') === 'columnLayout') {
      this.columnLayout = true;
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  switchViewOrientation(): void {
    this.columnLayout = !this.columnLayout;
    if (this.columnLayout) {
      localStorage.setItem('toxic-view-orientation', 'columnLayout');
    } else {
      localStorage.setItem('toxic-view-orientation', 'rowLayout');
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter(filterValue.trim().toLowerCase());
  }

  setTargetLanguage(event: string) {
    this.xliffService.currentDocument?.setTargetLanguage(event.trim());
  }

  // TODO
  // when something changes in the table content, then the formArray should
  // be rebuilt to avoid piling up form controls for every single item in the
  // table even if it is not in the current view and will also maybe not be
  // touched
  get translationUnits(): FormArray {
    return this.form.get('translationUnits') as FormArray;
  }

  formGroup(id: string): FormGroup {
    let formGroup = this.formGroups[id];
    if (!formGroup) {
      const translationUnit = this.xliffService.translationUnit(id);
      const targetFormControl = new FormControl({
        value: translationUnit?.target,
        disabled: translationUnit?.complexNode === true,
      });
      formGroup = this.formBuilder.group({ target: targetFormControl });
      formGroup.valueChanges.subscribe((event) =>
        this.onValueChange(id, event)
      );
      this.formGroups[id] = formGroup;
    }
    return formGroup;
  }

  showHints(item: TranslationUnitTableItem): boolean {
    return this.showMeaning(item) || this.showDescription(item);
  }

  showMeaning(item: TranslationUnitTableItem): boolean {
    if (item?.meaning) {
      return true;
    }
    return false;
  }

  showDescription(item: TranslationUnitTableItem): boolean {
    if (item?.description) {
      return true;
    }
    return false;
  }

  looksGoodToMe(item: TranslationUnitTableItem): void {
    this.xliffService.currentDocument?.setState(item.id, ValidStates.final);
    this.dataSource.confirmReview(item.id);
  }

  requestReview(item: TranslationUnitTableItem): void {
    this.xliffService.currentDocument?.setState(
      item.id,
      ValidStates.needsReviewTranslation
    );
    this.dataSource.requestReview(item.id);
  }

  toggleReviewMode(event: MatSlideToggleChange): void {
    this.reviewMode = event?.checked === true;
    this.dataSource.reviewMode = this.reviewMode;
  }

  private onValueChange(id: string, event: any): void {
    this.xliffService.currentDocument?.setTranslation(id, event.target);
    this.dataSource.setTranslation(id, event.target);
  }
}
