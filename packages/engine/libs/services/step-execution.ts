import { from, Observable, of, throwError } from "rxjs";
import { mergeMap, map, mapTo } from "rxjs/operators";

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
  ForStep,
  Headers,
} from "../types";
import { toVariableMap } from "./variable-map-creation";
import { http } from "./http";
import * as fs from "fs";

export function executeStep(
  step: Step,
  localEvaluations: Evaluation | Evaluations,
  variables: VariableMap
): Observable<Evaluation> {
  if (isRequestStep(step)) {
    return executeRequestStep(step.request, variables);
  } else if (isExpressionStep(step)) {
    return executeExpressionStep(step.expression, variables);
  } else {
    return evaluateLoopReturn(localEvaluations, step);
  }
}

function executeRequestStep(
  request: HttpRequestTemplate,
  variables: VariableMap
): Observable<Evaluation> {
  return of({}).pipe(
    map(() => createHttpRequest(request, variables)),
    mergeMap((request) =>
      http(request).pipe(
        mergeMap((response) =>
          response.body.pipe(
            mergeMap((body) =>
              request.writeTo
                ? from(
                    fs.promises.writeFile(request.writeTo, body, "utf8")
                  ).pipe(mapTo("Written to " + request.writeTo))
                : of(parseJsonOrString(body))
            ),
            map((body) => ({ ...response, body }))
          )
        )
      )
    )
  );
}

function parseJsonOrString(buffer: Buffer): unknown {
  // TODO Look at response header for content type
  const str = buffer.toString("utf8");
  try {
    return JSON.parse(str);
  } catch {
    return str;
  }
}

function executeExpressionStep(
  expression: JsonExpression,
  variables: VariableMap
): Observable<Evaluation> {
  return of(expression).pipe(
    map((expression) => evaluate(variables, expression))
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
      new Error(
        "Expected an evaluation for each loop iteration, but got a single evaluation"
      )
    );
  }
  if (!isNestedEvaluations(localEvaluations)) {
    return throwError(
      new Error(
        "Expected each loop iteration to have a list of evaluations, but got a single evaluation for a loop iteration"
      )
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
  const writeTo = evaluate(variables, template.writeTo);
  if (!isWriteTo(writeTo)) {
    throw new Error("The field 'writeTo' needs to evaluate to a string.");
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
    writeTo,
  };
}

function isWriteTo(object: unknown): object is string | undefined {
  return !object || isString(object);
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
