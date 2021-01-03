import { readConfig } from "../../data-access/config.dao";
import { Environment } from "@jyfti/engine";
import { promptWorkflow } from "../../inquirer.service";
import {
  readWorkflowNamesOrTerminate,
  readWorkflowOrTerminate,
} from "../../data-access/workflow.dao";
import { readStateOrTerminate } from "../../data-access/state.dao";
import { readEnvironmentOrTerminate } from "../../data-access/environment.dao";
import { validateEnvironmentOrTerminate } from "../../validator";
import { mergeEnvironments } from "../../data-access/environment.util";
import { runStep } from "../../cli-engine";

export async function step(
  name?: string,
  cmd?: { environment?: string; envVar?: Environment; verbose?: boolean }
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
    const environment = mergeEnvironments([
      await readEnvironmentOrTerminate(config, cmd?.environment),
      cmd?.envVar || {},
    ]);
    validateEnvironmentOrTerminate(workflow, environment);
    const isSuccess = await runStep(workflow, environment, config, name, state);
    if (!isSuccess) {
      process.exit(1);
    }
  }
}
