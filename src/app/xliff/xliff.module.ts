import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DropZoneModule } from './../drop-zone/drop-zone.module';
import { XliffUploadComponent } from './xliff-upload/xliff-upload.component';

@NgModule({
  declarations: [XliffUploadComponent],
  imports: [CommonModule, MatIconModule, DropZoneModule],
  exports: [XliffUploadComponent],
})
export class XliffModule {}
