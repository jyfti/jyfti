import { Path } from "./path.type";
import { Evaluation } from "./evaluations.type";

export interface StepResult {
  path: Path;
  evaluation: Evaluation;
}
