import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StepsComponent } from './steps.component';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { MockComponents } from 'ng-mocks';
import { HttpRequestComponent } from '../http-request/http-request.component';
import { JsonEEvaluationComponent } from '../json-e-evaluation/json-e-evaluation.component';
import { ForLoopComponent } from '../for-loop/for-loop.component';
import { StepComponent } from '../step/step.component';

describe('StepsComponent', () => {
  let component: StepsComponent;
  let fixture: ComponentFixture<StepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StepsComponent,
        MockComponents(
          HttpRequestComponent,
          JsonEEvaluationComponent,
          ForLoopComponent,
          StepComponent
        ),
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StepsComponent);
    component = fixture.componentInstance;
    component.steps = new FormArray([]);
    component.evaluations = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
