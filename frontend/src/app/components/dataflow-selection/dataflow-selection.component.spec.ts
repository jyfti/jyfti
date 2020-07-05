import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataflowSelectionComponent } from './dataflow-selection.component';

describe('DataflowSelectionComponent', () => {
  let component: DataflowSelectionComponent;
  let fixture: ComponentFixture<DataflowSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataflowSelectionComponent ]
    })
    .compileComponents();
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
