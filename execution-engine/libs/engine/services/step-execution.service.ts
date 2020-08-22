import jsone from "json-e";
import { Observable, of } from "rxjs";
import { catchError, flatMap, map } from "rxjs/operators";

import { evaluate } from "./evaluation.service";
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
import { http } from "./http.service";

export class StepExecutionService {
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
      flatMap((request) => http(request)),
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
        toVariableMap(step.for!.do, loopIterationEvaluation)
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
    return {
      url: evaluate(variables, template.url),
      method: evaluate(variables, template.method) as HttpMethod,
      body: evaluate(variables, template.body),
      headers: evaluate(variables, template.headers),
    };
  }
}
