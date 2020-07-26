import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MockComponent } from 'ng-mocks';

import { HttpStatusBadgeComponent } from '../http-status-badge/http-status-badge.component';
import { HttpRequestComponent } from './http-request.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
