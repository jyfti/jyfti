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

  describe('should execute a block', () => {
    it('of no steps', () => {
      expect(service.executeBlock([], {})).toBeObservable(
        cold('(a|)', { a: [] })
      );
    });

    it('of a single step', () => {
      const step: Step = {
        assignTo: 'outVar',
        expression: {
          $eval: 'inVar',
        },
      };
      const variables: VariableMap = {
        inVar: [1, 2, 3],
      };
      expect(service.executeBlock([step], variables)).toBeObservable(
        cold('(a|)', { a: [[1, 2, 3]] })
      );
    });

    it('of two steps with the second step requiring the result of the first step', () => {
      const steps: Step[] = [
        {
          assignTo: 'varA',
          expression: 1,
        },
        {
          assignTo: 'varB',
          expression: {
            $eval: 'varA + 2',
          },
        },
      ];
      expect(service.executeBlock(steps, {})).toBeObservable(
        cold('(a|)', { a: [1, 3] })
      );
    });
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
