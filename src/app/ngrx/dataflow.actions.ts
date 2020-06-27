import { createAction, props } from '@ngrx/store';
import { HttpRequest } from '@angular/common/http';

export const startExecution = createAction(
  '[Execution] Start',
  props<{ httpRequests: HttpRequest<any>[] }>()
);

export const finishExecution = createAction('[Execution] Finish');
