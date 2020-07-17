import { HttpResponse } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { HttpRequestComponent } from './http-request.component';
import { MockComponent } from 'ng-mocks';
import { HttpStatusBadgeComponent } from '../http-status-badge/http-status-badge.component';

describe('HttpRequestComponent', () => {
  let component: HttpRequestComponent;
  let fixture: ComponentFixture<HttpRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HttpRequestComponent,
        MockComponent(HttpStatusBadgeComponent),
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HttpRequestComponent);
    const fb = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    component.formGroup = fb.group({
      method: 'GET',
      url: 'http://url.io',
    });
    component.evaluation = new HttpResponse({ status: 200 });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
