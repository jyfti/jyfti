import { Observable, of } from "rxjs";

import {
  State,
  Workflow,
  Inputs,
  Environment,
  StepResult,
  JsonSchema,
  StepRequire,
  StepFailure,
  Path,
} from "../types";
import { evaluate } from "./evaluation";
import { createVariableMapFromState } from "./variable-map-creation";
import { executeStep } from "../step-execution/step-execution";
import { resolveStep } from "./step-resolvement";
import { resolveEvaluation } from "./evaluation-resolvement";
import { map, catchError } from "rxjs/operators";
import { hasErrors, validateInputs } from "./validator";

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
  const require = evaluate(variables, step.require);
  const requireResult = checkRequire(require, state.inputs, path, name);
  if (requireResult) {
    return of(requireResult);
  }
  return executeStep(step, localEvaluations, variables, outRoot).pipe(
    map((evaluation) => ({ name, path, evaluation })),
    catchError((error) => of({ name, path, error }))
  );
}

export function checkRequire(
  require: unknown,
  inputs: Inputs,
  path: Path,
  name: string | undefined
): StepRequire | StepFailure | undefined {
  if (require && isJsonSchemaMap(require)) {
    const missingInputs = Object.keys(require).filter(
      (input) => !Object.keys(inputs).includes(input)
    );
    if (missingInputs.length !== 0) {
      return {
        name,
        path,
        require: missingInputs.reduce(
          (acc, input) => ({ ...acc, [input]: require[input] }),
          {}
        ),
      };
    }
    const requireValidation = validateInputs(inputs, require);
    if (hasErrors(requireValidation)) {
      return {
        name,
        path,
        error: new Error("Required inputs are given, but wrongly typed"), // TODO Improve message with actual errors
      };
    }
  }
  return undefined;
}

function isJsonSchemaMap(
  object: unknown
): object is Record<string, JsonSchema> {
  // TODO Improve
  return typeof object === "object";
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
