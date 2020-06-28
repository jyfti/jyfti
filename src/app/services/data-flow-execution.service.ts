import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DataFlowExecutionService {
  constructor(private http: HttpClient) {}

  execute(httpRequests: HttpRequest<any>[]): Observable<HttpEvent<any>> {
    return from(httpRequests).pipe(
      concatMap((httpRequest) => this.http.request(httpRequest))
    );
  }
}
