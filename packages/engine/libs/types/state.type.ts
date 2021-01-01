import { Path } from "./path.type";
import { Evaluations } from "./evaluations.type";
import { Inputs } from "./inputs.type";
import { StepResult } from "./step-result.type";

export interface State {
  path: Path;
  inputs: Inputs;
  evaluations: Evaluations;
  lastStep?: StepResult;
}
