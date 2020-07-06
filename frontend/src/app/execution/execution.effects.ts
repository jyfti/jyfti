import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { ExecutionService } from 'src/app/execution/execution.service';
import {
  startExecution,
  startStepExecution,
  finishStepExecution,
  finishExecution,
} from '../ngrx/dataflow-execution.actions';

@Injectable()
export class ExecutionEffects {
  constructor(
    private actions$: Actions,
    private executionService: ExecutionService
  ) {}

  startExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startExecution),
      map((action) =>
        startStepExecution({
          steps: action.dataflow.steps,
          stepIndex: 0,
          variables: {},
        })
      )
    )
  );

  stepExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startStepExecution),
      concatMap((action) =>
        this.executionService
          .executeStep(action.steps[action.stepIndex], action.variables)
          .pipe(
            catchError((response) => of(response)),
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
