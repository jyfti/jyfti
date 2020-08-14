import { Workflow } from "../types/workflow.type";
import { Path } from "../types/path.type";
import { Step } from "../types/step.type";
import { tail } from "lodash/fp";

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
        return this.resolveStepRec(step.for.do, tail(tail(path)));
      } else {
        throw new Error(`Can not resolve path ${path} at flat step ${step}`);
      }
    }
  }
}
