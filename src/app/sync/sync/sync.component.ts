import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationUnit } from './../../model/translation-unit';
import { XliffDocument } from './../../model/xliff-document';
import { ValidStates } from './../../model/xliff-version-abstraction';
import { XliffService } from './../../services/xliff.service';
import { ToxicRoutes } from './../../shared/shared.module';

@Component({
  selector: 'toxic-sync',
  templateUrl: './sync.component.html',
  styleUrls: ['./sync.component.scss'],
})
export class SyncComponent implements OnInit {
  private latestDocument?: XliffDocument;
  private alignDocument?: XliffDocument;

  constructor(private xliffService: XliffService, private router: Router) {}

  ngOnInit(): void {
    this.latestDocument = undefined;
    this.alignDocument = undefined;
  }

  get latestIsDefined(): boolean {
    return this.latestDocument !== undefined;
  }

  get alignIsDefined(): boolean {
    return this.alignDocument !== undefined;
  }

  get latestFilename(): string | undefined {
    return this.latestDocument?.filename;
  }

  get alignFilename(): string | undefined {
    return this.alignDocument?.filename;
  }

  onUploadLatest(event: XliffDocument): void {
    this.latestDocument = event;
    this.alignAndNavigateWhenReady();
  }
  onUploadAlign(event: XliffDocument): void {
    this.alignDocument = event;
    this.alignAndNavigateWhenReady();
  }

  /**
   * Aligns the old translation document with the latest set of translation items.
   * The roles are kind of reverted though: Existing translations are copied into
   * the "latest" document because that already has the correct set of translation
   * items. Makes adding and removing items unnecessary.
   */
  alignDocuments(): void {
    if (this.latestDocument && this.alignDocument) {
      this.alignGeneraInformation(this.latestDocument, this.alignDocument);
      const existingTranslationUnits = [...this.alignDocument.translationUnits];
      this.latestDocument.translationUnits.forEach((translationUnit) => {
        const existingTranslationUnit = existingTranslationUnits.find(
          (existingCandidate) => existingCandidate.id === translationUnit.id
        );
        if (existingTranslationUnit) {
          translationUnit.fragments.forEach((fragment, index) => {
            const existingFragment =
              index < existingTranslationUnit.fragments.length
                ? existingTranslationUnit.fragments[index]
                : undefined;
            this.latestDocument?.setTranslation(
              translationUnit.id,
              index,
              existingFragment?.target ?? fragment.source
            );
            this.latestDocument?.setState(
              translationUnit.id,
              this.calculateState(translationUnit, existingTranslationUnit)
            );
          });
        }
      });
    }
  }

  private alignGeneraInformation(
    latest: XliffDocument,
    align: XliffDocument
  ): void {
    if (latest && align) {
      latest.setTargetLanguage(align?.targetLanguage ?? 'en');
      latest.filename = align?.filename ?? 'updated.xliff';
    }
  }

  private calculateState(
    latestTranslationUnit: TranslationUnit,
    existingTranslationUnit: TranslationUnit | undefined | null
  ): string {
    if (
      !this.isBasicallyTheSameSourceAsBefore(
        latestTranslationUnit,
        existingTranslationUnit
      )
    ) {
      return ValidStates.initial;
    }
    return (
      existingTranslationUnit?.fragments?.[0]?.state ?? ValidStates.initial
    );
  }

  private isBasicallyTheSameSourceAsBefore(
    latestTranslationUnit: TranslationUnit,
    existingTranslationUnit: TranslationUnit | undefined | null
  ): boolean {
    if (!existingTranslationUnit) {
      return false;
    }
    return (
      latestTranslationUnit.fragments?.length ===
        existingTranslationUnit.fragments?.length &&
      latestTranslationUnit.fragments
        ?.map((fragment) => fragment.source)
        .join('#') ===
        existingTranslationUnit.fragments
          ?.map((fragment) => fragment.source)
          .join('#')
    );
  }

  private alignAndNavigateWhenReady(): void {
    if (this.latestDocument && this.alignDocument) {
      this.alignDocuments();
      this.xliffService.use(this.latestDocument);
      this.router.navigate([ToxicRoutes.translate]);
    }
  }
}
