import { selectVariables } from './variable.selectors';
import { HttpRequest } from '@angular/common/http';
import { DataFlowState } from '../dataflow.state';

describe('selectVariables', () => {
  it('should select a variable with value', () => {
    const state: DataFlowState = {
      steps: [
        {
          assignTo: 'my_variable_1',
          httpRequest: new HttpRequest<any>('GET', 'http://url.io'),
        },
        {
          assignTo: 'my_variable_2',
          httpRequest: new HttpRequest<any>('GET', 'http://url.io'),
        },
      ],
      execution: { stepIndex: 1, evaluations: { 0: 'my_value', 1: 'my_other_value' } },
    };
    expect(selectVariables(state)).toEqual({ my_variable_1: 'my_value', my_variable_2: 'my_other_value' });
  });
});
