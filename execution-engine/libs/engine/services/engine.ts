import { ExecutionService } from "./execution.service";
import { Workflow } from "../types/workflow.type";
import { PathedEvaluation } from "../types/pathed-evaluation.type";
import { State } from "../types/state.type";
import { Observable, empty } from "rxjs";
import { flatMap, startWith, map } from "rxjs/operators";

export class Engine {
  constructor(private workflow: Workflow, public service: ExecutionService) {}

  run(): Observable<PathedEvaluation> {
    return this.complete({ path: [0], evaluations: [] });
  }

  complete(state: State): Observable<PathedEvaluation> {
    return this.step(state).pipe(
      flatMap((pathedEvaluation) => {
        const nextState = this.service.nextState(
          this.workflow,
          state,
          pathedEvaluation.evaluation
        );
        const continuingSteps =
          nextState.path.length == 0 ? empty() : this.complete(nextState);
        return continuingSteps.pipe(startWith(pathedEvaluation));
      })
    );
  }

  step(state: State): Observable<PathedEvaluation> {
    return this.service
      .nextStep(this.workflow, state)
      .pipe(map((evaluation) => ({ path: state.path, evaluation })));
  }
}
