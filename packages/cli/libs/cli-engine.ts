import {
  createEngine,
  Engine,
  Environment,
  Inputs,
  isSuccess,
  State,
  StepResult,
  Workflow,
} from "@jyfti/engine";
import logSymbols from "log-symbols";
import { OperatorFunction, from, of } from "rxjs";
import { catchError, last, mergeMap, takeWhile, tap } from "rxjs/operators";
import { writeState } from "./data-access/state.dao";
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

export function runToCompletion(
  workflow: Workflow,
  environment: Environment,
  config: Config,
  name: string,
  state: State
): Promise<void> {
  const engine = createEngine(workflow, environment, config.outRoot);
  return engine
    .complete(state)
    .pipe(
      process(engine, config, name, state),
      catchError((err) => of(console.error("Unexpected Jyfti error", err)))
    )
    .toPromise();
}

function process(
  engine: Engine,
  config: Config,
  name: string,
  state: State
): OperatorFunction<StepResult, void> {
  return (stepResult$) =>
    stepResult$.pipe(
      tap((stepResult) => console.log(printStepResult(stepResult))),
      takeWhile(isSuccess, true),
      engine.transitionFrom(state),
      last(),
      tap((state) => {
        if (!state.error) {
          const output = engine.getOutput(state);
          if (output) {
            console.log(printOutput(output));
          }
        }
      }),
      mergeMap((state) => from(writeState(config, name, state)))
    );
}
