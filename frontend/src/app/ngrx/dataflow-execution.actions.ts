import { createAction, props } from '@ngrx/store';
import { Dataflow } from '../types/dataflow.type';
import { ExecutionScope } from '../types/execution-scope.type';

export const startExecution = createAction(
  '[Execution] Start',
  props<{ dataflow: Dataflow }>()
);

export const finishExecution = createAction('[Execution] Finish');

export const resetExecution = createAction('[Execution] Reset');

export const startStepExecution = createAction(
  '[Execution] Start step',
  props<{ scope: ExecutionScope }>()
);

export const finishStepExecution = createAction(
  '[Execution] Finish step',
  props<{ scope: ExecutionScope }>()
);
