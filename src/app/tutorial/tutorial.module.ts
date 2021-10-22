import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TutorialComponent } from './tutorial.component';

@NgModule({
  declarations: [TutorialComponent],
  imports: [CommonModule, MatButtonModule, RouterModule],
})
export class TutorialModule {}
