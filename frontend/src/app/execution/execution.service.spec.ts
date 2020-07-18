import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { stepExecution } from '../ngrx/dataflow-execution.actions';
import { ExecutionScope } from '../types/execution-scope.type';
import { Step } from '../types/step.type';
import { ExecutionService, StepAction } from './execution.service';
import { map } from 'rxjs/operators';

describe('ExecutionService', () => {
  let service: ExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a single positive result for the execution of an expression step', () => {
    const step: Step = {
      assignTo: 'outVar',
      expression: {
        $eval: 'inVar',
      },
    };
    const steps: Step[] = [
      {
        assignTo: 'inVar',
      },
      step,
    ];
    const scope: ExecutionScope = {
      stepIndex: 0,
      steps,
      localVariables: {
        0: [1, 2, 3],
      },
      parentVariables: {},
    };
    const initiator: StepAction = stepExecution({
      scope: {
        stepIndex: 2,
        steps,
        localVariables: {
          0: [1, 2, 3],
        },
        parentVariables: {},
      },
    });
    service
      .executeStep(step)(scope)
      .pipe(map((result) => result.initiator));
  });
});
