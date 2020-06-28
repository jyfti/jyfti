import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpStatusBadgeComponent } from './http-status-badge.component';

describe('HttpStatusBadgeComponent', () => {
  let component: HttpStatusBadgeComponent;
  let fixture: ComponentFixture<HttpStatusBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HttpStatusBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpStatusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
