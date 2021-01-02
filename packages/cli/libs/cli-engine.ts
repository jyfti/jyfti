import {
  createEngine,
  Engine,
  Environment,
  Inputs,
  isRequire,
  State,
  Workflow,
} from "@jyfti/engine";
import logSymbols from "log-symbols";
import { OperatorFunction, from, of, Observable } from "rxjs";
import { catchError, last, map, mergeMap, tap } from "rxjs/operators";
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
): Promise<void> {
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
): Promise<void> {
  const engine = createEngine(workflow, environment, config.outRoot);
  if (engine.isComplete(state)) {
    console.log("Workflow execution already completed");
  } else {
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
): Promise<void> {
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
            map((inputs) => ({ ...state, inputs })),
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
): OperatorFunction<State, void> {
  return (stepResult$) =>
    stepResult$.pipe(
      last(),
      tap((state) => {
        if (engine.isComplete(state)) {
          const output = engine.getOutput(state);
          if (output) {
            console.log(printOutput(output));
          }
        }
      }),
      mergeMap((state) => from(writeState(config, name, state))),
      catchError((err) => of(console.error("Unexpected Jyfti error", err)))
    );
}
