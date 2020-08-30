import { readConfig } from "../../data-access/config.dao";
import { promptWorkflow } from "../../inquirer.service";
import { deleteState } from "../../data-access/state-file.service";
import { readWorkflowNamesOrTerminate } from "../../data-access/workflow-file.service";

export async function reset(name?: string): Promise<void> {
  const config = await readConfig();
  if (!name) {
    const names = await readWorkflowNamesOrTerminate(config);
    name = await promptWorkflow(names, "Which workflow do you want to reset?");
  }
  if (name) {
    await deleteState(config, name);
  }
}
