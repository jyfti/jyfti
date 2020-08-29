import { readConfig } from "../../files/config-file.service";
import { createEngine, StepResult, State, Engine } from "@jyfti/engine";
import { last, flatMap, tap } from "rxjs/operators";
import { from, OperatorFunction } from "rxjs";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import {
  printStepResult,
  printJson,
  printOutput,
  printError,
} from "../../print.service";
import {
  readWorkflowOrTerminate,
  validateInputsOrTerminate,
  validateWorkflowOrTerminate,
  validateEnvironmentOrTerminate,
} from "../../files/workflow.service";
import { writeState } from "../../files/state-file.service";
import { readWorkflowSchemaOrTerminate } from "../../files/workflow-schema.service";
import { readEnvironmentOrTerminate } from "../../files/environment-file.service";
import {
  isUrl,
  extractWorkflowName,
  createInputs,
} from "../../files/workflow.util";
import { Config } from "../../types/config";

export async function execute(
  name?: string,
  inputList?: string[],
  cmd?: { environment?: string; verbose?: boolean }
): Promise<void> {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(config, "Which workflow do you want to start?");
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(config, name);
    const schema = await readWorkflowSchemaOrTerminate();
    validateWorkflowOrTerminate(workflow, schema);
    name = isUrl(name) ? extractWorkflowName(name) : name;
    if ((inputList || []).length === 0) {
      inputList = await promptWorkflowInputs(workflow);
    }
    const inputs = createInputs(workflow, inputList || []);
    validateInputsOrTerminate(workflow, inputs);
    const environment = await readEnvironmentOrTerminate(
      config,
      cmd?.environment
    );
    validateEnvironmentOrTerminate(workflow, environment);
    const engine = createEngine(workflow, environment);
    const initialState = engine.init(inputs);
    console.log("Created state.");
    if (cmd?.verbose) {
      console.log(printJson(initialState));
    }
    engine
      .complete(initialState)
      .pipe(process(engine, config, name, initialState, cmd?.verbose || false))
      .subscribe(
        () => {},
        () => {},
        () => {}
      );
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
      tap((state) => console.log(printOutput(engine.getOutput(state)))),
      flatMap((state) => from(writeState(config, name, state)))
    );
}
