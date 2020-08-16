import jsone from "json-e";
import {
  filter as _filter,
  flow,
  isArray,
  isNil,
  reduce as _reduce,
  zip,
} from "lodash/fp";
import { Observable, of } from "rxjs";
import { catchError, flatMap, map } from "rxjs/operators";
import * as url from "url";

import { HttpService } from "./http.service";
import { interpolate, evaluate } from "./evaluation.service";
import {
  Step,
  Evaluation,
  Evaluations,
  VariableMap,
  HttpRequestTemplate,
  JsonExpression,
  HttpRequest,
  HttpProtocol,
  HttpMethod,
} from "../types";

export class StepExecutionService {
  constructor(private http: HttpService) {}

  executeStep(
    step: Step,
    localEvaluations: Evaluation | Evaluations,
    variables: VariableMap
  ): Observable<Evaluation> {
    if (!isNil(step?.request)) {
      return this.executeRequestStep(step.request, variables);
    } else if (!isNil(step?.expression)) {
      return this.executeExpressionStep(step.expression, variables);
    } else if (!isNil(step?.for)) {
      return this.evaluateLoopReturn(localEvaluations, step);
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      });
    }
  }

  executeRequestStep(
    request: HttpRequestTemplate,
    variables: VariableMap
  ): Observable<Evaluation> {
    return of(this.createHttpRequest(request, variables)).pipe(
      flatMap((request) => this.http.request(request)),
      catchError((response) => of(response))
    );
  }

  executeExpressionStep(
    expression: JsonExpression,
    variables: VariableMap
  ): Observable<Evaluation> {
    return of(expression).pipe(
      map((expression) => jsone(expression, variables)),
      catchError((error) => of({ error: error.toString() }))
    );
  }

  private evaluateLoopReturn(
    localEvaluations: Evaluation | Evaluations,
    step: Step
  ): Observable<Evaluation[]> {
    if (!isNil(localEvaluations) && !isArray(localEvaluations)) {
      throw new Error(
        "Expected list of loop iteration evaluations, but got a single evaluation"
      );
    }
    const loopReturn: Evaluation[] = (localEvaluations || [])
      .map((loopIterationEvaluation) =>
        this.toVariableMap(step.for!.do, loopIterationEvaluation)
      )
      .map(
        (loopIterationVariables) => loopIterationVariables[step.for!.return]
      );
    return of(loopReturn);
  }

  createHttpRequest(
    template: HttpRequestTemplate,
    variables: VariableMap
  ): HttpRequest<any> {
    const requestUrl = interpolate(variables, template.url);
    const parsedRequestUrl = url.parse(requestUrl, true);
    return {
      protocol: (parsedRequestUrl.protocol || "https:") as HttpProtocol,
      method: template.method as HttpMethod,
      hostname: parsedRequestUrl.hostname || "",
      path: parsedRequestUrl.path || "",
      body: evaluate(variables, template.body),
      // headers: this.evaluate(variables, template.headers),
    };
  }

  toVariableMap(steps: Step[], evaluations: Evaluation[]): VariableMap {
    return flow(
      _filter(([step, evaluation]) => !isNil(step) && !isNil(evaluation)),
      _reduce(
        (variables: VariableMap, [step, evaluation]) => ({
          ...variables,
          [step.assignTo]: evaluation,
        }),
        {}
      )
    )(zip(steps, evaluations));
  }
}
