import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap } from 'rxjs/operators';
import { ExecutionService } from 'src/app/execution/execution.service';
import { startExecution } from '../ngrx/dataflow-execution.actions';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ExecutionEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  startExecution$ = createEffect(() =>
    this.actions$.pipe(
      ofType(startExecution),
      switchMap((action) =>
        new ExecutionService(this.http).executeDataflow(action.dataflow)
      )
    )
  );
}
