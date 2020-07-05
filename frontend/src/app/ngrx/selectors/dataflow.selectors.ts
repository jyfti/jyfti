import { GlobalState } from '../dataflow.state';
import { Step } from 'src/app/types/step.type';
import { createSelector } from '@ngrx/store';

export const selectSteps = (state: GlobalState): Step[] =>
  state.dataflow.dataflow.steps;

export const selectActiveDataflowId = (state: GlobalState): string =>
  state.dataflow.dataflowId;

export const selectStepIndex = (state: GlobalState): number =>
  state.dataflow.stepIndex;

export const selectStep = createSelector(
  selectSteps,
  selectStepIndex,
  (steps, stepIndex) => steps[stepIndex]
);
