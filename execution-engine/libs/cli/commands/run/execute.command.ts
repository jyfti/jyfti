import { readConfig } from "../../files/config-file.service";
import { createEngine } from "../../../engine/services/engine";
import { last, flatMap, tap } from "rxjs/operators";
import { from } from "rxjs";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import { printStepResult, printJson, printOutput } from "../../print.service";
import {
  readWorkflowOrTerminate,
  extractWorkflowName,
  isUrl,
  validateInputsOrTerminate,
  createInputs,
  validateWorkflowOrTerminate,
  validateEnvironmentOrTerminate,
} from "../../files/workflow.service";
import { writeState } from "../../files/state-file.service";
import { readWorkflowSchemaOrTerminate } from "../../files/workflow-file.service";
import { readEnvironment } from "../../../cli/files/environment-file.service";

export async function execute(name?: string, inputList?: string[], cmd?: any) {
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
    const environment = await readEnvironment(config, undefined);
    validateEnvironmentOrTerminate(workflow, environment);
    const engine = createEngine(workflow, environment);
    const initialState = engine.init(inputs);
    console.log("Created state.");
    if (cmd?.verbose) {
      console.log(printJson(initialState));
    }
    engine
      .complete(initialState)
      .pipe(
        tap((stepResult) =>
          console.log(printStepResult(cmd?.verbose, stepResult))
        ),
        engine.toStates(inputs),
        last(),
        tap((state) => console.log(printOutput(engine.getOutput(state)))),
        flatMap((state) => from(writeState(config, name!, state)))
      )
      .subscribe();
  }
}
