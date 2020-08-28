import jsone from "json-e";
import { Observable, of, throwError } from "rxjs";
import { catchError, flatMap, map } from "rxjs/operators";

import { evaluate } from "./evaluation";
import {
  Step,
  Evaluation,
  Evaluations,
  VariableMap,
  HttpRequestTemplate,
  JsonExpression,
  HttpRequest,
  HttpMethod,
} from "../types";
import { toVariableMap } from "./variable-map-creation";
import { http } from "./http";

export function executeStep(
  step: Step,
  localEvaluations: Evaluation | Evaluations,
  variables: VariableMap
): Observable<Evaluation> {
  if (step?.request) {
    return executeRequestStep(step.request, variables);
  } else if (step?.expression) {
    return executeExpressionStep(step.expression, variables);
  } else if (step?.for) {
    return evaluateLoopReturn(localEvaluations, step);
  } else {
    return throwError(
      "Step does not contain any of 'request', 'expression' and 'for'."
    );
  }
}

function executeRequestStep(
  request: HttpRequestTemplate,
  variables: VariableMap
): Observable<Evaluation> {
  return of(createHttpRequest(request, variables)).pipe(
    flatMap((request) => http(request)),
    catchError(() => throwError("The http request execution failed."))
  );
}

function executeExpressionStep(
  expression: JsonExpression,
  variables: VariableMap
): Observable<Evaluation> {
  return of(expression).pipe(
    map((expression) => jsone(expression, variables)),
    catchError((error) => throwError(error.toString()))
  );
}

function evaluateLoopReturn(
  localEvaluations: Evaluation | Evaluations,
  step: Step
): Observable<Evaluation[]> {
  if (localEvaluations && !Array.isArray(localEvaluations)) {
    return throwError(
      "Expected list of loop iteration evaluations, but got a single evaluation"
    );
  }
  const loopReturn: Evaluation[] = (localEvaluations || [])
    .map((loopIterationEvaluation: any) =>
      toVariableMap(step.for!.do, loopIterationEvaluation)
    )
    .map(
      (loopIterationVariables: any) => loopIterationVariables[step.for!.return]
    );
  return of(loopReturn);
}

function createHttpRequest(
  template: HttpRequestTemplate,
  variables: VariableMap
): HttpRequest<any> {
  return {
    url: evaluate(variables, template.url),
    method: evaluate(variables, template.method) as HttpMethod,
    body: evaluate(variables, template.body),
    headers: evaluate(variables, template.headers),
  };
}
