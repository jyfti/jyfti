import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, map } from 'rxjs/operators';
import { DataFlowExecutionService } from 'src/app/services/data-flow-execution.service';

import { finishExecution, startExecution } from '../dataflow.actions';

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
          .execute(action.steps)
          .pipe(map(() => finishExecution()))
      )
    )
  );
}
