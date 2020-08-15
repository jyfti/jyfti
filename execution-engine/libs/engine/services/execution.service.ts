import { isNil, merge } from "lodash/fp";
import { from, Observable, of } from "rxjs";
import {
  concatAll,
  concatMap,
  flatMap,
  map,
  reduce,
  toArray,
} from "rxjs/operators";

import { Workflow } from "../types/workflow.type";
import { ForLoop, Step } from "../types/step.type";
import { VariableMap } from "../types/variable-map.type";
import { SingleStepService } from "./single-step.service";
import { Evaluation } from "../types/evaluations.type";

export class ExecutionService {
  constructor(private singleStepService: SingleStepService) {}

  executeWorkflow(workflow: Workflow): Observable<Evaluation[]> {
    return this.executeBlock(workflow.steps, {});
  }

  executeBlock(
    steps: Step[],
    variables: VariableMap
  ): Observable<Evaluation[]> {
    return from(steps).pipe(
      reduce(
        (evaluations$, step) =>
          evaluations$.pipe(
            flatMap((evaluations) =>
              this.executeStep(
                step,
                merge(
                  this.singleStepService.toVariableMap(steps, evaluations),
                  variables
                )
              ).pipe(map((evaluation) => evaluations.concat([evaluation])))
            )
          ),
        of<Evaluation[]>([])
      ),
      concatAll()
    );
  }

  executeLoop(
    forLoop: ForLoop,
    variables: VariableMap
  ): Observable<Evaluation> {
    return from(variables[forLoop.in]).pipe(
      map((loopVariable) => ({ ...variables, [forLoop.const]: loopVariable })),
      concatMap((loopVariables) =>
        this.executeBlock(forLoop.do, loopVariables).pipe(
          map((evaluations) =>
            this.singleStepService.toVariableMap(forLoop.do, evaluations)
          ),
          map((loopStepsVariables) => merge(loopVariables, loopStepsVariables)),
          map((allVariables) => allVariables[forLoop.return])
        )
      ),
      toArray()
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
    } else if (!isNil(step?.for)) {
      return this.executeLoop(step.for, variables);
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      });
    }
  }
}
