import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XliffDocument } from './../model/xliff-document';
import { TitleService } from './../services/title.service';
import { XliffService } from './../services/xliff.service';
import { ToxicRoutes } from './../shared/shared.module';

@Component({
  selector: 'toxic-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private router: Router,
    private xliffService: XliffService,
    private titleService: TitleService
  ) {}

  onUpload(event: XliffDocument): void {
    this.xliffService.use(event);
    if (this.xliffService.currentDocument?.filename) {
      this.titleService.title = this.xliffService.currentDocument.filename;
    } else {
      this.titleService.reset();
    }
    this.router.navigate([ToxicRoutes.translate]);
  }
}
