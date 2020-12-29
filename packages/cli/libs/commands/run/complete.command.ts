import { readConfig } from "../../data-access/config.dao";
import {
  createEngine,
  StepResult,
  Engine,
  State,
  isFailure,
  Environment,
} from "@jyfti/engine";
import { last, mergeMap, tap, catchError } from "rxjs/operators";
import { from, OperatorFunction, throwError, of, EMPTY } from "rxjs";
import { promptWorkflow } from "../../inquirer.service";
import { printStepResult } from "../../print.service";
import {
  readWorkflowOrTerminate,
  readWorkflowNamesOrTerminate,
} from "../../data-access/workflow.dao";
import { writeState, readStateOrTerminate } from "../../data-access/state.dao";
import { readEnvironmentOrTerminate } from "../../data-access/environment.dao";
import { validateEnvironmentOrTerminate } from "../../validator";
import { Config } from "../../types/config";
import { mergeEnvironments } from "../../data-access/environment.util";

export async function complete(
  name?: string,
  cmd?: { environment?: string; envVar?: Environment; verbose?: boolean }
): Promise<void> {
  const config = await readConfig();
  if (!name) {
    const workflowNames = await readWorkflowNamesOrTerminate(config);
    name = await promptWorkflow(
      workflowNames,
      "Which workflow do you want to complete?"
    );
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(config, name);
    const state = await readStateOrTerminate(config, name);
    const environment = mergeEnvironments([
      await readEnvironmentOrTerminate(config, cmd?.environment),
      cmd?.envVar || {},
    ]);
    validateEnvironmentOrTerminate(workflow, environment);
    const engine = createEngine(workflow, environment);
    await engine
      .complete(state)
      .pipe(
        process(engine, config, name, state),
        catchError(() => EMPTY)
      )
      .toPromise();
  }
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
      mergeMap((stepResult) =>
        isFailure(stepResult) ? throwError(stepResult.error) : of(stepResult)
      ),
      engine.transitionFrom(state),
      last(),
      mergeMap((state) => from(writeState(config, name, state)))
    );
}
