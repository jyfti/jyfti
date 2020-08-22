import { readConfig } from "../../files/config-file.service";
import { createEngine } from "../../../engine/services/engine";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import { printJson } from "../../print.service";
import {
  readWorkflowOrTerminate,
  extractWorkflowName,
  isUrl,
  validateInputsOrTerminate,
  createInputs,
  validateWorkflowOrTerminate,
} from "../../files/workflow.service";
import { writeState } from "../../files/state-file.service";
import { install } from "../../install.service";
import { readWorkflowSchemaOrTerminate } from "../../../cli/files/workflow-file.service";
import { readEnvironment } from "../../../cli/files/environment-file.service";

export async function create(name?: string, inputList?: string[], cmd?: any) {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(config, "Which workflow do you want to start?");
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(config, name);
    const schema = await readWorkflowSchemaOrTerminate();
    validateWorkflowOrTerminate(workflow, schema);
    if (isUrl(name)) {
      name = extractWorkflowName(name);
      await install(config, workflow, schema, name, cmd?.yes);
    }
    if ((inputList || []).length === 0) {
      inputList = await promptWorkflowInputs(workflow);
    }
    const inputs = createInputs(workflow, inputList || []);
    validateInputsOrTerminate(workflow, inputs);
    const environment = await readEnvironment(config, undefined);
    const initialState = createEngine(workflow, environment).init(inputs);
    await writeState(config, name, initialState);
    console.log("Created state.");
    if (cmd?.verbose) {
      console.log(printJson(initialState));
    }
  }
}
