import { Injectable } from '@angular/core';
import { isNil, has, tail, concat } from 'lodash/fp';
import { Dataflow } from '../types/dataflow.type';
import { Path, Evaluations } from './execution-engine.service';
import { VariableMap } from '../types/variable-map.type';
import { Step } from '../types/step.type';
import { Evaluation } from './execution.service';

@Injectable({
  providedIn: 'root',
})
export class ExecutionPathService {
  constructor() {}

  resolveEvaluation(
    evaluations: Evaluation | Evaluations,
    path: Path
  ): Evaluation | Evaluations {
    if (path.length == 0) {
      return evaluations;
    } else {
      return this.resolveEvaluation(evaluations[path[0]], tail(path));
    }
  }

  addEvaluation(
    path: Path,
    evaluations: Evaluations,
    evaluation: Evaluation
  ): Evaluations {
    if (path.length == 0) {
      return evaluations.concat([evaluation]);
    } else if (path.length == 1) {
      if (path[0] != evaluations.length) {
        throw new Error('Can not override existing evaluation');
      }
      return this.addEvaluation([], evaluations, evaluation);
    } else {
      if (path[0] < evaluations.length - 1) {
        throw new Error(
          'Can not modify sub evaluations of other than the current or next evaluation'
        );
      }
      return evaluations.concat([
        this.addEvaluation(
          tail(path),
          path[0] == evaluations.length - 1 ? evaluations[path[0]] : [],
          evaluation
        ),
      ]);
    }
  }

  resolveStep(dataflow: Dataflow, path: Path): Step {
    return this.resolveStepRec(dataflow.steps, path);
  }

  resolveStepRec(steps: Step[], path: Path): Step {
    if (path.length == 0) {
      throw new Error(`Can not resolve empty path`);
    } else if (path.length == 1) {
      return steps[path[0]];
    } else {
      const step = steps[path[0]];
      if (has('for', step)) {
        return this.resolveStepRec(step.for.do, tail(tail(path)));
      } else {
        throw new Error(`Can not resolve path ${path} at flat step ${step}`);
      }
    }
  }

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
