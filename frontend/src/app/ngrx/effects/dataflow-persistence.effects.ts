import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, flatMap, map, withLatestFrom } from 'rxjs/operators';
import {
  backendError,
  persistDataflow,
  persistedDataflow,
} from '../dataflow.actions';
import { GlobalState } from '../dataflow.state';
import { selectActiveDataflowId } from '../selectors/dataflow.selectors';

@Injectable()
export class DataflowPersistenceEffects {
  constructor(
    private actions$: Actions,
    private store: Store<GlobalState>,
    private http: HttpClient
  ) {}

  persistDataflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(persistDataflow),
      flatMap((action) =>
        of(action.dataflow).pipe(
          withLatestFrom(
            this.store.pipe(select(selectActiveDataflowId)),
            (dataflow, id) => ({ dataflow, id })
          ),
          flatMap(({ dataflow, id }) =>
            this.http.put(`http://localhost:4201/${id}`, dataflow)
          ),
          map(() => persistedDataflow()),
          catchError((err) => of(backendError({ err })))
        )
      )
    )
  );
}
