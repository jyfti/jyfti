import { Evaluation, Evaluations, Path } from "../types";

export function resolveEvaluation(
  evaluations: Evaluation | Evaluations,
  path: Path
): Evaluation | Evaluations {
  if (path.length === 0 || !evaluations || !Array.isArray(evaluations)) {
    return evaluations;
  } else {
    return resolveEvaluation(evaluations[path[0]], path.slice(1));
  }
}

export function addEvaluation(
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
      return evaluations.slice(0, evaluations.length - 1).concat([evaluation]);
    }
  } else {
    const existingEvaluations =
      path[0] === evaluations.length - 1 ? evaluations[path[0]] : [];
    if (!Array.isArray(existingEvaluations)) {
      throw new Error(
        "Expected a list of evaluations, but got a single evaluation"
      );
    }
    const toBeAddedEvaluation = addEvaluation(
      path.slice(1),
      existingEvaluations,
      evaluation
    );
    return (path[0] === evaluations.length
      ? evaluations
      : evaluations.slice(0, evaluations.length - 1)
    ).concat([toBeAddedEvaluation]);
  }
}
