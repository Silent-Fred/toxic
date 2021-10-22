import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

export const ToxicRoutes = {
  home: 'home',
  translate: 'translate',
  tutorial: 'tutorial',
} as const;

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class SharedModule {}
