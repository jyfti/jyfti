import { readConfig } from "../../data-access/config.dao";
import { createEngine, StepResult, State, Engine } from "@jyfti/engine";
import { map, flatMap, tap } from "rxjs/operators";
import { from, OperatorFunction } from "rxjs";
import { promptWorkflow } from "../../inquirer.service";
import {
  readWorkflowNamesOrTerminate,
  readWorkflowOrTerminate,
} from "../../data-access/workflow.dao";
import { writeState, readStateOrTerminate } from "../../data-access/state.dao";
import { printStepResult, printError } from "../../print.service";
import { readEnvironmentOrTerminate } from "../../data-access/environment.dao";
import { validateEnvironmentOrTerminate } from "../../validator";
import { Config } from "../../types/config";

export async function step(
  name?: string,
  cmd?: { environment?: string; verbose?: boolean }
): Promise<void> {
  const config = await readConfig();
  if (!name) {
    const names = await readWorkflowNamesOrTerminate(config);
    name = await promptWorkflow(
      names,
      "Which workflow do you want to progress?"
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
    if (engine.isComplete(state)) {
      console.log("Workflow execution already completed");
    } else {
      engine
        .step(state)
        .pipe(process(engine, config, name, state, cmd?.verbose || false))
        .subscribe(
          () => {},
          () => {},
          () => {}
        );
    }
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
      map((stepResult) => engine.transition(state, stepResult)),
      flatMap((state) => from(writeState(config, name, state)))
    );
}
