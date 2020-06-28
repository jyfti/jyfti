import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Step } from '../types/step.type';

@Injectable({
  providedIn: 'root',
})
export class DataFlowExecutionService {
  constructor(private http: HttpClient) {}

  execute(steps: Step[]): Observable<HttpEvent<any>> {
    return from(steps).pipe(
      concatMap((step) => this.http.request(step.httpRequest))
    );
  }
}
