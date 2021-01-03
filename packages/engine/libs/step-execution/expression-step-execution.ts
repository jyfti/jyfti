import { of, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Evaluation } from "../types/evaluations.type";
import { JsonExpression } from "../types/step.type";
import { VariableMap } from "../types/variable-map.type";
import { evaluate } from "../services/evaluation";

export function executeExpressionStep(
  expression: JsonExpression,
  variables: VariableMap
): Observable<Evaluation> {
  return of(expression).pipe(
    map((expression) => evaluate(variables, expression))
  );
}
