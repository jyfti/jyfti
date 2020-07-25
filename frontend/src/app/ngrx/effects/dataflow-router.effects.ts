import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { select, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { filter, flatMap, map, withLatestFrom } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { resetExecution } from '../dataflow-execution.actions';
import { loadDataflowPreviews } from '../dataflow-preview.actions';
import { loadDataflow, loadStep, showDataflow } from '../dataflow.actions';
import { GlobalState } from '../dataflow.state';
import { selectActiveDataflowId } from '../selectors/dataflow.selectors';

@Injectable()
export class DataflowRouterEffects {
  constructor(private actions$: Actions, private store: Store<GlobalState>) {}

  onNavigationToDataflow$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      map(
        (action: RouterNavigationAction) =>
          action.payload.routerState.root.firstChild
      ),
      filter((firstChild) =>
        firstChild.routeConfig.path.startsWith('dataflow/:id')
      ),
      map((firstChild) => firstChild.params['id']),
      flatMap((id) =>
        of(id).pipe(
          withLatestFrom(
            this.store.pipe(select(selectActiveDataflowId)),
            (newDataflowId, currentDataflowId) =>
              newDataflowId !== currentDataflowId
          ),
          flatMap((loadRequired) =>
            loadRequired
              ? of(loadDataflow({ id }), resetExecution())
              : of(showDataflow({ id }))
          )
        )
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
      map(() => loadDataflowPreviews({ indexUrl: environment.backendBaseUrl }))
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
          showDataflow({ id: params['id'] }),
          loadStep({ stepIndex: Number(params['index']) })
        )
      )
    )
  );
}
