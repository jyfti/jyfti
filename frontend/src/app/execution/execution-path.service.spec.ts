import { TestBed } from '@angular/core/testing';

import { ExecutionPathService } from './execution-path.service';
import { Dataflow } from '../types/dataflow.type';
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
      expect(service.advancePath(dataflow, inPath, variables)).toEqual(outPath);
    });
  });
});
