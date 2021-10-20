import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { XliffService } from './../../services/xliff.service';
import { ToxicRoutes } from './../../shared/shared.module';
import { TranslationUnitTableComponent } from './../translation-unit-table/translation-unit-table.component';

@Component({
  selector: 'toxic-translation',
  templateUrl: './translation.component.html',
  styleUrls: ['./translation.component.scss'],
})
export class TranslationComponent {
  @ViewChild(TranslationUnitTableComponent)
  translationUnitTable?: TranslationUnitTableComponent;

  constructor(private xliffService: XliffService, private router: Router) {}

  close(): void {
    // TODO figure out if a confirm dialogue would be more helpful or harmful,
    // if an "autosave" in case of unsaved changes would be annoying (because
    // it would mean to deal with the file save dialogue) or nice.
    // this.downloadAs('toxic_autosave.xliff');
    this.router.navigate([ToxicRoutes.home]);
  }

  download(): void {
    this.downloadAs(
      this.xliffService.currentDocument?.filename || 'messages.xliff'
    );
  }

  private downloadAs(name: string): void {
    const blob = this.xliffService.currentDocument?.asBlob();
    if (blob) {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = name;
      a.click();
      URL.revokeObjectURL(objectUrl);
    }
  }
}
