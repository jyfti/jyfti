import { Injectable } from '@angular/core';
import { Dataflow } from '../types/dataflow.type';
import { Step, ForLoop } from '../types/step.type';
import { isNil, isArray } from 'lodash/fp';

@Injectable({
  providedIn: 'root',
})
export class DataflowFormValueExtractionService {
  extractDataFlow(value: any): Dataflow {
    return {
      name: value?.name,
      steps: this.extractSteps(value?.steps),
    };
  }

  extractSteps(values: any[]): Step[] {
    return values.map((value) => this.extractStep(value));
  }

  extractStep(value: any): Step {
    return {
      assignTo: value?.assignTo,
      ...value,
      expression: !isNil(value?.expression)
        ? JSON.parse(value.expression)
        : undefined,
      for: !isNil(value?.for) ? this.extractForLoop(value.for) : undefined,
    };
  }

  extractForLoop(_for: any): ForLoop {
    return {
      const: _for?.const,
      in: JSON.parse(_for?.in),
      do: isArray(_for?.do)
        ? _for.do.map((step) => this.extractStep(step))
        : undefined,
      return: JSON.parse(_for?.return),
    };
  }
}
