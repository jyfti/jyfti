import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpRequestDetailPageComponent } from './http-request-detail-page.component';

describe('HttpRequestDetailPageComponent', () => {
  let component: HttpRequestDetailPageComponent;
  let fixture: ComponentFixture<HttpRequestDetailPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpRequestDetailPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpRequestDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
