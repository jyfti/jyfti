import { readConfig } from "../../data-access/config.dao";
import { createEngine, StepResult, Engine, State } from "@jyfti/engine";
import { last, flatMap, tap, catchError } from "rxjs/operators";
import { from, OperatorFunction, empty } from "rxjs";
import { promptWorkflow } from "../../inquirer.service";
import { printStepResult, printError } from "../../print.service";
import {
  readWorkflowOrTerminate,
  readWorkflowNamesOrTerminate,
} from "../../data-access/workflow.dao";
import { writeState, readStateOrTerminate } from "../../data-access/state.dao";
import { readEnvironmentOrTerminate } from "../../data-access/environment.dao";
import { validateEnvironmentOrTerminate } from "../../validator";
import { Config } from "../../types/config";

export async function complete(
  name?: string,
  cmd?: { environment?: string; verbose?: boolean }
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
    const environment = await readEnvironmentOrTerminate(
      config,
      cmd?.environment
    );
    validateEnvironmentOrTerminate(workflow, environment);
    const engine = createEngine(workflow, environment);
    await engine
      .complete(state)
      .pipe(
        process(engine, config, name, state, cmd?.verbose || false),
        catchError(() => empty())
      )
      .toPromise();
  }
}

function process(
  engine: Engine,
  config: Config,
  name: string,
  state: State,
  verbose: boolean
): OperatorFunction<StepResult, void> {
  return (stepResult$) =>
    stepResult$.pipe(
      tap(
        (stepResult) => console.log(printStepResult(verbose, stepResult)),
        (error) => console.error("Failed " + printError(error))
      ),
      engine.transitionFrom(state),
      last(),
      flatMap((state) => from(writeState(config, name, state)))
    );
}
