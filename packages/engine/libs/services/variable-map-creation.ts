import {
  Step,
  Evaluation,
  VariableMap,
  Workflow,
  State,
  Path,
  Environment,
  isForStep,
  ForStep,
} from "../types";
import { resolveAllSteps, resolveLoopPositions } from "./step-resolvement";
import { evaluate } from "./evaluation";

export function createVariableMapFromState(
  workflow: Workflow,
  state: State,
  environment: Environment
): VariableMap {
  const variables = {
    inputs: state.inputs,
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
  return steps.filter(isForStep).reduce(
    (acc, step, i) => ({
      ...acc,
      [step.for.const]: getLoopList(variables, step)[loopPositions[i]],
    }),
    {}
  );
}

function getLoopList(variables: VariableMap, step: ForStep): unknown[] {
  const loopList = evaluate(variables, step.for.in);
  if (!loopList || !Array.isArray(loopList)) {
    throw new Error(
      `The expression '${step.for.in}' does not resolve to a list`
    );
  } else {
    return loopList;
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
