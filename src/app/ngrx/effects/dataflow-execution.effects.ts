import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map, catchError } from 'rxjs/operators';
import { DataFlowExecutionService } from 'src/app/services/data-flow-execution.service';
import { HttpRequestTemplate } from 'src/app/types/http-request-template.type';
import { VariableMap } from 'src/app/types/variabe-map.type';

import { finishExecution, finishStepExecution, startExecution, startStepExecution } from '../dataflow.actions';
import { of } from 'rxjs';

const interpolate = (variables) => (str: string) => {
  const identifiers = Object.keys(variables);
  const values = Object.values(variables);
  return new Function(...identifiers, `return \`${str}\`;`)(...values);
};

const createHttpRequest = (
  template: HttpRequestTemplate,
  variables: VariableMap
) =>
  new HttpRequest(template.method as any, interpolate(variables)(template.url));

@Injectable()
export class DataFlowExecutionEffects {
  constructor(
    private actions$: Actions,
    private dataflowExecutionService: DataFlowExecutionService
  ) {}

  startExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startExecution),
      map((action) =>
        startStepExecution({ steps: action.steps, stepIndex: 0, variables: {} })
      )
    )
  );

  stepExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startStepExecution),
      concatMap((action) =>
        this.dataflowExecutionService
          .request(
            createHttpRequest(
              action.steps[action.stepIndex].httpRequestTemplate,
              action.variables
            )
          )
          .pipe(
            catchError(response => of(response)),
            map((httpResponse) =>
              finishStepExecution({
                stepIndex: action.stepIndex,
                evaluation: httpResponse,
                steps: action.steps,
                variables: {
                  ...action.variables,
                  [action.steps[action.stepIndex].assignTo]: httpResponse,
                },
              })
            )
          )
      )
    )
  );

  nextStepAfterFinishedPreviousStep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(finishStepExecution),
      map((action) =>
        action.stepIndex + 1 === action.steps.length
          ? finishExecution()
          : startStepExecution({
              steps: action.steps,
              stepIndex: action.stepIndex + 1,
              variables: action.variables,
            })
      )
    )
  );
}
