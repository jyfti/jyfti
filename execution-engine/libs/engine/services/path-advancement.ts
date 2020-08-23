import { concat, get, isNil, tail } from "lodash/fp";
import { Workflow, Path, VariableMap, Step } from "../types";
import { evaluate } from "./evaluation";

export function advancePath(
  workflow: Workflow,
  path: Path,
  variables: VariableMap
): Path {
  return advancePathRec(workflow.steps, path, variables);
}

export function isForStep(step: Step) {
  return !isNil(get("for", step));
}

function createStartingPath(step: Step, variables: VariableMap): Path {
  return isForStep(step) &&
    step.for!.do.length != 0 &&
    evaluate(variables, step.for!.in)?.length > 0
    ? concat([0, 0], createStartingPath(step.for!.do[0], variables))
    : [];
}

function advancePathForLoop(
  step: Step,
  path: Path,
  variables: VariableMap
): Path {
  const currentVariableIndex = path[0];
  const subPath = tail(path);
  const nextLoopPath = advancePathRec(step.for!.do, subPath, variables);
  if (nextLoopPath.length == 0) {
    // All steps within the for loop are done, go to next variable of list
    const loopVariables = evaluate(variables, step.for!.in);
    const nextVariableIndex = advancePathFlat(
      loopVariables,
      currentVariableIndex
    );
    return isNil(nextVariableIndex)
      ? [] // Loop over
      : concat(
          [nextVariableIndex, 0],
          createStartingPath(step.for!.do[0], variables)
        );
  } else {
    return concat([currentVariableIndex], nextLoopPath);
  }
}

function advancePathFlat(elements: any[], position: number): number | null {
  return position + 1 < elements.length ? position + 1 : null;
}

export function advancePathRec(
  steps: Step[],
  path: Path,
  variables: VariableMap
): Path {
  if (path.length == 0) {
    return concat([0], createStartingPath(steps[0], variables));
  }
  const currentPosition = path[0];
  const currentStep = steps[currentPosition];
  if (isForStep(currentStep)) {
    const subPath = tail(path);
    if (subPath.length == 0) {
      // Loop just ended
      const nextPosition = advancePathFlat(steps, currentPosition);
      return isNil(nextPosition)
        ? []
        : concat(
            [nextPosition],
            createStartingPath(steps[nextPosition], variables)
          );
    } else {
      const nextLoopPath = advancePathForLoop(currentStep, subPath, variables);
      return nextLoopPath.length == 0
        ? [currentPosition] // Loop over
        : concat([currentPosition], nextLoopPath);
    }
  } else {
    const nextPosition = advancePathFlat(steps, currentPosition);
    return isNil(nextPosition)
      ? []
      : concat(
          [nextPosition],
          createStartingPath(steps[nextPosition], variables)
        );
  }
}
