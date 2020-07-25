import { Injectable } from '@angular/core';
import { Dataflow } from '../types/dataflow.type';
import { Path } from './execution-engine.service';
import { Step } from '../types/step.type';
import { has, tail } from 'lodash/fp';

@Injectable({
  providedIn: 'root',
})
export class StepResolvementService {
  constructor() {}

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
}
