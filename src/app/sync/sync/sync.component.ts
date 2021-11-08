import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  private latest?: XliffDocument;
  private align?: XliffDocument;

  constructor(private xliffService: XliffService, private router: Router) {}

  ngOnInit(): void {
    this.latest = undefined;
    this.align = undefined;
  }

  get latestIsDefined(): boolean {
    return this.latest !== undefined;
  }

  get alignIsDefined(): boolean {
    return this.align !== undefined;
  }

  get latestFilename(): string | undefined {
    return this.latest?.filename;
  }

  get alignFilename(): string | undefined {
    return this.align?.filename;
  }

  onUploadLatest(event: XliffDocument): void {
    this.latest = event;
    this.alignAndNavigateWhenReady();
  }
  onUploadAlign(event: XliffDocument): void {
    this.align = event;
    this.alignAndNavigateWhenReady();
  }

  /**
   * Aligns the old translation document with the latest set of translation items.
   * The roles are kind of reverted though: Existing translations are copied into
   * the "latest" document because that already has the correct set of translation
   * items. Makes adding and removing items unnecessary.
   */
  alignDocuments(): void {
    if (this.latest && this.align) {
      this.alignGeneraInformation(this.latest, this.align);
      const existingTranslationUnits = [...this.align.translationUnits];
      this.latest.translationUnits.forEach((translationUnit) => {
        let state: string = ValidStates.final;
        const existingTranslationUnit = existingTranslationUnits.find(
          (existingCandidate) => existingCandidate.id === translationUnit.id
        );
        if (!existingTranslationUnit) {
          state = ValidStates.initial;
        } else {
          translationUnit.fragments.forEach((fragment, index) => {
            const existingFragment =
              index < existingTranslationUnit.fragments.length
                ? existingTranslationUnit.fragments[index]
                : undefined;
            if (existingFragment?.source !== fragment.source) {
              state = ValidStates.initial;
            }
            this.latest?.setTranslation(
              translationUnit.id,
              index,
              existingFragment?.target ?? fragment.source
            );
            this.latest?.setState(translationUnit.id, state);
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

  private alignAndNavigateWhenReady(): void {
    if (this.latest && this.align) {
      this.alignDocuments();
      this.xliffService.use(this.latest);
      this.router.navigate([ToxicRoutes.translate]);
    }
  }
}
