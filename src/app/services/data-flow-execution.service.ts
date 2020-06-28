import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { concatMap, map, filter } from 'rxjs/operators';

import { Step } from '../types/step.type';

@Injectable({
  providedIn: 'root',
})
export class DataFlowExecutionService {
  constructor(private http: HttpClient) {}

  execute(steps: Step[]): Observable<HttpResponse<any>> {
    return from(steps).pipe(concatMap((step) => this.request(step)));
  }

  private request(step: Step): Observable<HttpResponse<any>> {
    return this.http.request(step.httpRequest).pipe(
      filter((httpEvent) => httpEvent instanceof HttpResponse),
      map((httpEvent) => httpEvent as HttpResponse<any>)
    );
  }
}
