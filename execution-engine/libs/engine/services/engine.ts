import { ExecutionService } from "./execution.service";
import { Workflow } from "../types/workflow.type";
import { StepResult } from "../types/step-result.type";
import { State } from "../types/state.type";
import { Observable, empty, OperatorFunction, from } from "rxjs";
import { flatMap, startWith, map, scan } from "rxjs/operators";
import { validateInputs } from "./validator.service";
import ajv from "ajv";

export function init(inputs: { [name: string]: any }): State {
  return { path: [0], inputs, evaluations: [] };
}

export class Engine {
  constructor(private workflow: Workflow, public service: ExecutionService) {}

  validate(inputs: {
    [name: string]: any;
  }): { [name: string]: ajv.ErrorObject[] } {
    return validateInputs(this.workflow.inputs, inputs);
  }

  /**
   * Runs the workflow from start to completion.
   *
   * @returns A cold observable of all step results. Completes successfully iff the workflow is completing. Errors otherwise.
   */
  run(inputs: { [name: string]: any }): Observable<StepResult> {
    return this.complete(init(inputs));
  }

  /**
   * Runs the workflow from the given state to completion.
   *
   * @param state The state to begin from.
   * @returns A cold observable of all step results after the state. Completes successfully iff the workflow is completing. Errors otherwise.
   */
  complete(state: State): Observable<StepResult> {
    return this.step(state).pipe(
      flatMap((stepResult) => {
        const nextState = this.toState(state, stepResult);
        const nextStepResults = this.isComplete(nextState)
          ? empty()
          : this.complete(nextState);
        return nextStepResults.pipe(startWith(stepResult));
      })
    );
  }

  /**
   * Executes a single next step.
   * If the step is nested like a for-comprehension, it will recursively execute a step within it.
   * The behaviour is comparable to the "Step into" behaviour of common debuggers.
   *
   * @param state The state describing which step to execute.
   * @returns A cold observable of a single step result.
   */
  step(state: State): Observable<StepResult> {
    return this.service
      .nextStep(this.workflow, state)
      .pipe(map((evaluation) => ({ path: state.path, evaluation })));
  }

  /**
   * Returns if the workflow is completed with this state.
   * If true, then no more steps can be made from this state.
   *
   * @param state The state
   */
  isComplete(state: State): boolean {
    return state.path.length == 0;
  }

  /**
   * Transitions an observable of step results into an observable of states.
   * This is useful, if you do not only want to track results of individual steps, but the accumulated results of all steps up to a specific step.
   */
  toStates(inputs: {
    [name: string]: any;
  }): OperatorFunction<StepResult, State> {
    return (stepResult$) =>
      stepResult$.pipe(scan(this.toState.bind(this), init(inputs)));
  }

  /**
   * Transitions a state with the result from a step into the next state.
   *
   * @param state The current state
   * @param stepResult The result of the last step following the current state
   * @returns The next state
   */
  toState(state: State, stepResult: StepResult): State {
    return this.service.nextState(this.workflow, state, stepResult.evaluation);
  }
}
