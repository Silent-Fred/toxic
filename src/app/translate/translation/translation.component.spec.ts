import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslationComponent } from './translation.component';

@Component({
  selector: 'toxic-translation-unit-table',
  template: '',
  styles: [],
})
export class MockedTranslationUnitTableComponent {}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-icon',
  template: '',
  styles: [],
})
export class MockedMatIconComponent {}

describe('TranslationComponent', () => {
  let component: TranslationComponent;
  let fixture: ComponentFixture<TranslationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TranslationComponent,
        MockedTranslationUnitTableComponent,
        MockedMatIconComponent,
      ],
      imports: [RouterTestingModule, MatSnackBarModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TranslationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
