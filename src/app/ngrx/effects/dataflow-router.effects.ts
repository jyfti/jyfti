import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION, RouterNavigationAction } from '@ngrx/router-store';
import { filter, map } from 'rxjs/operators';
import { loadDataflow } from '../dataflow.actions';

@Injectable()
export class DataflowRouterEffects {
  constructor(private actions$: Actions) {}

  route$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      filter((action: RouterNavigationAction) =>
        action.payload.routerState.url.startsWith('/dataflow')
      ),
      map((action) => action.payload.routerState.root.queryParams['id']),
      map((id) => loadDataflow({ id }))
    )
  );
}
