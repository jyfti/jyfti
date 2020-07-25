import { TestBed } from '@angular/core/testing';

import { ExecutionPathService } from './execution-path.service';
import { Step } from '../types/step.type';

describe('ExecutionPathService', () => {
  let service: ExecutionPathService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionPathService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it.each([
    ['a', [], 'a'],
    [['a'], [0], 'a'],
    [['a', 'b'], [1], 'b'],
    [['a', ['b', 'c']], [1], ['b', 'c']],
    [['a', ['b', 'c']], [1, 1], 'c'],
  ])('resolveEvaluation(%s, %s)=%s', (evaluations, path, expectation) => {
    expect(service.resolveEvaluation(evaluations, path)).toEqual(expectation);
  });

  it.each([
    [[], [], 'a', ['a']],
    [[0], [], 'a', ['a']],
    [[1], ['a'], 'b', ['a', 'b']],
    [[1, 0], ['a'], 'b', ['a', ['b']]],
    [[1, 0, 0], ['a'], 'b', ['a', [['b']]]],
    [[0], [[['a']]], 'b', ['b']],
  ])(
    'addEvaluation(%s, %s, %s)=%s',
    (path, evaluations, evaluation, expectation) => {
      expect(service.addEvaluation(path, evaluations, evaluation)).toEqual(
        expectation
      );
    }
  );

  describe('resolveStep', () => {
    it('should resolve the first step of a flat dataflow', () => {
      const steps: Step[] = [
        {
          assignTo: 'var1',
          expression: 1,
        },
      ];
      expect(service.resolveStepRec(steps, [0])).toEqual(steps[0]);
    });

    it('should resolve the second step of a dataflow', () => {
      const steps: Step[] = [
        {
          assignTo: 'var1',
          expression: 1,
        },
        {
          assignTo: 'var2',
          expression: 2,
        },
      ];
      expect(service.resolveStepRec(steps, [1])).toEqual(steps[1]);
    });

    it('should resolve the first step of a loop', () => {
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
      expect(service.resolveStepRec(steps, [0, 0, 0])).toEqual(
        steps[0].for.do[0]
      );
    });

    it('should resolve a loop itself', () => {
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
      expect(service.resolveStepRec(steps, [0])).toEqual(steps[0]);
    });
  });
});
