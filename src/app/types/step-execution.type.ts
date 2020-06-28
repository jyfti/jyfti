import { HttpResponse } from '@angular/common/http';

export interface StepExecution {
  stepIndex: number;
  httpResponse: HttpResponse<any>;
}
