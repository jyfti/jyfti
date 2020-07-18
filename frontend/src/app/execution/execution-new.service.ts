import { Injectable } from '@angular/core';
import { HttpRequest, HttpClient, HttpResponse } from '@angular/common/http';
import { VariableMap } from '../types/variable-map.type';
import { isNil } from 'lodash';
import jsone from 'json-e';
import { HttpRequestTemplate } from '../types/http-request-template.type';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExecutionNewService {
  constructor(private http: HttpClient) {}

  private interpolate(variables: VariableMap, str: string) {
    const identifiers = Object.keys(variables);
    const values = Object.values(variables);
    return new Function(...identifiers, `return \`${str}\`;`)(...values);
  }

  private evaluate(variables: VariableMap, expression: any) {
    return isNil(expression) ? null : jsone(JSON.parse(expression), variables);
  }

  createHttpRequest(template: HttpRequestTemplate, variables: VariableMap) {
    return new HttpRequest(
      template.method as any,
      this.interpolate(variables, template.url),
      this.evaluate(variables, template.body),
      { headers: this.evaluate(variables, template.headers) }
    );
  }

  request(httpRequest: HttpRequest<any>): Observable<HttpResponse<any>> {
    return this.http.request(httpRequest).pipe(
      filter((httpEvent) => httpEvent instanceof HttpResponse),
      map((httpEvent) => httpEvent as HttpResponse<any>)
    );
  }
}
