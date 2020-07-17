import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonEEvaluationComponent } from './json-e-evaluation.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MockComponent } from 'ng-mocks';
import { EditorComponent } from 'ngx-monaco-editor';

describe('JsonEEvaluationComponent', () => {
  let component: JsonEEvaluationComponent;
  let fixture: ComponentFixture<JsonEEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JsonEEvaluationComponent, MockComponent(EditorComponent)],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonEEvaluationComponent);
    component = fixture.componentInstance;
    component.formControl = new FormControl('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
