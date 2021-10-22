import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { XliffDocument } from './../model/xliff-document';
import { XliffService } from './../services/xliff.service';
import { ToxicRoutes } from './../shared/shared.module';

@Component({
  selector: 'toxic-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(private router: Router, private xliffService: XliffService) {}

  onUpload(event: XliffDocument): void {
    this.xliffService.use(event);
    this.router.navigate([ToxicRoutes.translate]);
  }
}
