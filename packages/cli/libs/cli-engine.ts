import { isError, isFailure } from "@jyfti/engine";
import {
  createEngine,
  Engine,
  Environment,
  Inputs,
  isRequire,
  State,
  Workflow,
  isComplete,
} from "@jyfti/engine";
import logSymbols from "log-symbols";
import { OperatorFunction, from, of, Observable } from "rxjs";
import { catchError, last, map, mapTo, mergeMap, tap } from "rxjs/operators";
import { writeState } from "./data-access/state.dao";
import { promptInputs } from "./inquirer.service";
import { printStepResult, printOutput, printJson } from "./print.service";
import { Config } from "./types/config";

export function initAndRunToCompletion(
  workflow: Workflow,
  environment: Environment,
  config: Config,
  inputs: Inputs,
  name: string,
  verbose?: boolean
): Promise<boolean> {
  const engine = createEngine(workflow, environment, config.outRoot);
  const initialState = engine.init(inputs);
  console.log(logSymbols.success + " Initialized");
  if (verbose) {
    console.log(printJson(initialState));
  }
  return runToCompletion(workflow, environment, config, name, initialState);
}

export async function runStep(
  workflow: Workflow,
  environment: Environment,
  config: Config,
  name: string,
  state: State
): Promise<boolean> {
  if (isComplete(state)) {
    console.log("Workflow execution already completed");
    return Promise.resolve(true);
  } else {
    const engine = createEngine(workflow, environment, config.outRoot);
    return await engine
      .step(state)
      .pipe(
        tap((stepResult) => console.log(printStepResult(stepResult))),
        engine.transitionFrom(state),
        finish(engine, config, name)
      )
      .toPromise();
  }
}

export function runToCompletion(
  workflow: Workflow,
  environment: Environment,
  config: Config,
  name: string,
  state: State
): Promise<boolean> {
  const engine = createEngine(workflow, environment, config.outRoot);
  return complete(engine, state).pipe(finish(engine, config, name)).toPromise();
}

/**
 * Runs to completion, inquiring inputs if the engine encounters requires inputs for a step.
 */
function complete(engine: Engine, state: State): Observable<State> {
  return engine.complete(state).pipe(
    tap((stepResult) => console.log(printStepResult(stepResult))),
    engine.transitionFrom(state),
    mergeMap((state) =>
      state.lastStep && isRequire(state.lastStep)
        ? from(promptInputs(state.lastStep.require)).pipe(
            map((inputs) => ({
              ...state,
              inputs: { ...state.inputs, ...inputs },
            })),
            mergeMap((state) => complete(engine, state))
          )
        : of(state)
    )
  );
}

function finish(
  engine: Engine,
  config: Config,
  name: string
): OperatorFunction<State, boolean> {
  return (stepResult$) =>
    stepResult$.pipe(
      last(),
      tap((state) => {
        if (isComplete(state)) {
          const output = engine.getOutput(state);
          if (output) {
            console.log(printOutput(output));
          }
        }
      }),
      mergeMap((state) =>
        from(writeState(config, name, state)).pipe(mapTo(state))
      ),
      map((state) => !isError(state)),
      tap({ error: (err) => console.error("Unexpected Jyfti error", err) }),
      catchError(() => of(false))
    );
}
