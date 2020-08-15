import { ExecutionService } from "./execution.service";
import { Workflow } from "../types/workflow.type";
import { StepResult } from "../types/step-result.type";
import { State } from "../types/state.type";
import { Observable, empty, OperatorFunction } from "rxjs";
import { flatMap, startWith, map, scan } from "rxjs/operators";

export const initialState: State = { path: [0], evaluations: [] };

export class Engine {
  constructor(private workflow: Workflow, public service: ExecutionService) {}

  run(): Observable<StepResult> {
    return this.complete(initialState);
  }

  complete(state: State): Observable<StepResult> {
    return this.step(state).pipe(
      flatMap((stepResult) => {
        const nextState = this.toState(state, stepResult);
        const nextStepResults = this.isComplete(nextState)
          ? empty()
          : this.complete(nextState);
        return nextStepResults.pipe(startWith(stepResult));
      })
    );
  }

  step(state: State): Observable<StepResult> {
    return this.service
      .nextStep(this.workflow, state)
      .pipe(map((evaluation) => ({ path: state.path, evaluation })));
  }

  isComplete(state: State): boolean {
    return state.path.length == 0;
  }

  toStates(): OperatorFunction<StepResult, State> {
    return (stepResult$) =>
      stepResult$.pipe(scan(this.toState.bind(this), initialState));
  }

  toState(state: State, stepResult: StepResult): State {
    return this.service.nextState(this.workflow, state, stepResult.evaluation);
  }
}
