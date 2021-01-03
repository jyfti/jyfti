import { Environment } from "../types/environment.type";
import { Evaluation } from "../types/evaluations.type";
import { State } from "../types/state.type";
import { Workflow } from "../types/workflow.type";
import { addEvaluation } from "./evaluation-resolvement";
import { advancePath } from "./path-advancement";
import { createVariableMapFromState } from "./variable-map-creation";

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
