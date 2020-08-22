import { Workflow, Path, Step } from "../types";

export class StepResolvementService {
  constructor() {}

  resolveStep(workflow: Workflow, path: Path): Step {
    return this.resolveStepRec(workflow.steps, path);
  }

  resolveStepRec(steps: Step[], path: Path): Step {
    if (path.length == 0) {
      throw new Error(`Can not resolve empty path`);
    } else if (path.length == 1) {
      return steps[path[0]];
    } else {
      const step = steps[path[0]];
      if (step?.for?.do) {
        return this.resolveStepRec(step.for.do, path.slice(2));
      } else {
        throw new Error(`Can not resolve path ${path} at flat step ${step}`);
      }
    }
  }

  /**
   * Resolves all steps along the path.
   */
  resolveAllSteps(workflow: Workflow, path: Path): Step[] {
    return this.resolveAllStepsRec(workflow.steps, path);
  }

  resolveAllStepsRec(steps: Step[], path: Path): Step[] {
    if (path.length == 0) {
      throw new Error(`Can not resolve empty path`);
    } else if (path.length == 1) {
      return [steps[path[0]]];
    } else {
      const step = steps[path[0]];
      if (step?.for?.do) {
        return [step].concat(
          this.resolveAllStepsRec(step.for.do, path.slice(2))
        );
      } else {
        throw new Error(`Can not resolve path ${path} at flat step ${step}`);
      }
    }
  }
}
