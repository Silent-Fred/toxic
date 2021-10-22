import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmUnsavedChangesComponent } from './confirm-unsaved-changes.component';

describe('ConfirmUnsavedChangesComponent', () => {
  let component: ConfirmUnsavedChangesComponent;
  let fixture: ComponentFixture<ConfirmUnsavedChangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmUnsavedChangesComponent],
      imports: [MatDialogModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmUnsavedChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
