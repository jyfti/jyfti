import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { flatMap, filter } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpEventType } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataFlowExecutionService {
  constructor(private http: HttpClient) {}

  execute(httpRequests: HttpRequest<any>[]): Observable<any> {
    return httpRequests.reduce(
      (observable, httpRequest) =>
        observable.pipe(
          flatMap(() =>
            this.http
              .request(httpRequest)
              .pipe(
                filter((httpEvent) => httpEvent.type === HttpEventType.Response)
              )
          )
        ),
      of({})
    );
  }
}
