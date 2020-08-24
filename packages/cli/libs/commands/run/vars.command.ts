import { readConfig } from "../../files/config-file.service";
import { promptWorkflow } from "../../inquirer.service";
import { readStateOrTerminate } from "../../files/state-file.service";
import { printJson } from "../../print.service";
import { createEngine } from "@jyfti/engine";
import { readWorkflowOrTerminate } from "../../files/workflow-file.service";
import { readEnvironmentOrTerminate } from "../../files/environment-file.service";

export async function vars(name?: string) {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(
      config,
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
