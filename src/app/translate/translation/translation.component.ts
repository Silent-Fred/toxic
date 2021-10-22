import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { XliffService } from './../../services/xliff.service';
import { ToxicRoutes } from './../../shared/shared.module';
import { ConfirmUnsavedChangesComponent } from './../confirm-unsaved-changes/confirm-unsaved-changes.component';
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
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  get filename(): string {
    return this.xliffService.currentDocument?.filename ?? '';
  }

  get unsavedChanges(): boolean {
    return this.xliffService.currentDocument?.unsavedChanges ?? false;
  }

  close(): void {
    if (this.xliffService.currentDocument?.unsavedChanges) {
      this.confirmUnsavedChanges();
    } else {
      this.closeConfirmed();
    }
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

  private confirmUnsavedChanges() {
    const dialogRef = this.dialog.open(ConfirmUnsavedChangesComponent);
    dialogRef.afterClosed().subscribe((leave) => {
      if (leave) {
        this.closeConfirmed();
      }
    });
  }

  private closeConfirmed(): void {
    this.xliffService.clear();
    this.router.navigate([ToxicRoutes.home]);
  }

  private downloadAs(name: string): void {
    const blob = this.xliffService.currentDocument?.asBlob();
    if (blob) {
      this.xliffService.currentDocument?.acceptUnsavedChanges();
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = name;
      a.click();
      URL.revokeObjectURL(objectUrl);
    }
  }
}
