import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { cold } from 'jest-marbles';

import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { ExecutionNewService } from './execution-new.service';

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

  describe('expression step', () => {
    it('should evaluate successfully', () => {
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

    it('should evaluate to an error if the expression is invalid', () => {
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

    it('should evaluate evaluate to an error if a variable does not exist', () => {
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
