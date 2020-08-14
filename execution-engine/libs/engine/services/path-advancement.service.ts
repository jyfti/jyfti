import { concat, get, isNil, tail } from "lodash/fp";

import { Workflow } from "../types/workflow.type";
import { Step } from "../types/step.type";
import { VariableMap } from "../types/variable-map.type";
import { Path } from "../types/path.type";

export class PathAdvancementService {
  constructor() {}

  advancePath(workflow: Workflow, path: Path, variables: VariableMap): Path {
    return this.advancePathRec(workflow.steps, path, variables);
  }

  isForStep(step: Step) {
    return !isNil(get("for", step));
  }

  private createStartingPath(step: Step, variables: VariableMap): Path {
    return this.isForStep(step) &&
      step.for!.do.length != 0 &&
      variables[step.for!.in]?.length > 0
      ? concat([0, 0], this.createStartingPath(step.for!.do[0], variables))
      : [];
  }

  private advancePathForLoop(
    step: Step,
    path: Path,
    variables: VariableMap
  ): Path {
    const currentVariableIndex = path[0];
    const subPath = tail(path);
    const nextLoopPath = this.advancePathRec(step.for!.do, subPath, variables);
    if (nextLoopPath.length == 0) {
      // All steps within the for loop are done, go to next variable of list
      const loopVariables = variables[step.for!.in];
      const nextVariableIndex = this.advancePathFlat(
        loopVariables,
        currentVariableIndex
      );
      return isNil(nextVariableIndex)
        ? [] // Loop over
        : concat(
            [nextVariableIndex, 0],
            this.createStartingPath(step.for!.do[0], variables)
          );
    } else {
      return concat([currentVariableIndex], nextLoopPath);
    }
  }

  private advancePathFlat(elements: any[], position: number): number | null {
    return position + 1 < elements.length ? position + 1 : null;
  }

  advancePathRec(steps: Step[], path: Path, variables: VariableMap): Path {
    if (path.length == 0) {
      return concat([0], this.createStartingPath(steps[0], variables));
    }
    const currentPosition = path[0];
    const currentStep = steps[currentPosition];
    if (this.isForStep(currentStep)) {
      const subPath = tail(path);
      if (subPath.length == 0) {
        // Loop just ended
        const nextPosition = this.advancePathFlat(steps, currentPosition);
        return isNil(nextPosition)
          ? []
          : concat(
              [nextPosition],
              this.createStartingPath(steps[nextPosition], variables)
            );
      } else {
        const nextLoopPath = this.advancePathForLoop(
          currentStep,
          subPath,
          variables
        );
        return nextLoopPath.length == 0
          ? [currentPosition] // Loop over
          : concat([currentPosition], nextLoopPath);
      }
    } else {
      const nextPosition = this.advancePathFlat(steps, currentPosition);
      return isNil(nextPosition)
        ? []
        : concat(
            [nextPosition],
            this.createStartingPath(steps[nextPosition], variables)
          );
    }
  }
}
