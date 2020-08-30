import { readConfig } from "../../files/config-file.service";
import { createEngine } from "@jyfti/engine";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import { printJson, printValue } from "../../print.service";
import { readWorkflowOrTerminate } from "../../files/workflow.service";
import { writeState } from "../../files/state-file.service";
import { install } from "../../install.service";
import { readWorkflowSchemaOrTerminate } from "../../files/workflow-schema.service";
import { readEnvironmentOrTerminate } from "../../files/environment-file.service";
import {
  isUrl,
  extractWorkflowName,
  createInputs,
} from "../../files/workflow.util";
import { readWorkflowNamesOrTerminate } from "../../files/workflow-file.service";
import {
  validateWorkflowOrTerminate,
  validateInputsOrTerminate,
  validateEnvironmentOrTerminate,
} from "../../validator";

export async function create(
  name?: string,
  inputList?: string[],
  cmd?: { yes?: boolean; environment?: string; verbose?: boolean }
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
    if (isUrl(name)) {
      name = extractWorkflowName(name);
      await install(config, workflow, schema, name, cmd?.yes || false);
      console.log(`Installed ${printValue(name)} .`);
    }
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
    const initialState = createEngine(workflow, environment).init(inputs);
    await writeState(config, name, initialState);
    console.log("Created state.");
    if (cmd?.verbose) {
      console.log(printJson(initialState));
    }
  }
}
