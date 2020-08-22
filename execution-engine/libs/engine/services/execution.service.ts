import { Observable } from "rxjs";

import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { StepResolvementService } from "./step-resolvement.service";
import { State, Workflow, Evaluation, Inputs } from "../types";
import { evaluate } from "./evaluation.service";
import { createVariableMapFromState } from "./variable-map-creation";
import { executeStep } from "./step-execution.service";

export class ExecutionService {
  constructor(
    private evaluationResolvementService: EvaluationResolvementService,
    private pathAdvancementService: PathAdvancementService,
    private stepResolvementService: StepResolvementService
  ) {}

  nextState(workflow: Workflow, state: State, evaluation: Evaluation): State {
    const nextEvaluations = this.evaluationResolvementService.addEvaluation(
      state.path,
      state.evaluations,
      evaluation
    );
    const nextPath = this.pathAdvancementService.advancePath(
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
      this.stepResolvementService.resolveStep(workflow, state.path),
      this.evaluationResolvementService.resolveEvaluation(
        state.evaluations,
        state.path
      ),
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
