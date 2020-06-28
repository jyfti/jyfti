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
          .request(action.steps[action.stepIndex].httpRequest)
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
