import { readConfig } from "../../data-access/config.dao";
import { createEngine } from "@jyfti/engine";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import { printJson, printValue } from "../../print.service";
import {
  readWorkflowOrTerminate,
  readWorkflowNamesOrTerminate,
} from "../../data-access/workflow.dao";
import { writeState } from "../../data-access/state.dao";
import { install } from "../../install.service";
import { readWorkflowSchemaOrTerminate } from "../../data-access/schema.dao";
import { readEnvironmentOrTerminate } from "../../data-access/environment-file.service";
import {
  isUrl,
  extractWorkflowName,
  createInputs,
} from "../../data-access/workflow.util";
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
