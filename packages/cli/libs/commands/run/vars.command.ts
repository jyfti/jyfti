import { readConfig } from "../../data-access/config-file.service";
import { promptWorkflow } from "../../inquirer.service";
import { readStateOrTerminate } from "../../data-access/state-file.service";
import { printJson } from "../../print.service";
import { createEngine } from "@jyfti/engine";
import {
  readWorkflowOrTerminate,
  readWorkflowNamesOrTerminate,
} from "../../data-access/workflow-file.service";
import { readEnvironmentOrTerminate } from "../../data-access/environment-file.service";

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
    const engine = createEngine(workflow, environment);
    console.log(printJson(engine.getVariableMap(state)));
  }
}
