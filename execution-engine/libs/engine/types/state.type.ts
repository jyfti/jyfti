import { Path } from "./path.type";
import { Evaluations } from "./evaluations.type";
import { Dictionary } from "lodash";

export interface State {
  path: Path;
  inputs: Dictionary<any>;
  evaluations: Evaluations;
}
