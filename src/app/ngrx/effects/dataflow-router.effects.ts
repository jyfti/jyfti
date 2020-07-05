import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  filter,
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
  loadDataflow,
  loadedDataflow,
  loadStep,
  showDataflow,
} from '../dataflow.actions';
import { GlobalState } from '../dataflow.state';
import { selectCachedDataflowId } from '../selectors/dataflow.selectors';
import { resetExecution } from '../dataflow-execution.actions';

@Injectable()
export class DataflowRouterEffects {
  constructor(
    private actions$: Actions,
    private store: Store<GlobalState>,
    private http: HttpClient
  ) {}

  onNavigationToDataflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      map(
        (action: RouterNavigationAction) =>
          action.payload.routerState.root.firstChild
      ),
      filter((firstChild) => firstChild.routeConfig.path === 'dataflow/:id'),
      map((firstChild) => firstChild.params['id']),
      map((id) => showDataflow({ id }))
    )
  );

  showDataflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(showDataflow),
      flatMap((action) =>
        of(action.id).pipe(
          withLatestFrom(
            this.store.pipe(select(selectCachedDataflowId)),
            (newDataflowId, currentDataflowId) =>
              newDataflowId !== currentDataflowId
          ),
          filter((loadRequired) => loadRequired),
          flatMap(() => of(loadDataflow({ id: action.id }), resetExecution()))
        )
      )
    )
  );

  loadDataflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDataflow),
      switchMap((action) =>
        this.http
          .get(`/assets/dataflows/${action.id}.json`)
          .pipe(map((dataflow: Dataflow) => loadedDataflow({ dataflow })))
      )
    )
  );

  onNavigationToDataflowSelection$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter(
        (action: RouterNavigationAction) =>
          action.payload.routerState.url === '/'
      ),
      map(() =>
        loadDataflowPreviews({ indexUrl: '/assets/dataflows/index.json' })
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

  onNavigationToStep$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      map(
        (action: RouterNavigationAction) =>
          action.payload.routerState.root.firstChild
      ),
      filter(
        (firstChild) =>
          firstChild.routeConfig.path === 'dataflow/:id/step/:index'
      ),
      map((firstChild) => firstChild.params),
      flatMap((params) =>
        of(
          loadDataflow({ id: params['id'] }),
          loadStep({ stepIndex: Number(params['index']) })
        )
      )
    )
  );
}
