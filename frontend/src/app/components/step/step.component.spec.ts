import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepComponent } from './step.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

describe('StepComponent', () => {
  let component: StepComponent;
  let fixture: ComponentFixture<StepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StepComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      assignTo: new FormControl(''),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
