import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TitleService {
  title!: string;

  constructor() {
    this.reset();
  }

  reset(): void {
    this.title = 'TOXIC editor';
  }
}
