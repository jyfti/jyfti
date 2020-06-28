import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpRequestDetailComponent } from './http-request-detail.component';

describe('HttpRequestDetailComponent', () => {
  let component: HttpRequestDetailComponent;
  let fixture: ComponentFixture<HttpRequestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpRequestDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpRequestDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
