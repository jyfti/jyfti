import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';

import { Step } from '../types/step.type';
import { StepExecution } from '../types/step-execution.type';

@Injectable({
  providedIn: 'root',
})
export class DataFlowExecutionService {
  constructor(private http: HttpClient) {}

  execute(steps: Step[]): Observable<StepExecution> {
    return from(steps).pipe(
      concatMap((step, stepIndex) =>
        this.request(step.httpRequest).pipe(
          map((httpResponse) => ({ stepIndex, httpResponse }))
        )
      )
    );
  }

  private request(
    httpRequest: HttpRequest<any>
  ): Observable<HttpResponse<any>> {
    return this.http.request(httpRequest).pipe(
      filter((httpEvent) => httpEvent instanceof HttpResponse),
      map((httpEvent) => httpEvent as HttpResponse<any>)
    );
  }
}
