import { Workflow, Path, Step } from "../types";

export function resolveStep(workflow: Workflow, path: Path): Step {
  return resolveStepRec(workflow.steps, path);
}

export function resolveStepRec(steps: Step[], path: Path): Step {
  if (path.length == 0) {
    throw new Error(`Can not resolve empty path`);
  } else if (path.length == 1) {
    return steps[path[0]];
  } else {
    const step = steps[path[0]];
    if (step?.for?.do) {
      return resolveStepRec(step.for.do, path.slice(2));
    } else {
      throw new Error(`Can not resolve path ${path} at flat step ${step}`);
    }
  }
}

/**
 * Resolves all steps along the path.
 */
export function resolveAllSteps(workflow: Workflow, path: Path): Step[] {
  return resolveAllStepsRec(workflow.steps, path);
}

export function resolveAllStepsRec(steps: Step[], path: Path): Step[] {
  if (path.length == 0) {
    throw new Error(`Can not resolve empty path`);
  } else if (path.length == 1) {
    return [steps[path[0]]];
  } else {
    const step = steps[path[0]];
    if (step?.for?.do) {
      return [step].concat(resolveAllStepsRec(step.for.do, path.slice(2)));
    } else {
      throw new Error(`Can not resolve path ${path} at flat step ${step}`);
    }
  }
}

/**
 * Resolves the position within the iterated array of all nested loops at the path.
 */
export function resolveLoopPositions(steps: Step[], path: Path): number[] {
  if (path.length == 0) {
    throw new Error(`Can not resolve empty path`);
  } else if (path.length == 1) {
    return [];
  } else {
    const step = steps[path[0]];
    if (step?.for?.do) {
      return [path[1]].concat(resolveLoopPositions(step.for.do, path.slice(2)));
    } else {
      throw new Error(`Can not resolve path ${path} at flat step ${step}`);
    }
  }
}
