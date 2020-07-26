import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponents } from 'ng-mocks';

import { initialState } from '../../ngrx/dataflow.state';
import { StepsComponent } from '../steps/steps.component';
import { DataflowUiViewComponent } from './dataflow-ui-view.component';

describe('DataflowUiViewComponent', () => {
  let component: DataflowUiViewComponent;
  let fixture: ComponentFixture<DataflowUiViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataflowUiViewComponent, MockComponents(StepsComponent)],
      providers: [provideMockStore({ initialState })],
      imports: [ReactiveFormsModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataflowUiViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
