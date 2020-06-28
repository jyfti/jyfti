import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';

import { initialState } from '../../ngrx/dataflow.state';
import { DataflowDefinitionComponent } from './dataflow-definition.component';
import { HttpRequestComponent } from '../http-request/http-request.component';
import { MockComponent } from 'ng-mocks';

describe('DataflowDefinitionComponent', () => {
  let component: DataflowDefinitionComponent;
  let fixture: ComponentFixture<DataflowDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DataflowDefinitionComponent,
        MockComponent(HttpRequestComponent),
      ],
      providers: [provideMockStore({ initialState })],
      imports: [ReactiveFormsModule],
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
