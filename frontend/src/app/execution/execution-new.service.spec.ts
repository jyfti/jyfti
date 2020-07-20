import { HttpClient, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';

import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { ExecutionNewService } from './execution-new.service';
import { map } from 'rxjs/operators';

describe('ExecutionNewService', () => {
  let service: ExecutionNewService;
  const httpClientStub = {
    request: () => of(new HttpResponse({ body: { field: 'value' } })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpClientStub }],
    });
    service = TestBed.inject(ExecutionNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should execute http request step', () => {
    it('without expressions successfully', () => {
      const step: Step = {
        assignTo: 'outVar',
        request: {
          method: 'GET',
          url: 'http://localhost:1234/abc',
        },
      };
      const variables: VariableMap = {};
      expect(
        service
          .executeStep(step, variables)
          .pipe(map((response) => response.body))
      ).toBeObservable(cold('(a|)', { a: { field: 'value' } }));
    });
  });

  describe('should evaluate expression step', () => {
    it('successfully', () => {
      const step: Step = {
        assignTo: 'outVar',
        expression: {
          $eval: 'inVar',
        },
      };
      const variables: VariableMap = {
        inVar: [1, 2, 3],
      };
      expect(service.executeStep(step, variables)).toBeObservable(
        cold('(a|)', { a: [1, 2, 3] })
      );
    });

    it('to an error if the expression is invalid', () => {
      const step: Step = {
        assignTo: 'outVar',
        expression: {
          $eval: {
            $eval: 3,
          },
        },
      };
      const variables: VariableMap = {};
      expect(service.executeStep(step, variables)).toBeObservable(
        cold('(a|)', {
          a: {
            error: 'TemplateError: $eval must be given a string expression',
          },
        })
      );
    });

    it('to an error if a variable does not exist', () => {
      const step: Step = {
        assignTo: 'outVar',
        expression: {
          $eval: 'inVar',
        },
      };
      const variables: VariableMap = {};
      expect(service.executeStep(step, variables)).toBeObservable(
        cold('(a|)', {
          a: {
            error: 'InterpreterError: unknown context value inVar',
          },
        })
      );
    });
  });
});
