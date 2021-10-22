import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmUnsavedChangesComponent } from './confirm-unsaved-changes/confirm-unsaved-changes.component';
import { TranslationUnitTableComponent } from './translation-unit-table/translation-unit-table.component';
import { TranslationComponent } from './translation/translation.component';

@NgModule({
  declarations: [
    TranslationUnitTableComponent,
    TranslationComponent,
    ConfirmUnsavedChangesComponent,
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSortModule,
    MatTooltipModule,
    ReactiveFormsModule,
  ],
})
export class TranslateModule {}
