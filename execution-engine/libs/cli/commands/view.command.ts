import {
  readJiftConfig,
  readWorkflow,
  readWorkflowNames,
} from "../file.service";
import inquirer from "inquirer";

export async function view(name?: string) {
  const jiftConfig = await readJiftConfig();
  if (!name) {
    const workflowNames = await readWorkflowNames(jiftConfig);
    const answers = await inquirer.prompt([
      {
        name: "workflow",
        message: "Which workflow do you want to view?",
        type: "list",
        choices: workflowNames,
      },
    ]);
    name = answers.workflow;
  }
  if (name) {
    const message = await readWorkflow(jiftConfig, name)
      .then((state) => JSON.stringify(state, null, 2))
      .catch(() => "This workflow does not exist.");
    console.log(message);
  }
}
