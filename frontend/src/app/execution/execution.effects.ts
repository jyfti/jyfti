import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, map } from 'rxjs/operators';
import {
  startExecution,
  finishExecution,
} from '../ngrx/dataflow-execution.actions';
import { ExecutionNewService } from './execution-new.service';

@Injectable()
export class ExecutionEffects {
  constructor(
    private actions$: Actions,
    private executionService: ExecutionNewService
  ) {}

  startExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startExecution),
      switchMap((action) =>
        this.executionService.executeDataflow(action.dataflow)
      ),
      map((evaluations) => finishExecution({ evaluations }))
    )
  );
}
