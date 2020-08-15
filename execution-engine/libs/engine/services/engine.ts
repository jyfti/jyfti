import { ExecutionService } from "./execution.service";
import { Workflow } from "../types/workflow.type";
import { PathedEvaluation } from "../types/pathed-evaluation.type";
import { State } from "../types/state.type";
import { Observable, empty, OperatorFunction } from "rxjs";
import { flatMap, startWith, map, scan } from "rxjs/operators";

export const initialState: State = { path: [0], evaluations: [] };

export class Engine {
  constructor(private workflow: Workflow, public service: ExecutionService) {}

  run(): Observable<PathedEvaluation> {
    return this.complete(initialState);
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

  toStates(): OperatorFunction<PathedEvaluation, State> {
    return (pathedEvaluation$) =>
      pathedEvaluation$.pipe(scan(this.toState.bind(this), initialState));
  }

  toState(state: State, pathedEvaluation: PathedEvaluation): State {
    return this.service.nextState(
      this.workflow,
      state,
      pathedEvaluation.evaluation
    );
  }
}
