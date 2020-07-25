import { createAction, props } from '@ngrx/store';

import { PathedEvaluation } from '../execution/execution-engine.service';
import { Dataflow } from '../types/dataflow.type';

export const startExecution = createAction(
  '[Execution] Start',
  props<{ dataflow: Dataflow }>()
);

export const finishExecution = createAction('[Execution] Finish');

export const resetExecution = createAction('[Execution] Reset');

export const stepExecution = createAction(
  '[Execution] Step',
  props<{ pathedEvaluation: PathedEvaluation }>()
);
