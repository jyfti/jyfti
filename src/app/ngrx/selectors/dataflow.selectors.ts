import { GlobalState } from '../dataflow.state';
import { Step } from 'src/app/types/step.type';
import { createSelector } from '@ngrx/store';
import { selectRouteParam } from './router.selectors';

export const selectSteps = (state: GlobalState): Step[] =>
  state.dataflow.dataflow.steps;

export const selectStepIndex = createSelector(
  selectRouteParam('index'),
  (index) => Number(index)
);

export const selectStep = createSelector(
  selectSteps,
  selectStepIndex,
  (steps, stepIndex) => steps[stepIndex]
);
