import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpRequestComponent } from './http-request.component';

describe('HttpRequestComponent', () => {
  let component: HttpRequestComponent;
  let fixture: ComponentFixture<HttpRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
