import { inputDefaults, nextStep, toOutput, nextState } from "./execution";
import { Observable, empty, OperatorFunction, of } from "rxjs";
import { flatMap, startWith, map, scan, catchError } from "rxjs/operators";
import {
  StepResult,
  Inputs,
  State,
  Workflow,
  VariableMap,
  Environment,
  isSuccess,
} from "../types";
import { createVariableMapFromState } from "./variable-map-creation";

/**
 * Creates an execution engine for a specific workflow in a specific environment.
 *
 * @param workflow The workflow
 * @param environment The environment
 */
export function createEngine(
  workflow: Workflow,
  environment: Environment
): Engine {
  return new Engine(workflow, environment);
}

export class Engine {
  /**
   * Creates an execution engine for a specific workflow in a specific environment.
   *
   * @param workflow The workflow
   * @param environment The environment
   */
  constructor(
    private readonly workflow: Workflow,
    private readonly environment: Environment
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
    return this.step(state).pipe(
      flatMap((stepResult) => {
        const nextState = this.transition(state, stepResult);
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
   * @returns A cold observable completing after a single step result.
   */
  step(state: State): Observable<StepResult> {
    return nextStep(this.workflow, state, this.environment).pipe(
      map((evaluation) => ({ path: state.path, evaluation })),
      catchError((error) => of({ path: state.path, error }))
    );
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
    if (isSuccess(stepResult)) {
      return nextState(
        this.workflow,
        state,
        stepResult.evaluation,
        this.environment
      );
    } else {
      return {
        ...state,
        error: stepResult.error,
      };
    }
  }
}
