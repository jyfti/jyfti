import { HttpClient, HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';

import { ExecutionEngineService } from './execution-engine.service';
import { Dataflow } from '../types/dataflow.type';
import { Step } from '../types/step.type';

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

  describe('the advancement of paths', () => {
    describe('with one level', () => {
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
        expect(service.advancePath(dataflow, [0], {})).toEqual([1]);
      });

      it('should return empty list on last step of root', () => {
        expect(service.advancePath(dataflow, [1], {})).toEqual([]);
      });
    });

    describe('with a single for loop', () => {
      const steps: Step[] = [
        {
          assignTo: 'var1',
          for: {
            const: 'loopVar',
            in: 'listVar',
            do: [
              {
                assignTo: 'var2',
                expression: 2,
              },
            ],
            return: 'loopVar',
          },
        },
      ];

      const variables = {
        listVar: ['a', 'b'],
      };

      it('should go to the first step within the loop at the start', () => {
        expect(service.advancePathRec(steps, [], variables)).toEqual([0, 0, 0]);
      });

      it('should go to the first step of the second variable after the last step of the first variable', () => {
        expect(service.advancePathRec(steps, [0, 0, 0], variables)).toEqual([
          0,
          1,
          0,
        ]);
      });
    });

    describe('with nested for loops', () => {
      const dataflow: Dataflow = {
        name: 'MyDataflow',
        steps: [
          {
            assignTo: 'listVar1',
            expression: ['a', 'b'],
          },
          {
            assignTo: 'listVar2',
            expression: [true, false],
          },
          {
            assignTo: 'var1',
            for: {
              const: 'loopVar1',
              in: 'listVar1',
              do: [
                {
                  assignTo: 'var2',
                  expression: 2,
                },
                {
                  assignTo: 'var3',
                  expression: 3,
                },
                {
                  assignTo: 'var4',
                  for: {
                    const: 'loopVar2',
                    in: 'listVar2',
                    do: [
                      {
                        assignTo: 'var5',
                        expression: 5,
                      },
                    ],
                    return: 'loopVar2',
                  },
                },
              ],
              return: 'loopVar1',
            },
          },
          {
            assignTo: 'var6',
            expression: 6,
          },
        ],
      };

      const variables = {
        listVar1: ['a', 'b'],
        listVar2: [true, false],
      };

      it.each([
        ['should advance an empty path to the first step', [], [0]],
        [
          'should recursively descend if the next step is a for loop',
          [1],
          [2, 0, 0],
        ],
        [
          'should advance a path in a loop to the next step within the loop',
          [2, 0, 0],
          [2, 0, 1],
        ],
        [
          'should recursively descend inside of a for loop if the next step is a nested for loop',
          [2, 0, 1],
          [2, 0, 2, 0, 0],
        ],
        [
          'should advance a path in a loop to the next iteration of the loop if the end of the loop is reached',
          [2, 1, 2, 1, 0],
          [3],
        ],
      ])('%s', (text, inPath, outPath) => {
        expect(service.advancePath(dataflow, inPath, variables)).toEqual(
          outPath
        );
      });
    });
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
});
