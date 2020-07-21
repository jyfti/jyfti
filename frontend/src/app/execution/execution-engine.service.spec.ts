import { HttpClient, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import {
  ExecutionEngineService,
  ExecutionScope,
} from './execution-engine.service';

describe('ExecutionEngineService', () => {
  let service: ExecutionEngineService;
  const httpClientStub = {
    request: () => of(new HttpResponse({ body: { field: 'value' } })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
    });
    service = TestBed.inject(ExecutionEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('the execution of the next step', () => {
    it('should execute the first step', () => {
      const dataflow = {
        name: 'MyDataflow',
        steps: [
          {
            assignTo: 'outVar',
            expression: 1
          },
        ],
      };
      const scope: ExecutionScope = {
        stepIndex: 0,
        evaluations: [],
      };
      expect(service.executeNext(dataflow, scope)).toBeObservable(
        cold('(a|)', { a: 1 })
      );
    });
    it('should execute the second step considering the evaluation of the first step without evaluating it', () => {
      const dataflow = {
        name: 'MyDataflow',
        steps: [
          {
            assignTo: 'var1',
            expression: 5
          },
          {
            assignTo: 'var2',
            expression: {
              $eval: 'var1'
            }
          },
        ],
      };
      const scope: ExecutionScope = {
        stepIndex: 1,
        evaluations: [42],
      };
      expect(service.executeNext(dataflow, scope)).toBeObservable(
        cold('(a|)', { a: 42 })
      );
    });
  });
});
