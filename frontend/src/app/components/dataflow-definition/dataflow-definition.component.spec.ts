import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponents } from 'ng-mocks';

import { initialState } from '../../ngrx/dataflow.state';
import { StepsComponent } from '../steps/steps.component';
import { DataflowDefinitionComponent } from './dataflow-definition.component';

describe('DataflowDefinitionComponent', () => {
  let component: DataflowDefinitionComponent;
  let fixture: ComponentFixture<DataflowDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataflowDefinitionComponent,
        MockComponents(StepsComponent),
      ],
      providers: [provideMockStore({ initialState })],
      imports: [ReactiveFormsModule, RouterTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataflowDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
