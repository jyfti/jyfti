import { readConfig } from "../../files/config-file.service";
import { promptWorkflow } from "../../inquirer.service";
import { readStateOrTerminate } from "../../files/state-file.service";
import { printJson } from "../../print.service";
import { createEngine } from "../../../engine/services/engine.factory";
import { readWorkflowOrTerminate } from "../../files/workflow-file.service";

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
    const engine = createEngine(workflow);
    console.log(printJson(engine.getVariableMap(state)));
  }
}
