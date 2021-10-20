import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XliffModule } from './../xliff/xliff.module';
import { HomeComponent } from './home.component';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, XliffModule],
})
export class HomeModule {}
