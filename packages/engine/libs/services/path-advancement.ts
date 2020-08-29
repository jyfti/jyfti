import {
  Workflow,
  Path,
  VariableMap,
  Step,
  isForStep,
  ForStep,
} from "../types";
import { evaluate } from "./evaluation";

export function advancePath(
  workflow: Workflow,
  path: Path,
  variables: VariableMap
): Path {
  return advancePathRec(workflow.steps, path, variables);
}

function createStartingPath(step: Step, variables: VariableMap): Path {
  return isForStep(step) &&
    step.for.do.length != 0 &&
    evaluate(variables, step.for.in)?.length > 0
    ? [0, 0].concat(createStartingPath(step.for.do[0], variables))
    : [];
}

function advancePathForLoop(
  step: ForStep,
  path: Path,
  variables: VariableMap
): Path {
  const currentVariableIndex = path[0];
  const subPath = path.slice(1);
  const nextLoopPath = advancePathRec(step.for.do, subPath, variables);
  if (nextLoopPath.length == 0) {
    // All steps within the for loop are done, go to next variable of list
    const loopVariables = evaluate(variables, step.for.in);
    const nextVariableIndex = advancePathFlat(
      loopVariables,
      currentVariableIndex
    );
    return nextVariableIndex === null
      ? [] // Loop over
      : [nextVariableIndex, 0].concat(
          createStartingPath(step.for.do[0], variables)
        );
  } else {
    return [currentVariableIndex].concat(nextLoopPath);
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
    return [0].concat(createStartingPath(steps[0], variables));
  }
  const currentPosition = path[0];
  const currentStep = steps[currentPosition];
  if (isForStep(currentStep)) {
    const subPath = path.slice(1);
    if (subPath.length == 0) {
      // Loop just ended
      const nextPosition = advancePathFlat(steps, currentPosition);
      return nextPosition === null
        ? []
        : [nextPosition].concat(
            createStartingPath(steps[nextPosition], variables)
          );
    } else {
      const nextLoopPath = advancePathForLoop(currentStep, subPath, variables);
      return nextLoopPath.length == 0
        ? [currentPosition] // Loop over
        : [currentPosition].concat(nextLoopPath);
    }
  } else {
    const nextPosition = advancePathFlat(steps, currentPosition);
    return nextPosition === null
      ? []
      : [nextPosition].concat(
          createStartingPath(steps[nextPosition], variables)
        );
  }
}
