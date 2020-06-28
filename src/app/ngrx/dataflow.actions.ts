import { createAction, props } from '@ngrx/store';

import { HttpRequestStep } from '../types/step.type';
import { VariableMap } from '../types/variabe-map.type';

export const startExecution = createAction(
  '[Execution] Start',
  props<{ steps: HttpRequestStep[] }>()
);

export const finishExecution = createAction('[Execution] Finish');

export const startStepExecution = createAction(
  '[Execution] Start step',
  props<{ stepIndex: number; steps: HttpRequestStep[]; variables: VariableMap }>()
);

export const finishStepExecution = createAction(
  '[Execution] Finish step',
  props<{
    stepIndex: number;
    evaluation: any;
    steps: HttpRequestStep[];
    variables: VariableMap;
  }>()
);
