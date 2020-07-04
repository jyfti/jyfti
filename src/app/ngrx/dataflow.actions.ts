import { createAction, props } from '@ngrx/store';

import { Step } from '../types/step.type';
import { VariableMap } from '../types/variabe-map.type';
import { Dataflow } from '../types/dataflow.type';

export const startExecution = createAction(
  '[Execution] Start',
  props<{ dataflow: Dataflow }>()
);

export const finishExecution = createAction('[Execution] Finish');

export const resetExecution = createAction('[Execution] Reset');

export const startStepExecution = createAction(
  '[Execution] Start step',
  props<{ stepIndex: number; steps: Step[]; variables: VariableMap }>()
);

export const finishStepExecution = createAction(
  '[Execution] Finish step',
  props<{
    stepIndex: number;
    evaluation: any;
    steps: Step[];
    variables: VariableMap;
  }>()
);

export const loadedDataflow = createAction(
  '[Data Flow] Loaded',
  props<{ dataflow: Dataflow }>()
);

export const showDataflow = createAction(
  '[Data Flow] Show',
  props<{ id: string }>()
);

export const loadDataflow = createAction(
  '[Data Flow] Load',
  props<{ id: string }>()
);

export const saveStep = createAction(
  '[Data Flow] Save step',
  props<{ step: Step }>()
);

export const loadStep = createAction(
  '[Data Flow] Load step',
  props<{ stepIndex: number }>()
);
