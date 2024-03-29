import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatTable } from '@angular/material/table';
import { take } from 'rxjs';
import { ValidStates } from 'src/app/model/xliff-version-abstraction';
import { LibreTranslateService } from 'src/app/services/libre-translate.service';
import { XliffService } from './../../services/xliff.service';
import { TranslationUnitTableDataSource } from './translation-unit-table-datasource';
import { TranslationUnitTableItem } from './translation-unit-table-item';

@Component({
  selector: 'toxic-translation-unit-table',
  templateUrl: './translation-unit-table.component.html',
  styleUrls: ['./translation-unit-table.component.scss'],
})
export class TranslationUnitTableComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatTable) table!: MatTable<TranslationUnitTableItem>;
  dataSource: TranslationUnitTableDataSource;

  columnLayout = false;
  get rowLayout(): boolean {
    return !this.columnLayout;
  }
  set rowLayout(value: boolean) {
    this.columnLayout = !value;
  }

  get displayedColumns(): string[] {
    return ['translation'];
  }

  get automaticTranslationAvailable(): boolean {
    return this.libreTranslateService.available;
  }

  get languagesSupported(): boolean {
    return this.libreTranslateService.languagesSupported(
      this.sourceLanguage,
      this.targetLanguage
    );
  }

  reviewMode = false;

  form!: FormGroup;
  private formGroups: { [key: string]: FormGroup } = {};

  private _targetLanguage?: string;
  get targetLanguage(): string | undefined {
    return this._targetLanguage;
  }

  private _sourceLanguage?: string;
  get sourceLanguage(): string | undefined {
    return this._sourceLanguage;
  }

  get dubiousLanguage(): boolean {
    const language = this.form.get('inputTargetLanguage')?.value;
    return language
      ? !this.xliffService.isUsualLocaleFormat(language.trim())
      : false;
  }

  constructor(
    private formBuilder: FormBuilder,
    private xliffService: XliffService,
    private libreTranslateService: LibreTranslateService
  ) {
    this.dataSource = new TranslationUnitTableDataSource();
  }

  ngOnInit(): void {
    if (this.xliffService.currentDocument) {
      this.dataSource?.use(this.xliffService.currentDocument);
      this._sourceLanguage = this.xliffService.currentDocument?.sourceLanguage;
      this._targetLanguage = this.xliffService.currentDocument?.targetLanguage;
    }
    this.form = this.formBuilder.group({
      inputTargetLanguage: new FormControl<string | null | undefined>(
        this.targetLanguage,
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
    this._targetLanguage = event.trim();
    this.xliffService.currentDocument?.setTargetLanguage(this._targetLanguage);
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
      const translationUnitItem = this.dataSource.findItemById(id);
      const targetFormControl = new FormControl<string | undefined | null>({
        value: translationUnitItem?.target,
        disabled: translationUnitItem?.unsupported === true,
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
    this.dataSource.confirmReview(item.id);
    this.xliffService.currentDocument?.setState(
      item.translationUnitId,
      ValidStates.final
    );
  }

  requestReview(item: TranslationUnitTableItem): void {
    this.dataSource.requestReview(item.id);
    this.xliffService.currentDocument?.setState(
      item.translationUnitId,
      ValidStates.translated
    );
  }

  useAutomaticTranslation(item: TranslationUnitTableItem): void {
    this.libreTranslateService
      .translate(item.source, this.sourceLanguage, this.targetLanguage)
      .pipe(take(1))
      .subscribe((automaticTranslation) => {
        if (automaticTranslation?.translatedText) {
          item.target = automaticTranslation?.translatedText;
          this.formGroup(item.id)?.controls?.target?.setValue(item.target);
          // ...and let the change detection do the rest
        }
      });
  }

  toggleReviewMode(event: MatSlideToggleChange): void {
    this.reviewMode = event?.checked === true;
    this.dataSource.reviewMode = this.reviewMode;
  }

  private onValueChange(id: string, event: any): void {
    const item = this.dataSource.findItemById(id);
    if (item) {
      this.dataSource.setTranslation(id, event.target);
      this.xliffService.currentDocument?.setTranslation(
        item?.translationUnitId,
        item?.fragmentIndex,
        event.target
      );
    }
  }
}
