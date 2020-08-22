import { Step, Evaluation, VariableMap, Workflow, State, Path } from "../types";
import { resolveAllSteps, resolveLoopPositions } from "./step-resolvement";

export function createVariableMapFromState(
  workflow: Workflow,
  state: State,
  environment: VariableMap
): VariableMap {
  const variables = {
    ...state.inputs,
    env: environment,
    ...toVariableMap(workflow.steps, state.evaluations),
  };
  return {
    ...variables,
    ...resolveLoopVariables(workflow, state.path, variables),
  };
}

function resolveLoopVariables(
  workflow: Workflow,
  path: Path,
  variables: VariableMap
): VariableMap {
  const steps = resolveAllSteps(workflow, path);
  const loopPositions = resolveLoopPositions(workflow.steps, path);
  return steps
    .filter((step) => step.for)
    .reduce(
      (acc, step, i) => ({
        ...acc,
        [step.for!.const]: getLoopList(variables, step)[loopPositions[i]],
      }),
      {}
    );
}

function getLoopList(variables: VariableMap, step: Step): any {
  if (!step.for || !variables[step.for!.in]) {
    throw new Error(`The variable '${step.for?.in}' is not defined`);
  } else {
    return variables[step.for.in];
  }
}

export function toVariableMap(
  steps: Step[],
  evaluations: Evaluation[]
): VariableMap {
  return steps
    .map((step, index) => ({ step, evaluation: evaluations[index] }))
    .filter(({ evaluation }) => evaluation)
    .reduce(
      (variables: VariableMap, { step, evaluation }) => ({
        ...variables,
        [step.assignTo]: evaluation,
      }),
      {}
    );
}
