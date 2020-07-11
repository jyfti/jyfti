import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import { ExecutionService } from 'src/app/execution/execution.service';
import { startExecution } from '../ngrx/dataflow-execution.actions';

@Injectable()
export class ExecutionEffects {
  constructor(
    private actions$: Actions,
    private executionService: ExecutionService
  ) {}

  startExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startExecution),
      switchMap((action) =>
        this.executionService.executeDataflow(action.dataflow)
      )
    )
  );
}
