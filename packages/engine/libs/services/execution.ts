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
  environment: Environment,
  outRoot: string
): Observable<StepResult> {
  const step = resolveStep(workflow, state.path);
  const localEvaluations = resolveEvaluation(state.evaluations, state.path);
  const variables = createVariableMapFromState(workflow, state, environment);
  const name = tryCatch(
    () => stringOrElseUndefined(evaluate(variables, step.name)),
    (err) => "<Name could not be evaluated> " + JSON.stringify(err)
  );
  const path = state.path;
  return executeStep(step, localEvaluations, variables, outRoot).pipe(
    map((evaluation) => ({ name, path, evaluation })),
    catchError((error) => of({ name, path, error }))
  );
}

function stringOrElseUndefined(object: unknown): string | undefined {
  return typeof object === "string" ? object : undefined;
}

function tryCatch<T>(f: () => T, catcher: (err) => T): T {
  try {
    return f();
  } catch (err) {
    return catcher(err);
  }
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
