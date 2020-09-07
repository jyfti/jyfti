import { Observable, of } from "rxjs";

import {
  State,
  Workflow,
  Evaluation,
  Inputs,
  Environment,
  StepResult,
} from "../types";
import { evaluate } from "./evaluation";
import { createVariableMapFromState } from "./variable-map-creation";
import { executeStep } from "./step-execution";
import { advancePath } from "./path-advancement";
import { resolveStep } from "./step-resolvement";
import { addEvaluation, resolveEvaluation } from "./evaluation-resolvement";
import { map, catchError } from "rxjs/operators";

export function nextState(
  workflow: Workflow,
  state: State,
  evaluation: Evaluation,
  environment: Environment
): State {
  const nextEvaluations = addEvaluation(
    state.path,
    state.evaluations,
    evaluation
  );
  const nextPath = advancePath(
    workflow,
    state.path,
    createVariableMapFromState(
      workflow,
      {
        path: state.path,
        inputs: state.inputs,
        evaluations: nextEvaluations,
      },
      environment
    )
  );
  return {
    path: nextPath,
    inputs: state.inputs,
    evaluations: nextEvaluations,
  };
}

export function step(
  workflow: Workflow,
  state: State,
  environment: Environment
): Observable<StepResult> {
  return executeStep(
    resolveStep(workflow, state.path),
    resolveEvaluation(state.evaluations, state.path),
    createVariableMapFromState(workflow, state, environment)
  ).pipe(
    map((evaluation) => ({ path: state.path, evaluation })),
    catchError((error) => of({ path: state.path, error }))
  );
}

export function toOutput(
  workflow: Workflow,
  state: State,
  environment: Environment
): unknown | undefined {
  return workflow.output
    ? evaluate(
        createVariableMapFromState(workflow, state, environment),
        workflow.output
      )
    : undefined;
}

export function inputDefaults(workflow: Workflow): Inputs {
  const inputs = workflow.inputs || {};
  return Object.keys(inputs)
    .map((fieldName) => ({ fieldName, default: inputs[fieldName].default }))
    .filter((input) => input.default)
    .reduce((acc, input) => ({ ...acc, [input.fieldName]: input.default }), {});
}
