import { createAction, props } from '@ngrx/store';
import { Dataflow } from '../types/dataflow.type';
import { ExecutionScope } from '../types/execution-scope.type';
import { Evaluation } from '../execution/execution-new.service';

export const startExecution = createAction(
  '[Execution] Start',
  props<{ dataflow: Dataflow }>()
);

export const finishExecution = createAction(
  '[Execution] Finish',
  props<{ evaluations: Evaluation[] }>()
);

export const resetExecution = createAction('[Execution] Reset');

export const stepExecution = createAction(
  '[Execution] Step',
  props<{ scope: ExecutionScope }>()
);
