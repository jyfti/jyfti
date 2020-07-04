import { createAction, props } from '@ngrx/store';
import { DataflowPreview } from '../types/dataflow-preview.type';

export const loadDataflowPreviews = createAction(
  '[Data Flow Previews] Load',
  props<{ indexUrl: string }>()
);

export const loadedDataflowPreviews = createAction(
  '[Data Flow Previews] Loaded',
  props<{ dataflowPreviews: DataflowPreview[] }>()
);
