import { inputDefaults, step, toOutput } from "./execution";
import { Observable, OperatorFunction, EMPTY } from "rxjs";
import { mergeMap, startWith, scan } from "rxjs/operators";
import {
  StepResult,
  Inputs,
  State,
  Workflow,
  VariableMap,
  Environment,
  isSuccess,
  Path,
  Step,
} from "../types";
import { createVariableMapFromState } from "./variable-map-creation";
import { resolveStep } from "./step-resolvement";
import { isComplete, isError, isWaiting } from "./state";
import { nextState } from "./next-state";

/**
 * Creates an execution engine for a specific workflow in a specific environment.
 *
 * @param workflow The workflow
 * @param environment The environment
 */
export function createEngine(
  workflow: Workflow,
  environment: Environment,
  outRoot: string
): Engine {
  return new Engine(workflow, environment, outRoot);
}

export class Engine {
  /**
   * Creates an execution engine for a specific workflow in a specific environment.
   *
   * @param workflow The workflow
   * @param environment The environment
   * @param outRoot The directory where the state of the workflow is stored
   */
  constructor(
    private readonly workflow: Workflow,
    private readonly environment: Environment,
    private readonly outRoot: string
  ) {}

  /**
   * Creates an initial state with the given inputs.
   *
   * @param inputs The input values of the workflow
   */
  init(inputs: Inputs): State {
    return {
      path: [0],
      inputs: { ...inputDefaults(this.workflow), ...inputs },
      evaluations: [],
    };
  }

  /**
   * Runs the workflow from the given state to completion.
   *
   * @param state The state to begin from.
   * @returns A cold observable of all step results after the state. Completes successfully iff the workflow is completing. Errors otherwise.
   */
  complete(state: State): Observable<StepResult> {
    return step(this.workflow, state, this.environment, this.outRoot).pipe(
      mergeMap((stepResult) => {
        const nextState = this.transition(state, stepResult);
        const nextStepResults =
          isComplete(nextState) || isError(nextState) || isWaiting(nextState)
            ? EMPTY
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
   * @returns A cold observable completing after a single step result.
   */
  step(state: State): Observable<StepResult> {
    return step(this.workflow, state, this.environment, this.outRoot);
  }

  /**
   * Returns the evaluation of the output against the passed state.
   * Returns undefined if the workflow does not define an output.
   *
   * @param state The state
   */
  getOutput(state: State): unknown | undefined {
    return toOutput(this.workflow, state, this.environment);
  }

  /**
   * Returns the map of variable values that the state defines at the current path.
   * This variable map can contain input values and values defined via `assignTo` or `const`.
   * It considers the scope a variable is defined in.
   *
   * @param state The state
   */
  getVariableMap(state: State): VariableMap {
    return createVariableMapFromState(this.workflow, state, this.environment);
  }

  /**
   * Resolves the step at the given path of the workflow.
   *
   * @param path The path
   */
  resolveStep(path: Path): Step {
    return resolveStep(this.workflow, path);
  }

  /**
   * Transitions an observable of step results into an observable of states.
   * This is useful, if you do not only want to track results of individual steps, but the accumulated results of all steps up to a specific step.
   */
  transitionFrom(state: State): OperatorFunction<StepResult, State> {
    return (stepResult$) =>
      stepResult$.pipe(scan(this.transition.bind(this), state));
  }

  /**
   * Transitions a state with the result from a step into the next state.
   *
   * @param state The current state
   * @param stepResult The result of the last step following the current state
   * @returns The next state
   */
  transition(state: State, stepResult: StepResult): State {
    const newState = isSuccess(stepResult)
      ? nextState(this.workflow, state, stepResult.evaluation, this.environment)
      : state;
    return {
      ...newState,
      lastStep: stepResult,
    };
  }
}
