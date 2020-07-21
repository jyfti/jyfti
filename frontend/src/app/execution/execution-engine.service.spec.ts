import { HttpClient, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';

import { ExecutionEngineService } from './execution-engine.service';
import { Dataflow } from '../types/dataflow.type';

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

  describe('the execution of ticks', () => {
    it('should progress through a small dataflow and eventually terminate', () => {
      const dataflow: Dataflow = {
        name: 'MyDataflow',
        steps: [
          {
            assignTo: 'var1',
            expression: 5,
          },
          {
            assignTo: 'var2',
            expression: {
              $eval: 'var1 * 2',
            },
          },
          {
            assignTo: 'var3',
            expression: {
              $eval: 'var1 * var2',
            },
          },
        ],
      };
      expect(service.executeDataflow(dataflow)).toBeObservable(
        cold('(abc|)', {
          a: { path: [0], evaluation: 5 },
          b: { path: [1], evaluation: 10 },
          c: { path: [2], evaluation: 50 },
        })
      );
    });
  });

  describe('the execution of the next step', () => {
    it('should execute the first step', () => {
      const dataflow = {
        name: 'MyDataflow',
        steps: [
          {
            assignTo: 'outVar',
            expression: 1,
          },
        ],
      };
      expect(service.tick(dataflow, [0], [])).toBeObservable(
        cold('(a|)', { a: 1 })
      );
    });

    it('should execute the second step considering the evaluation of the first step without evaluating it', () => {
      const dataflow = {
        name: 'MyDataflow',
        steps: [
          {
            assignTo: 'var1',
            expression: 5,
          },
          {
            assignTo: 'var2',
            expression: {
              $eval: 'var1',
            },
          },
        ],
      };
      expect(service.tick(dataflow, [1], [42])).toBeObservable(
        cold('(a|)', { a: 42 })
      );
    });
  });

  describe('the advancement of paths', () => {
    describe('on root level', () => {
      const dataflow: Dataflow = {
        name: 'MyDataflow',
        steps: [
          {
            assignTo: 'var1',
            expression: 1,
          },
          {
            assignTo: 'var2',
            expression: 2,
          },
        ],
      };

      it('should advance a path on root', () => {
        expect(service.advancePath(dataflow, [0])).toEqual([1]);
      });

      it('should return null on last step of root', () => {
        expect(service.advancePath(dataflow, [1])).toBeNull();
      });
    });
  });
});
