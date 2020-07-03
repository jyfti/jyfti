import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataflowPageComponent } from './dataflow-page.component';

describe('DataflowPageComponent', () => {
  let component: DataflowPageComponent;
  let fixture: ComponentFixture<DataflowPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataflowPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataflowPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
