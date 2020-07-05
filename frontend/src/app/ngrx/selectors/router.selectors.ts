import { RouterReducerState, getSelectors } from '@ngrx/router-store';
import { createFeatureSelector } from '@ngrx/store';
import { GlobalState } from '../dataflow.state';

export const selectRouter = createFeatureSelector<
  GlobalState,
  RouterReducerState<any>
>('router');

export const {
  selectCurrentRoute,
  selectQueryParams,
  selectQueryParam,
  selectRouteParams,
  selectRouteParam,
  selectRouteData,
  selectUrl,
} = getSelectors(selectRouter);
