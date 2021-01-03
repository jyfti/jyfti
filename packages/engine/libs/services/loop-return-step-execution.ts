import { Observable, of, throwError } from "rxjs";
import { Evaluation, Evaluations } from "../types/evaluations.type";
import { ForStep } from "../types/step.type";
import { toVariableMap } from "./variable-map-creation";

export function evaluateLoopReturn(
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
