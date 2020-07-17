import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForLoopComponent } from './for-loop.component';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormArray,
} from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { StepsComponent } from '../steps/steps.component';

describe('ForLoopComponent', () => {
  let component: ForLoopComponent;
  let fixture: ComponentFixture<ForLoopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForLoopComponent, MockComponent(StepsComponent)],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForLoopComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      const: new FormControl(''),
      in: new FormControl(''),
      return: new FormControl(''),
      do: new FormArray([]),
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
