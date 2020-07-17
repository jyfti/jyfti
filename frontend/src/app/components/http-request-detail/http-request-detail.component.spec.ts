import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MockComponents } from 'ng-mocks';
import { EditorComponent } from 'ngx-monaco-editor';

import { HttpRequestDetailComponent } from './http-request-detail.component';
import { HttpRequestComponent } from '../http-request/http-request.component';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('HttpRequestDetailComponent', () => {
  let component: HttpRequestDetailComponent;
  let fixture: ComponentFixture<HttpRequestDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HttpRequestDetailComponent,
        MockComponents(EditorComponent, HttpRequestComponent),
      ],
      providers: [provideMockStore()],
      imports: [ReactiveFormsModule, RouterTestingModule],
    }).compileComponents();
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
