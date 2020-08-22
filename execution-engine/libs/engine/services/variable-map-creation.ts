import { Step, Evaluation, VariableMap, Workflow, State, Path } from "../types";
import { StepResolvementService } from "./step-resolvement.service";

export function createVariableMapFromState(
  workflow: Workflow,
  state: State
): VariableMap {
  const variables = {
    ...state.inputs,
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
  const steps = new StepResolvementService().resolveAllSteps(workflow, path);
  return steps
    .filter((step) => step.for)
    .reduce(
      (acc, step) => ({ ...acc, [step.for!.const]: variables[step.for!.in] }),
      {}
    );
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
