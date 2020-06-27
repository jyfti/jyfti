import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DataflowDefinitionComponent } from './dataflow-definition.component';

describe('DataflowDefinitionComponent', () => {
  let component: DataflowDefinitionComponent;
  let fixture: ComponentFixture<DataflowDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DataflowDefinitionComponent ]
    })
    .compileComponents();
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
