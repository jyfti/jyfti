import { readConfig } from "../../data-access/config.dao";
import { promptWorkflow } from "../../inquirer.service";
import { readStateOrTerminate } from "../../data-access/state.dao";
import { printJson } from "../../print.service";
import { createEngine } from "@jyfti/engine";
import {
  readWorkflowOrTerminate,
  readWorkflowNamesOrTerminate,
} from "../../data-access/workflow.dao";
import { readEnvironmentOrTerminate } from "../../data-access/environment.dao";

export async function vars(name?: string): Promise<void> {
  const config = await readConfig();
  if (!name) {
    const names = await readWorkflowNamesOrTerminate(config);
    name = await promptWorkflow(
      names,
      "The variables of which workflow do you want to see?"
    );
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(config, name);
    const state = await readStateOrTerminate(config, name);
    const environment = await readEnvironmentOrTerminate(config, undefined);
    const engine = createEngine(workflow, environment, config.outRoot);
    console.log(printJson(engine.getVariableMap(state)));
  }
}
