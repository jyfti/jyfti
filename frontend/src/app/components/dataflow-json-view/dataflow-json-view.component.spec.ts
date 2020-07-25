import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataflowJsonViewComponent } from './dataflow-json-view.component';

describe('DataflowJsonViewComponent', () => {
  let component: DataflowJsonViewComponent;
  let fixture: ComponentFixture<DataflowJsonViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataflowJsonViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataflowJsonViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
