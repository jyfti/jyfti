import { readConfig } from "../../data-access/config-file.service";
import { promptWorkflow } from "../../inquirer.service";
import { readStateOrTerminate } from "../../data-access/state-file.service";
import { printJson } from "../../print.service";
import { readWorkflowNamesOrTerminate } from "../../data-access/workflow-file.service";

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
