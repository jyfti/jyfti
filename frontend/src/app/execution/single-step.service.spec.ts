import { TestBed } from '@angular/core/testing';

import { SingleStepService } from './single-step.service';
import { of } from 'rxjs';
import { HttpResponse, HttpClient } from '@angular/common/http';
import { Step } from '../types/step.type';

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

  it('should zip steps and incompleted evaluations to a variable map', () => {
    const steps: Step[] = [
      {
        assignTo: 'varA',
        expression: 1,
      },
      {
        assignTo: 'varB',
        expression: 2,
      },
      {
        assignTo: 'varC',
        expression: 3,
      },
    ];
    const evaluations = [1, 2];
    expect(service.toVariableMap(steps, evaluations)).toEqual({
      varA: 1,
      varB: 2,
    });
  });
});
