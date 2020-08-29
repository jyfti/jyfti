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
  isRequestStep,
  isExpressionStep,
  isForStep,
  ForStep,
  Headers,
} from "../types";
import { toVariableMap } from "./variable-map-creation";
import { http } from "./http";

export function executeStep(
  step: Step,
  localEvaluations: Evaluation | Evaluations,
  variables: VariableMap
): Observable<Evaluation> {
  if (isRequestStep(step)) {
    return executeRequestStep(step.request, variables);
  } else if (isExpressionStep(step)) {
    return executeExpressionStep(step.expression, variables);
  } else if (isForStep(step)) {
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
    map((expression) => evaluate(variables, expression)),
    catchError((error) => throwError(error.toString()))
  );
}

function evaluateLoopReturn(
  localEvaluations: Evaluation | Evaluations,
  step: ForStep
): Observable<Evaluation[]> {
  if (!localEvaluations) {
    return of([]);
  }
  if (!isEvaluations(localEvaluations)) {
    return throwError(
      "Expected an evaluation for each loop iteration, but got a single evaluation"
    );
  }
  if (!isNestedEvaluations(localEvaluations)) {
    return throwError(
      "Expected each loop iteration to have a list of evaluations, but got a single evaluation for a loop iteration"
    );
  }
  const loopReturn: Evaluation[] = (localEvaluations || [])
    .map((loopIterationEvaluation) =>
      toVariableMap(step.for.do, loopIterationEvaluation)
    )
    .map((loopIterationVariables) => loopIterationVariables[step.for.return]);
  return of(loopReturn);
}

function createHttpRequest(
  template: HttpRequestTemplate,
  variables: VariableMap
): HttpRequest<unknown> {
  const url = evaluate(variables, template.url);
  if (!isString(url)) {
    throw new Error("The url needs to evaluate to a string.");
  }
  const headers = evaluate(variables, template.headers);
  if (!isHeaders(headers)) {
    throw new Error(
      "The headers need to evaluate to an object mapping header names to strings."
    );
  }
  return {
    url,
    method: evaluate(variables, template.method) as HttpMethod,
    body: evaluate(variables, template.body),
    headers,
  };
}

function isEvaluations(
  object: Evaluation | Evaluation[]
): object is Evaluation[] {
  return Array.isArray(object);
}

function isNestedEvaluations(object: Evaluation[]): object is Evaluation[][] {
  return object.every((evaluation) => isEvaluations(evaluation));
}

function isString(object: unknown): object is string {
  return typeof object === "string";
}

function isHeaders(object: unknown): object is Headers {
  // TODO Improve check
  return typeof object === "object";
}
