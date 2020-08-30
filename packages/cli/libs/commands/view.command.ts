import { readConfig } from "../data-access/config-file.service";
import { promptWorkflow } from "../inquirer.service";
import {
  readWorkflowOrTerminate,
  readWorkflowNamesOrTerminate,
} from "../data-access/workflow-file.service";
import { printJson } from "../print.service";

export async function view(name?: string): Promise<void> {
  const config = await readConfig();
  if (!name) {
    const names = await readWorkflowNamesOrTerminate(config);
    name = await promptWorkflow(names, "Which workflow do you want to view?");
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(config, name);
    console.log(printJson(workflow));
  }
}
