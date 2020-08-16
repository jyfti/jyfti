import jsone from "json-e";
import { Observable, of } from "rxjs";
import { catchError, flatMap, map } from "rxjs/operators";
import * as url from "url";

import { HttpService } from "./http.service";
import { evaluate } from "./evaluation.service";
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
    if (step?.request) {
      return this.executeRequestStep(step.request, variables);
    } else if (step?.expression) {
      return this.executeExpressionStep(step.expression, variables);
    } else if (step?.for) {
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
    if (localEvaluations && !Array.isArray(localEvaluations)) {
      throw new Error(
        "Expected list of loop iteration evaluations, but got a single evaluation"
      );
    }
    const loopReturn: Evaluation[] = (localEvaluations || [])
      .map((loopIterationEvaluation: any) =>
        this.toVariableMap(step.for!.do, loopIterationEvaluation)
      )
      .map(
        (loopIterationVariables: any) =>
          loopIterationVariables[step.for!.return]
      );
    return of(loopReturn);
  }

  createHttpRequest(
    template: HttpRequestTemplate,
    variables: VariableMap
  ): HttpRequest<any> {
    const requestUrl = evaluate(variables, template.url);
    const parsedRequestUrl = url.parse(requestUrl, true);
    return {
      protocol: (parsedRequestUrl.protocol || "https:") as HttpProtocol,
      method: evaluate(variables, template.method) as HttpMethod,
      hostname: parsedRequestUrl.hostname || "",
      path: parsedRequestUrl.path || "",
      body: evaluate(variables, template.body),
      // headers: this.evaluate(variables, template.headers),
    };
  }

  toVariableMap(steps: Step[], evaluations: Evaluation[]): VariableMap {
    return steps
      .map((step, index) => ({ step, evaluation: evaluations[index] }))
      .filter(({ evaluation }) => evaluation)
      .reduce(
        (variables: VariableMap, { step, evaluation }) => ({
          ...variables,
          [step.assignTo]: evaluation,
        }),
        {}
      );
  }
}
