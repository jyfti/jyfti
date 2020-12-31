import { readConfig } from "../../data-access/config.dao";
import {
  createEngine,
  StepResult,
  State,
  Engine,
  isSuccess,
  Environment,
} from "@jyfti/engine";
import { last, tap, catchError, mergeMap, takeWhile } from "rxjs/operators";
import { from, OperatorFunction, of } from "rxjs";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import { printStepResult, printJson, printOutput } from "../../print.service";
import {
  readWorkflowOrTerminate,
  readWorkflowNamesOrTerminate,
} from "../../data-access/workflow.dao";
import { writeState } from "../../data-access/state.dao";
import { readWorkflowSchemaOrTerminate } from "../../data-access/schema.dao";
import { readEnvironmentOrTerminate } from "../../data-access/environment.dao";
import {
  isUrl,
  extractWorkflowName,
  createInputs,
} from "../../data-access/workflow.util";
import { Config } from "../../types/config";
import {
  validateWorkflowOrTerminate,
  validateInputsOrTerminate,
  validateEnvironmentOrTerminate,
} from "../../validator";
import logSymbols from "log-symbols";
import { mergeEnvironments } from "../../data-access/environment.util";

export async function execute(
  name?: string,
  inputList?: string[],
  cmd?: { environment?: string; verbose?: boolean; envVar?: Environment }
): Promise<void> {
  const config = await readConfig();
  if (!name) {
    const names = await readWorkflowNamesOrTerminate(config);
    name = await promptWorkflow(names, "Which workflow do you want to start?");
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(config, name);
    const schema = await readWorkflowSchemaOrTerminate(config);
    validateWorkflowOrTerminate(workflow, schema);
    name = isUrl(name) ? extractWorkflowName(name) : name;
    const environment = mergeEnvironments([
      await readEnvironmentOrTerminate(config, cmd?.environment),
      cmd?.envVar || {},
    ]);
    validateEnvironmentOrTerminate(workflow, environment);
    if ((inputList || []).length === 0) {
      inputList = await promptWorkflowInputs(workflow);
    }
    const inputs = createInputs(workflow, inputList || []);
    validateInputsOrTerminate(workflow, inputs);
    const engine = createEngine(workflow, environment, config.outRoot);
    const initialState = engine.init(inputs);
    console.log(logSymbols.success + " Initialized");
    if (cmd?.verbose) {
      console.log(printJson(initialState));
    }
    await engine
      .complete(initialState)
      .pipe(
        process(engine, config, name, initialState),
        catchError((err) => of(console.error("Unexpected Jyfti error", err)))
      )
      .toPromise();
  }
}

function process(
  engine: Engine,
  config: Config,
  name: string,
  initialState: State
): OperatorFunction<StepResult, void> {
  return (stepResult$) =>
    stepResult$.pipe(
      tap((stepResult) => console.log(printStepResult(stepResult))),
      takeWhile(isSuccess, true),
      engine.transitionFrom(initialState),
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
