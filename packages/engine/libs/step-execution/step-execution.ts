import { Observable } from "rxjs";
import {
  Step,
  Evaluation,
  Evaluations,
  VariableMap,
  isRequestStep,
  isExpressionStep,
  isShellStep,
} from "../types";
import { executeRequestStep } from "./request-step-execution";
import { executeShellStep } from "./shell-step-execution";
import { executeExpressionStep } from "./expression-step-execution";
import { evaluateLoopReturn } from "./loop-return-step-execution";

export function executeStep(
  step: Step,
  localEvaluations: Evaluation | Evaluations,
  variables: VariableMap,
  outRoot: string
): Observable<Evaluation> {
  if (isRequestStep(step)) {
    return executeRequestStep(step.request, variables, outRoot);
  } else if (isExpressionStep(step)) {
    return executeExpressionStep(step.expression, variables);
  } else if (isShellStep(step)) {
    return executeShellStep(step.shell, variables, outRoot);
  } else {
    return evaluateLoopReturn(localEvaluations, step);
  }
}
