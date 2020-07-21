import { TestBed } from '@angular/core/testing';

import { SingleStepService } from './single-step.service';
import { of } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';

describe('SingleStepService', () => {
  let service: SingleStepService;
  const httpClientStub = {
    request: () => of(new HttpResponse({ body: { field: 'value' } })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
    });
    service = TestBed.inject(SingleStepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
