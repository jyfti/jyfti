import { HttpRequest } from '@angular/common/http';

export class GlobalState {
  dataflow: DataFlowState;
}

export class DataFlowState {
  httpRequests: HttpRequest<any>[];
}

export const initialState = {
  httpRequests: null,
};
