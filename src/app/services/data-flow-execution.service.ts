import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ApiCall } from '../types/api-call.type';

@Injectable({
  providedIn: 'root',
})
export class DataFlowExecutionService {
  constructor(private http: HttpClient) {}

  execute(apiCalls: ApiCall[]): Observable<any> {
    return apiCalls.reduce(
      (observable, apiCall) =>
        observable.pipe(flatMap(() => this.http.get(apiCall.url))),
      of({})
    );
  }
}
