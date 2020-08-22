import { dropRight, tail } from "lodash/fp";
import { Evaluation, Evaluations, Path } from "../types";

export class EvaluationResolvementService {
  constructor() {}

  resolveEvaluation(
    evaluations: Evaluation | Evaluations,
    path: Path
  ): Evaluation | Evaluations {
    if (path.length === 0 || !evaluations) {
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
    if (path.length === 0) {
      return evaluations.concat([evaluation]);
    }
    if (path[0] < evaluations.length - 1) {
      throw new Error(
        "Can not modify sub evaluations of other than the current or next evaluation"
      );
    }
    if (path.length === 1) {
      if (path[0] === evaluations.length) {
        return evaluations.concat([evaluation]);
      } else {
        // Current evaluation hold a sub scope before and will now hold the return of the subscope
        return dropRight(1)(evaluations).concat([evaluation]);
      }
    } else {
      if (path[0] === evaluations.length) {
        return evaluations.concat([
          this.addEvaluation(
            tail(path),
            path[0] == evaluations.length - 1 ? evaluations[path[0]] : [],
            evaluation
          ),
        ]);
      } else {
        return dropRight(1)(evaluations).concat([
          this.addEvaluation(
            tail(path),
            path[0] == evaluations.length - 1 ? evaluations[path[0]] : [],
            evaluation
          ),
        ]);
      }
    }
  }
}
