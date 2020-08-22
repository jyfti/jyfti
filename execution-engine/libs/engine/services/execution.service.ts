import { Observable } from "rxjs";

import { State, Workflow, Evaluation, Inputs } from "../types";
import { evaluate } from "./evaluation.service";
import { createVariableMapFromState } from "./variable-map-creation";
import { executeStep } from "./step-execution.service";
import { advancePath } from "./path-advancement.service";
import { resolveStep } from "./step-resolvement.service";
import {
  addEvaluation,
  resolveEvaluation,
} from "./evaluation-resolvement.service";

export class ExecutionService {
  nextState(workflow: Workflow, state: State, evaluation: Evaluation): State {
    const nextEvaluations = addEvaluation(
      state.path,
      state.evaluations,
      evaluation
    );
    const nextPath = advancePath(
      workflow,
      state.path,
      createVariableMapFromState(workflow, {
        path: state.path,
        inputs: state.inputs,
        evaluations: nextEvaluations,
      })
    );
    return {
      path: nextPath,
      inputs: state.inputs,
      evaluations: nextEvaluations,
    };
  }

  nextStep(workflow: Workflow, state: State): Observable<Evaluation> {
    return executeStep(
      resolveStep(workflow, state.path),
      resolveEvaluation(state.evaluations, state.path),
      createVariableMapFromState(workflow, state)
    );
  }

  toOutput(workflow: Workflow, state: State): any | undefined {
    return workflow.output
      ? evaluate(createVariableMapFromState(workflow, state), workflow.output)
      : undefined;
  }

  inputDefaults(workflow: Workflow): Inputs {
    const inputs = workflow.inputs || {};
    return Object.keys(inputs)
      .map((fieldName) => ({ fieldName, default: inputs[fieldName].default }))
      .filter((input) => input.default)
      .reduce(
        (acc, input) => ({ ...acc, [input.fieldName]: input.default }),
        {}
      );
  }
}
