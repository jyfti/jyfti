import { Injectable } from '@angular/core';
import { Dataflow } from '../types/dataflow.type';
import { Path } from './execution-engine.service';
import { VariableMap } from '../types/variable-map.type';
import { Step } from '../types/step.type';
import { has, tail, isNil, concat } from 'lodash/fp';

@Injectable({
  providedIn: 'root',
})
export class PathAdvancementService {
  constructor() {}

  advancePath(dataflow: Dataflow, path: Path, variables: VariableMap): Path {
    return this.advancePathRec(dataflow.steps, path, variables);
  }

  private createStartingPath(step: Step): Path {
    return has('for', step) && step.for.do.length != 0
      ? concat([0, 0], this.createStartingPath(step.for.do[0]))
      : [];
  }

  private advancePathForLoop(
    step: Step,
    path: Path,
    variables: VariableMap
  ): Path {
    const currentVariableIndex = path[0];
    const subPath = tail(path);
    const nextLoopPath = this.advancePathRec(step.for.do, subPath, variables);
    if (nextLoopPath.length == 0) {
      // All steps within the for loop are done, go to next variable of list
      const loopVariables = variables[step.for.in];
      const nextVariableIndex = this.advancePathFlat(
        loopVariables,
        currentVariableIndex
      );
      return isNil(nextVariableIndex)
        ? [] // Loop over
        : concat(
            [nextVariableIndex, 0],
            this.createStartingPath(step.for.do[0])
          );
    } else {
      return concat([currentVariableIndex], nextLoopPath);
    }
  }

  private advancePathFlat(elements: any[], position: number): number {
    return position + 1 < elements.length ? position + 1 : null;
  }

  advancePathRec(steps: Step[], path: Path, variables: VariableMap): Path {
    if (path.length == 0) {
      return concat([0], this.createStartingPath(steps[0]));
    }
    const currentPosition = path[0];
    const currentStep = steps[currentPosition];
    if (has('for', currentStep)) {
      const subPath = tail(path);
      if (subPath.length == 0) {
        // Loop just ended
        const nextPosition = this.advancePathFlat(steps, currentPosition);
        return isNil(nextPosition)
          ? []
          : concat(
              [nextPosition],
              this.createStartingPath(steps[nextPosition])
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
        : concat([nextPosition], this.createStartingPath(steps[nextPosition]));
    }
  }
}
