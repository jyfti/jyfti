import {
  createEngine,
  Engine,
  Environment,
  Inputs,
  State,
  StepResult,
  Workflow,
} from "@jyfti/engine";
import logSymbols from "log-symbols";
import { OperatorFunction, from, of } from "rxjs";
import { catchError, last, mergeMap, tap } from "rxjs/operators";
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
      .pipe(step(engine, config, name, state))
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
  return engine
    .complete(state)
    .pipe(complete(engine, config, name, state))
    .toPromise();
}

function complete(
  engine: Engine,
  config: Config,
  name: string,
  state: State
): OperatorFunction<StepResult, void> {
  return (stepResult$) =>
    stepResult$.pipe(
      tap((stepResult) => console.log(printStepResult(stepResult))),
      engine.transitionFrom(state),
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

function step(
  engine: Engine,
  config: Config,
  name: string,
  state: State
): OperatorFunction<StepResult, void> {
  return (stepResult$) =>
    stepResult$.pipe(
      tap((stepResult) => console.log(printStepResult(stepResult))),
      engine.transitionFrom(state),
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
