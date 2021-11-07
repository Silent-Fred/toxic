import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XliffModule } from '../xliff/xliff.module';
import { SyncComponent } from './sync/sync.component';

@NgModule({
  declarations: [SyncComponent],
  imports: [CommonModule, XliffModule],
})
export class SyncModule {}
