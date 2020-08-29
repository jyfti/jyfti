import { readConfig } from "../files/config-file.service";
import { promptWorkflow } from "../inquirer.service";
import { readWorkflowOrTerminate } from "../files/workflow.service";
import { printJson } from "../print.service";
import { readWorkflowNamesOrTerminate } from "../files/workflow-file.service";

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
