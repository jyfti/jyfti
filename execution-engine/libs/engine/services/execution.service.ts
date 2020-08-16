import { Observable } from "rxjs";

import { EvaluationResolvementService } from "./evaluation-resolvement.service";
import { PathAdvancementService } from "./path-advancement.service";
import { StepExecutionService } from "./step-execution.service";
import { StepResolvementService } from "./step-resolvement.service";
import { State, Workflow, Evaluation, VariableMap, Inputs } from "../types";
import { evaluate } from "./evaluation.service";

export class ExecutionService {
  constructor(
    private stepExecutionService: StepExecutionService,
    private evaluationResolvementService: EvaluationResolvementService,
    private pathAdvancementService: PathAdvancementService,
    private stepResolvementService: StepResolvementService
  ) {}

  nextState(workflow: Workflow, state: State, evaluation: Evaluation): State {
    const nextPath = this.pathAdvancementService.advancePath(
      workflow,
      state.path,
      this.toVariableMap(workflow, state)
    );
    const nextEvaluations = this.evaluationResolvementService.addEvaluation(
      state.path,
      state.evaluations,
      evaluation
    );
    return {
      path: nextPath,
      inputs: state.inputs,
      evaluations: nextEvaluations,
    };
  }

  nextStep(workflow: Workflow, state: State): Observable<Evaluation> {
    return this.stepExecutionService.executeStep(
      this.stepResolvementService.resolveStep(workflow, state.path),
      this.evaluationResolvementService.resolveEvaluation(
        state.evaluations,
        state.path
      ),
      this.toVariableMap(workflow, state)
    );
  }

  toOutput(workflow: Workflow, state: State): any | undefined {
    return workflow.output
      ? evaluate(this.toVariableMap(workflow, state), workflow.output)
      : undefined;
  }

  toVariableMap(workflow: Workflow, state: State): VariableMap {
    return {
      ...state.inputs,
      ...this.stepExecutionService.toVariableMap(
        workflow.steps,
        state.evaluations
      ),
    };
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
