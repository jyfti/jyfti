import { readConfig } from "../files/config-file.service";
import { promptWorkflow } from "../inquirer.service";
import { readWorkflowOrTerminate } from "../files/workflow-file.service";
import { printJson } from "../print.service";

export async function view(name?: string) {
  const config = await readConfig();
  if (!name) {
    name = await promptWorkflow(config, "Which workflow do you want to view?");
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(config, name);
    console.log(printJson(workflow));
  }
}
