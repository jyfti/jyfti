import { createAction, props } from '@ngrx/store';

import { Step } from '../types/step.type';
import { StepExecution } from '../types/step-execution.type';

export const startExecution = createAction(
  '[Execution] Start',
  props<{ steps: Step[] }>()
);

export const finishExecution = createAction('[Execution] Finish');

export const startStepExecution = createAction(
  '[Execution] Start step',
  props<{ stepIndex: number; steps: Step[] }>()
);

export const finishStepExecution = createAction(
  '[Execution] Finish step',
  props<{ stepExecution: StepExecution }>()
);
