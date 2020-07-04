import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { filter, map, switchMap, flatMap } from 'rxjs/operators';
import { loadDataflow, saveDataflow, loadStep } from '../dataflow.actions';
import { HttpClient } from '@angular/common/http';
import { Dataflow } from 'src/app/types/dataflow.type';
import {
  loadDataflowPreviews,
  loadedDataflowPreviews,
} from '../dataflow-preview.actions';
import { DataflowPreview } from 'src/app/types/dataflow-preview.type';
import { of } from 'rxjs';

@Injectable()
export class DataflowRouterEffects {
  constructor(private actions$: Actions, private http: HttpClient) {}

  onNavigationToDataflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      map(
        (action: RouterNavigationAction) =>
          action.payload.routerState.root.firstChild
      ),
      filter((firstChild) => firstChild.routeConfig.path === 'dataflow/:id'),
      map((firstChild) => firstChild.params['id']),
      map((id) => loadDataflow({ id }))
    )
  );

  loadDataflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDataflow),
      switchMap((action) =>
        this.http
          .get(`/assets/dataflows/${action.id}.json`)
          .pipe(map((dataflow: Dataflow) => saveDataflow({ dataflow })))
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
