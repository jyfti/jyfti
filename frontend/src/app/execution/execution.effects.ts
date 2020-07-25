import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, endWith } from 'rxjs/operators';

import {
  finishExecution,
  startExecution,
  stepExecution,
} from '../ngrx/dataflow-execution.actions';
import { ExecutionEngineService } from './execution-engine.service';

@Injectable()
export class ExecutionEffects {
  constructor(
    private actions$: Actions,
    private executionEngineService: ExecutionEngineService
  ) {}

  startExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startExecution),
      switchMap((action) =>
        this.executionEngineService.executeDataflow(action.dataflow).pipe(
          map((pathedEvaluation) => stepExecution({ pathedEvaluation })),
          endWith(finishExecution())
        )
      )
    )
  );
}
