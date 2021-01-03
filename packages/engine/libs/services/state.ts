import { State } from "../types/state.type";
import { isFailure, isRequire } from "../types/step-result.type";

/**
 * Returns if the workflow is completed with this state.
 * If true, then no more steps can be made from this state.
 */
export function isComplete(state: State): boolean {
  return state.path.length == 0;
}

/**
 * Returns if the workflow has errored with this state.
 * If true, then a subsequent step re-executes the previous step again.
 *
 * Note that a call to complete stops after an error occurred.
 */
export function isError(state: State): boolean {
  return !!state.lastStep && isFailure(state.lastStep);
}

/**
 * Returns if the workflow is requiring input to continue.
 * If true, then a subsequent step re-executes the previous step again.
 *
 * Note that a call to complete stops if a step is requiring input.
 */
export function isWaiting(state: State): boolean {
  return !!state.lastStep && isRequire(state.lastStep);
}
