import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonEEvaluationComponent } from './json-e-evaluation.component';

describe('JsonEEvaluationComponent', () => {
  let component: JsonEEvaluationComponent;
  let fixture: ComponentFixture<JsonEEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonEEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonEEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
