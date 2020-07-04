import { createAction, props } from '@ngrx/store';
import { Dataflow } from '../types/dataflow.type';
import { Step } from '../types/step.type';

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
