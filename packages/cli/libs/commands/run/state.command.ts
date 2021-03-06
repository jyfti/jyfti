import { readConfig } from "../../data-access/config.dao";
import { promptWorkflow } from "../../inquirer.service";
import { readStateOrTerminate } from "../../data-access/state.dao";
import { printJson } from "../../print.service";
import { readWorkflowNamesOrTerminate } from "../../data-access/workflow.dao";

export async function state(name?: string): Promise<void> {
  const config = await readConfig();
  if (!name) {
    const names = await readWorkflowNamesOrTerminate(config);
    name = await promptWorkflow(
      names,
      "The state of which workflow do you want to see?"
    );
  }
  if (name) {
    const state = await readStateOrTerminate(config, name);
    console.log(printJson(state));
  }
}
