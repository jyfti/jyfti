import { readConfig } from "../../data-access/config.dao";
import {
  createEngine,
  StepResult,
  State,
  Engine,
  isFailure,
} from "@jyfti/engine";
import { flatMap, tap, catchError } from "rxjs/operators";
import { from, OperatorFunction, empty, throwError, of } from "rxjs";
import { promptWorkflow } from "../../inquirer.service";
import {
  readWorkflowNamesOrTerminate,
  readWorkflowOrTerminate,
} from "../../data-access/workflow.dao";
import { writeState, readStateOrTerminate } from "../../data-access/state.dao";
import { printStepResult } from "../../print.service";
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
      await engine
        .step(state)
        .pipe(
          process(engine, config, name, state),
          catchError(() => empty())
        )
        .toPromise();
    }
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
      tap((stepResult) =>
        console.log(
          printStepResult(engine.resolveStep(stepResult.path), stepResult)
        )
      ),
      flatMap((stepResult) =>
        isFailure(stepResult) ? throwError(stepResult.error) : of(stepResult)
      ),
      engine.transitionFrom(state),
      flatMap((state) => from(writeState(config, name, state)))
    );
}
