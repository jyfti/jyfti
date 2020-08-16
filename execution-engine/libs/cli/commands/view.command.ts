import { readJiftConfig } from "../files/config-file.service";
import { promptWorkflow } from "../inquirer.service";
import { readWorkflowOrTerminate } from "../files/workflow-file.service";
import { printJson } from "../print.service";

export async function view(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    name = await promptWorkflow(
      jiftConfig,
      "Which workflow do you want to view?"
    );
  }
  if (name) {
    const workflow = await readWorkflowOrTerminate(jiftConfig, name);
    console.log(printJson(workflow));
  }
}
