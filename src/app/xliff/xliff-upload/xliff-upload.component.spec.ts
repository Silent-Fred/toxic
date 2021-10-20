import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { XliffUploadComponent } from './xliff-upload.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'mat-icon',
  template: '',
  styles: [],
})
export class MockedMatIconComponent {}

describe('XliffUploadComponent', () => {
  let component: XliffUploadComponent;
  let fixture: ComponentFixture<XliffUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [XliffUploadComponent, MockedMatIconComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XliffUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
