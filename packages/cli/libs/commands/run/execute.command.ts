import { readConfig } from "../../data-access/config.dao";
import { createEngine, StepResult, State, Engine } from "@jyfti/engine";
import { last, flatMap, tap, catchError } from "rxjs/operators";
import { from, OperatorFunction, empty } from "rxjs";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import {
  printStepResult,
  printJson,
  printOutput,
  printError,
} from "../../print.service";
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

export async function execute(
  name?: string,
  inputList?: string[],
  cmd?: { environment?: string; verbose?: boolean }
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
    const environment = await readEnvironmentOrTerminate(
      config,
      cmd?.environment
    );
    validateEnvironmentOrTerminate(workflow, environment);
    if ((inputList || []).length === 0) {
      inputList = await promptWorkflowInputs(workflow);
    }
    const inputs = createInputs(workflow, inputList || []);
    validateInputsOrTerminate(workflow, inputs);
    const engine = createEngine(workflow, environment);
    const initialState = engine.init(inputs);
    console.log("Created state.");
    if (cmd?.verbose) {
      console.log(printJson(initialState));
    }
    await engine
      .complete(initialState)
      .pipe(
        process(engine, config, name, initialState, cmd?.verbose || false),
        catchError(() => empty())
      )
      .toPromise();
  }
}

function process(
  engine: Engine,
  config: Config,
  name: string,
  initialState: State,
  verbose: boolean
): OperatorFunction<StepResult, void> {
  return (stepResult$) =>
    stepResult$.pipe(
      tap(
        (stepResult) => console.log(printStepResult(verbose, stepResult)),
        (error) => console.error("Failed " + printError(error))
      ),
      engine.transitionFrom(initialState),
      last(),
      tap((state) => {
        const output = engine.getOutput(state);
        if (output) {
          console.log(printOutput(output));
        }
      }),
      flatMap((state) => from(writeState(config, name, state)))
    );
}
