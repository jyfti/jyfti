import { readConfig } from "../../data-access/config.dao";
import { Environment } from "@jyfti/engine";
import { promptWorkflow, promptWorkflowInputs } from "../../inquirer.service";
import {
  readWorkflowOrTerminate,
  readWorkflowNamesOrTerminate,
} from "../../data-access/workflow.dao";
import { readWorkflowSchemaOrTerminate } from "../../data-access/schema.dao";
import { readEnvironmentOrTerminate } from "../../data-access/environment.dao";
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
import { mergeEnvironments } from "../../data-access/environment.util";
import { initAndRunToCompletion } from "../../cli-engine";

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
    const isSuccess = await initAndRunToCompletion(
      workflow,
      environment,
      config,
      inputs,
      name,
      cmd?.verbose
    );
    if (!isSuccess) {
      process.exit(1);
    }
  }
}
