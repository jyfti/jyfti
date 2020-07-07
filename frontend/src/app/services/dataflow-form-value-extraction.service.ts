import { Injectable } from '@angular/core';
import { Dataflow } from '../types/dataflow.type';
import { Step } from '../types/step.type';

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
      // Special case for expression
      expression: value?.expression ? JSON.parse(value?.expression) : undefined,
    };
  }
}
