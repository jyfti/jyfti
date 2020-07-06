import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { VariableMap } from '../types/variabe-map.type';
import jsone from 'json-e';
import { Step } from '../types/step.type';

@Injectable({
  providedIn: 'root',
})
export class ExecutionService {
  constructor(private http: HttpClient) {}

  executeStep(
    step: Step,
    variables: VariableMap
  ): Observable<HttpResponse<any>> {
    return this.request(this.createHttpRequest(step.request, variables));
  }

  private interpolate(variables, str: string) {
    const identifiers = Object.keys(variables);
    const values = Object.values(variables);
    return new Function(...identifiers, `return \`${str}\`;`)(...values);
  }

  createHttpRequest(template: HttpRequestTemplate, variables: VariableMap) {
    return new HttpRequest(
      template.method as any,
      this.interpolate(variables, template.url),
      jsone(JSON.parse(template.body), variables),
      { headers: jsone(JSON.parse(template.headers), variables) }
    );
  }

  request(httpRequest: HttpRequest<any>): Observable<HttpResponse<any>> {
    return this.http.request(httpRequest).pipe(
      filter((httpEvent) => httpEvent instanceof HttpResponse),
      map((httpEvent) => httpEvent as HttpResponse<any>)
    );
  }
}
