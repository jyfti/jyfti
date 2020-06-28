import { createAction, props } from '@ngrx/store';
import { Step } from '../types/step.type';

export const startExecution = createAction(
  '[Execution] Start',
  props<{ steps: Step[] }>()
);

export const finishExecution = createAction('[Execution] Finish');
