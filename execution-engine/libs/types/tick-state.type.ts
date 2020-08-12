import { Path } from "./path.type";
import { Dataflow } from "./dataflow.type";
import { Evaluations } from "./evaluations.type";

export interface TickState {
  dataflow: Dataflow;
  path: Path;
  evaluations: Evaluations;
}
