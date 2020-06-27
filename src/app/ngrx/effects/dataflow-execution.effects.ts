import { DataFlowExecutionService } from 'src/app/services/data-flow-execution.service';
import { startExecution, finishExecution } from '../dataflow.actions';

import { createEffect, Actions, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable()
export class DataFlowExecutionEffects {
  constructor(
    private actions$: Actions,
    private dataflowExecutionService: DataFlowExecutionService
  ) {}

  startExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startExecution),
      exhaustMap((action) =>
        this.dataflowExecutionService
          .execute(action.httpRequests)
          .pipe(map(() => finishExecution()))
      )
    )
  );
}
