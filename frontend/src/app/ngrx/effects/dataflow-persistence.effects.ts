import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  catchError,
  flatMap,
  map,
  switchMap,
  withLatestFrom,
} from 'rxjs/operators';
import { DataflowPreview } from 'src/app/types/dataflow-preview.type';
import { Dataflow } from 'src/app/types/dataflow.type';
import {
  loadDataflowPreviews,
  loadedDataflowPreviews,
} from '../dataflow-preview.actions';
import {
  backendError,
  loadDataflow,
  loadedDataflow,
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

  loadDataflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDataflow),
      switchMap((action) =>
        this.http
          .get(`http://localhost:4201/${action.id}`)
          .pipe(map((dataflow: Dataflow) => loadedDataflow({ dataflow })))
      )
    )
  );

  loadDataflowPreviews$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDataflowPreviews),
      switchMap((action) =>
        this.http
          .get(action.indexUrl)
          .pipe(
            map((dataflowPreviews: DataflowPreview[]) =>
              loadedDataflowPreviews({ dataflowPreviews })
            )
          )
      )
    )
  );

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
