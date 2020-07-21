import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Evaluation } from './execution.service';
import { Dataflow } from '../types/dataflow.type';
import { SingleStepService } from './single-step.service';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { isNil } from 'lodash';

export interface ExecutionScope {
  stepIndex: number;
  evaluations: Evaluation[];
}

@Injectable({
  providedIn: 'root',
})
export class ExecutionEngineService {
  constructor(private singleStepService: SingleStepService) {}

  executeNext(
    dataflow: Dataflow,
    scope: ExecutionScope
  ): Observable<Evaluation> {
    return this.executeStep(
      dataflow.steps[scope.stepIndex],
      this.singleStepService.toVariableMap(dataflow.steps, scope.evaluations)
    );
  }

  executeStep(step: Step, variables: VariableMap): Observable<Evaluation> {
    if (!isNil(step?.request)) {
      return this.singleStepService.executeRequestStep(step.request, variables);
    } else if (!isNil(step?.expression)) {
      return this.singleStepService.executeExpressionStep(
        step.expression,
        variables
      );
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      });
    }
  }
}
