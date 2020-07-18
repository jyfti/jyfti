import { TestBed } from '@angular/core/testing';

import { ExecutionNewService } from './execution-new.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { cold } from 'jest-marbles';
import { of } from 'rxjs';

describe('ExecutionNewService', () => {
  let service: ExecutionNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ExecutionNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should evaluate an expression step', () => {
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
});
