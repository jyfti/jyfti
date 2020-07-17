import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataflowSelectionComponent } from './dataflow-selection.component';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('DataflowSelectionComponent', () => {
  let component: DataflowSelectionComponent;
  let fixture: ComponentFixture<DataflowSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DataflowSelectionComponent],
      providers: [
        provideMockStore({
          initialState: { dataflow: { dataflowPreviews: [] } },
        }),
      ],
      imports: [RouterTestingModule, ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataflowSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
