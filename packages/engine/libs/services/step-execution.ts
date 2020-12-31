import { Observable, of, throwError } from "rxjs";
import { map } from "rxjs/operators";
import { evaluate } from "./evaluation";
import {
  Step,
  Evaluation,
  Evaluations,
  VariableMap,
  JsonExpression,
  isRequestStep,
  isExpressionStep,
  ForStep,
} from "../types";
import { toVariableMap } from "./variable-map-creation";
import { executeRequestStep } from "./request-step-execution";

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

function isEvaluations(
  object: Evaluation | Evaluation[]
): object is Evaluation[] {
  return Array.isArray(object);
}

function isNestedEvaluations(object: Evaluation[]): object is Evaluation[][] {
  return object.every((evaluation) => isEvaluations(evaluation));
}
