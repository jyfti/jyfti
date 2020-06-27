import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { HttpClient, HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataFlowExecutionService {
  constructor(private http: HttpClient) {}

  execute(httpRequests: HttpRequest<any>[]): Observable<any> {
    return httpRequests.reduce(
      (observable, httpRequest) =>
        observable.pipe(flatMap(() => this.http.request(httpRequest))),
      of({})
    );
  }
}
