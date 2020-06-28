import { HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { concatMap, map } from 'rxjs/operators';
import { DataFlowExecutionService } from 'src/app/services/data-flow-execution.service';

import {
  finishExecution,
  finishStepExecution,
  startExecution,
  startStepExecution,
} from '../dataflow.actions';
import { HttpRequestTemplate } from 'src/app/types/http-request-template.type';

const interpolate = (variables) => (str: string) => {
  const identifiers = Object.keys(variables);
  const values = Object.values(variables);
  return new Function(...identifiers, `return \`${str}\`;`)(...values);
};

const createHttpRequest = (template: HttpRequestTemplate) =>
  new HttpRequest(template.method as any, interpolate({})(template.url));

@Injectable()
export class DataFlowExecutionEffects {
  constructor(
    private actions$: Actions,
    private dataflowExecutionService: DataFlowExecutionService
  ) {}

  startExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startExecution),
      map((action) => startStepExecution({ steps: action.steps, stepIndex: 0 }))
    )
  );

  stepExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startStepExecution),
      concatMap((action) =>
        this.dataflowExecutionService
          .request(
            createHttpRequest(
              action.steps[action.stepIndex].httpRequestTemplate
            )
          )
          .pipe(
            concatMap((httpResponse) =>
              of(
                finishStepExecution({
                  stepExecution: {
                    stepIndex: action.stepIndex,
                    httpResponse,
                  },
                }),
                action.stepIndex + 1 === action.steps.length
                  ? finishExecution()
                  : startStepExecution({
                      steps: action.steps,
                      stepIndex: action.stepIndex + 1,
                    })
              )
            )
          )
      )
    )
  );
}
