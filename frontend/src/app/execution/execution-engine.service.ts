import { Injectable } from '@angular/core';
import { isNil, last, has, tail, concat } from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { flatMap, startWith } from 'rxjs/operators';

import { Dataflow } from '../types/dataflow.type';
import { Step } from '../types/step.type';
import { VariableMap } from '../types/variable-map.type';
import { Evaluation } from './execution.service';
import { SingleStepService } from './single-step.service';

export type Path = number[];

export interface PathedEvaluation {
  path: Path;
  evaluation: Evaluation;
}

export type Evaluations = (Evaluation | Evaluations)[];

@Injectable({
  providedIn: 'root',
})
export class ExecutionEngineService {
  constructor(private singleStepService: SingleStepService) {}

  executeDataflow(dataflow: Dataflow): Observable<PathedEvaluation> {
    return this.executeTicksFrom(dataflow, [0], []);
  }

  executeTicksFrom(
    dataflow: Dataflow,
    path: Path,
    evaluations: Evaluations
  ): Observable<PathedEvaluation> {
    return this.tick(dataflow, path, evaluations).pipe(
      flatMap((evaluation) => {
        const newEvaluations = this.addEvaluation(
          path,
          evaluations,
          evaluation
        );
        const newPath = this.advancePath(
          dataflow,
          path,
          this.singleStepService.toVariableMap(dataflow.steps, evaluations)
        );
        return newPath.length == 0
          ? of({ path, evaluation })
          : this.executeTicksFrom(dataflow, newPath, newEvaluations).pipe(
              startWith({ path, evaluation })
            );
      })
    );
  }

  tick(
    dataflow: Dataflow,
    path: Path,
    evaluations: Evaluations
  ): Observable<Evaluation> {
    return this.executeStep(
      dataflow.steps[last(path)],
      this.singleStepService.toVariableMap(dataflow.steps, evaluations)
    );
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

  addEvaluation(
    path: Path,
    evaluations: Evaluations,
    evaluation: Evaluation
  ): Evaluations {
    return evaluations.concat([evaluation]);
  }

  executeStep(step: Step, variables: VariableMap): Observable<Evaluation> {
    if (!isNil(step?.request)) {
      return this.singleStepService.executeRequestStep(step.request, variables);
    } else if (!isNil(step?.expression)) {
      return this.singleStepService.executeExpressionStep(
        step.expression,
        variables
      );
    } else {
      return of({
        error:
          "Step does not contain any of 'request', 'expression' and 'for'.",
      });
    }
  }
}
