import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
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
  @ViewChild('downloadStartedSnackbar')
  downloadStartedSnackbarTemplate?: TemplateRef<any>;
  @ViewChild(TranslationUnitTableComponent)
  translationUnitTable?: TranslationUnitTableComponent;

  constructor(
    private xliffService: XliffService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  close(): void {
    // TODO figure out if a confirm dialogue would be more helpful or harmful,
    // if an "autosave" in case of unsaved changes would be annoying (because
    // it would mean to deal with the file save dialogue) or nice.
    // this.downloadAs('toxic_autosave.xliff');
    this.router.navigate([ToxicRoutes.home]);
  }

  download(): void {
    const snackBarConfig = { duration: 3000 };
    if (!this.downloadStartedSnackbarTemplate) {
      this.snackBar.open(
        'The download of your translations has been initiated.',
        '',
        snackBarConfig
      );
    } else {
      this.snackBar.openFromTemplate(
        this.downloadStartedSnackbarTemplate,
        snackBarConfig
      );
    }
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
