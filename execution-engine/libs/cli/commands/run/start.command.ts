import { ensureDirExists } from "../../files/file.service";
import { readConfig } from "../../files/config-file.service";
import { createEngine } from "../../../engine/services/engine.factory";
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
} from "../../files/workflow.service";
import { writeState } from "../../files/state-file.service";
import { install } from "../../install.service";
import { readWorkflowSchemaOrTerminate } from "../../../cli/files/workflow-file.service";

export async function start(name?: string, inputList?: string[], cmd?: any) {
  const config = await readConfig();
  const schema = await readWorkflowSchemaOrTerminate();
  if (!name) {
    name = await promptWorkflow(config, "Which workflow do you want to start?");
  }
  if (name) {
    await ensureDirExists(config.outRoot);
    const workflow = await readWorkflowOrTerminate(config, name);
    if (isUrl(name)) {
      name = extractWorkflowName(name);
      await install(config, workflow, schema, name, cmd?.yes);
    }
    if ((inputList || []).length === 0) {
      inputList = await promptWorkflowInputs(workflow);
    }
    const inputs = createInputs(workflow, inputList || []);
    validateInputsOrTerminate(workflow, inputs);
    const engine = createEngine(workflow);
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
