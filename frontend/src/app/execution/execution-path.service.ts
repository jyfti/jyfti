import { Injectable } from '@angular/core';
import { isNil, has, tail, concat } from 'lodash/fp';
import { Dataflow } from '../types/dataflow.type';
import { Path } from './execution-engine.service';
import { VariableMap } from '../types/variable-map.type';
import { Step } from '../types/step.type';

@Injectable({
  providedIn: 'root',
})
export class ExecutionPathService {
  constructor() {}

  advancePath(dataflow: Dataflow, path: Path, variables: VariableMap): Path {
    return this.advancePathRec(dataflow.steps, path, variables);
  }

  private createStartingPath(step: Step): Path {
    return has('for', step)
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
      const nextLoopPath = this.advancePathForLoop(
        currentStep,
        tail(path),
        variables
      );
      if (nextLoopPath.length == 0) {
        // Loop over
        const nextPosition = this.advancePathFlat(steps, currentPosition);
        return isNil(nextPosition)
          ? []
          : concat(
              [nextPosition],
              this.createStartingPath(steps[nextPosition])
            );
      } else {
        return concat([currentPosition], nextLoopPath);
      }
    } else {
      const nextPosition = this.advancePathFlat(steps, currentPosition);
      return isNil(nextPosition)
        ? []
        : concat([nextPosition], this.createStartingPath(steps[nextPosition]));
    }
  }
}
